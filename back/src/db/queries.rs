use sqlite;
use std::process;
use base64::{engine::general_purpose, Engine as _};
use crate::{db, errors::{
    UserCreationError, 
    UserLoginError, 
    CatCreationError
}};

pub fn create_user(user: &db::User) -> Result<(), UserCreationError> {
    let connection = db::open_connection();
    let gender = match &user.gender {
        Some(g) => format!("'{}'", g),
        None => "NULL".to_string(),
    };
    let age = match user.age {
        Some(a) => a.to_string(),
        None => "NULL".to_string(),
    };

    let query = format!("INSERT INTO user (username, password, gender, age, isAdmin) VALUES (
            '{}', '{}', {}, {}, {}
        )", user.username, user.password, gender, age, user.is_admin as u8
    );

    if user_exists(&user.username)? {
        return Err(UserCreationError::UserAlreadyExists);
    }

    connection.execute(query).map_err(UserCreationError::DbError)?;

    Ok(())
}

pub fn user_exists(username: &str) -> Result<bool, UserCreationError> {
    let connection = db::open_connection();
    let query = "SELECT COUNT(*) FROM user WHERE username = ?";
    
    let mut statement = connection.prepare(query).unwrap_or_else(|err| {
        eprintln!("Error while preparing statement. Error: {err}");
        process::exit(1);
    });
    statement.bind((1, username)).unwrap_or_else(|err| {
        eprintln!("Error while binding statement. Error: {err}");
        process::exit(1);
    });

    if let Ok(sqlite::State::Row) = statement.next() {
        let count = statement.read::<i64, _>(0).unwrap_or_else(|err| {
            eprintln!("Error while reading statement result. Error: {err}");
            process::exit(1);
        });

        return Ok(count > 0);
    }

    Ok(false)
}

pub fn get_password(username: &str) -> Result<String, UserLoginError> {
    let connection = db::open_connection();

    if !user_exists(&username).map_err(|err| {
        match err {
            UserCreationError::DbError(err) => UserLoginError::DbError(err),
            _ => UserLoginError::UnknownError,
        }
    })? {
        return Err(UserLoginError::UserDoesNotExist);
    }

    let query = "SELECT password FROM user WHERE username = ?";
    let mut statement = connection.prepare(query).map_err(UserLoginError::DbError)?;
    statement.bind((1, username)).map_err(UserLoginError::DbError)?;

    if let Ok(sqlite::State::Row) = statement.next() {
        let password: String = statement.read(0).map_err(UserLoginError::DbError)?;
        return Ok(password);
    }

   Err(UserLoginError::UnknownError)
}

pub fn add_cat(cat: &db::Cat) -> Result<(), CatCreationError> {
    let connection = db::open_connection();

    let image_data = general_purpose::STANDARD.decode(&cat.image).map_err(|_| CatCreationError::InvalidImage)?;

    let query = "INSERT INTO cats (name, info, image) VALUES (?, ?, ?)";
    let mut statement = connection.prepare(query).map_err(CatCreationError::DbError)?;

    statement.bind((1, cat.name.as_str())).map_err(CatCreationError::DbError)?;
    statement.bind((2, cat.description.as_str())).map_err(CatCreationError::DbError)?;
    statement.bind((3, image_data.as_slice())).map_err(CatCreationError::DbError)?;

    statement.next().map_err(CatCreationError::DbError)?;

    Ok(())
}
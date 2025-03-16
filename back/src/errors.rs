use sqlite;

#[derive(Debug)]
pub enum UserCreationError {
    UserAlreadyExists,
    DbError(sqlite::Error),
}

#[derive(Debug)]
pub enum UserLoginError {
    UserDoesNotExist,
    InvalidPassword,
    UnknownError,
    DbError(sqlite::Error),
}

#[derive(Debug)]
pub enum CatCreationError {
    InvalidImage,
    DbError(sqlite::Error),
}

#[derive(Debug)]
pub enum CatRetrievalError {
    DbError(sqlite::Error),
}

#[derive(Debug)]
pub enum DishCreationError {
    DbError(sqlite::Error),
}

#[derive(Debug)]
pub enum DishRetrievalError {
    DbError(sqlite::Error),
}
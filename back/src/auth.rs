use std::{process, env};
use crate::{queries, db, errors::UserLoginError};
use argon2::{
    password_hash::{
        rand_core::OsRng,
        PasswordHash, PasswordHasher, PasswordVerifier, SaltString, Error
    },
    Argon2
};

pub fn hash(password: &str) -> Result<String, Error> {
    let salt = SaltString::generate(&mut OsRng);

    let argon2 = Argon2::default();

    let hashed_password = argon2.hash_password(password.as_bytes(), &salt)?;

    Ok(hashed_password.to_string())
}

pub fn check_password(user: &db::User) -> Result<(), UserLoginError> {
    let hashed_password = queries::get_password(&user.username)?;

    let parsed_hash = PasswordHash::new(&hashed_password).unwrap_or_else(|err| {
        eprintln!("Error while parsing hash. Error: {err}");
        process::exit(1);
    });

    if !Argon2::default().verify_password(user.password.as_bytes(), &parsed_hash).is_ok() {
        return Err(UserLoginError::InvalidPassword);
    }

    Ok(())
}
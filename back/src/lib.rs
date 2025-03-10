use std::{env, process};
use dotenv::dotenv;
use argon2::{
    password_hash::{
        rand_core::OsRng,
        PasswordHash, PasswordHasher, SaltString, Error
    },
    Argon2
};

pub mod db;
pub mod admin;
pub mod errors;

pub fn bind_config() -> (String, u16) {
    dotenv().ok();

    let bind_url = env::var("BIND_URL").unwrap_or_else(|err| {
        eprintln!("Error while trying to get 'BIND_URL' env variable. Error: {err}");
        process::exit(1);
    });
    let port: u16 = env::var("PORT")
        .unwrap_or_else(|err| {
            eprintln!("Error while trying to get 'PORT' env variable. Error: {err}");
            process::exit(1);
        })
        .parse()
        .unwrap_or_else(|err| {
            eprintln!("Error while parsing 'PORT' env variable. Error: {err}");
            process::exit(1);
        });

    (bind_url, port)
}

pub fn hash(password: &str) -> Result<String, Error> {
    let salt = SaltString::generate(&mut OsRng);

    let argon2 = Argon2::default();

    let hashed_password = argon2.hash_password(password.as_bytes(), &salt)?;

    Ok(hashed_password.to_string())
}
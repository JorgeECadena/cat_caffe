use std::{process, env};
use crate::{queries, db, errors::UserLoginError};
use dotenv::dotenv;
use actix_web;
use argon2::{
    password_hash::{
        rand_core::OsRng,
        PasswordHash, PasswordHasher, PasswordVerifier, SaltString, Error
    },
    Argon2
};
use jsonwebtoken::{encode, decode, EncodingKey, DecodingKey, Validation, Header};
use serde::{Serialize, Deserialize};
use chrono::{Utc, Duration};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    sub: String,
    exp: usize,
    pub is_admin: bool,
}

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

pub fn generate_jwt(user: &db::User) -> Result<String, jsonwebtoken::errors::Error> {
    dotenv().ok();

    let secret = env::var("JWT_KEY").unwrap_or_else(|err| {
        eprintln!("Error while retreiving 'JWT_KEY' env variable. Error: {err}");
        process::exit(1);
    });

    let expiration = Utc::now() + Duration::hours(24);

    let claims = Claims {
        sub: user.username.to_owned(),
        exp: expiration.timestamp() as usize,
        is_admin: user.is_admin,
    };

    encode(&Header::default(), &claims, &EncodingKey::from_secret(secret.as_ref()))
}

pub fn validate_jwt(token: &str) -> Result<Claims, actix_web::Error> {
    let secret = env::var("JWT_KEY").unwrap_or_else(|err| {
        eprintln!("Error while retrieving 'JWT_KEY'. Error: {err}");
        process::exit(1);
    });
    let decoding_key = DecodingKey::from_secret(secret.as_ref());

    let token_data = decode::<Claims>(token, &decoding_key, &Validation::default())
        .map_err(|_| actix_web::error::ErrorUnauthorized("Invalid token"))?;

    let claims = token_data.claims;

    if claims.exp < Utc::now().timestamp() as usize {
        return Err(actix_web::error::ErrorUnauthorized("Token expired"));
    }

    Ok(claims)
}
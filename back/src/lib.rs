use std::{env, process};
use dotenv::dotenv;
use crate::{db::{queries}};

pub mod db;
pub mod admin;
pub mod errors;
pub mod auth;

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
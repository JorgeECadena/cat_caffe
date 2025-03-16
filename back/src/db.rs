use sqlite;
use dotenv::dotenv;
use serde::{ Serialize };
use std::{ env, process };

pub mod tables;
pub mod queries;

#[derive(Debug, Default)]
pub struct User {
    pub username: String,
    pub password: String,
    pub gender: Option<String>,
    pub age: Option<u8>,
    pub is_admin: bool,
}

#[derive(Debug, Default, Serialize)]
pub struct Cat {
    pub name: String,
    pub description: String,
    pub image: String,
}

pub fn open_connection() -> sqlite::Connection {
    dotenv().ok();

    let db = env::var("DB_NAME").unwrap_or_else(|err| {
        eprintln!("Error while openning the DB connection. Error: {err}");
        process::exit(1);
    });

    sqlite::open(db)
        .unwrap_or_else(|err| {
            eprintln!("Error while opening connection to database Error: {err}");
            process::exit(1);
        })
}
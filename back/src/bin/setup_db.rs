use dotenv::dotenv;
use std::{process};
use back::db::{ self, tables };

fn main() {
    dotenv().ok();

    let connection = db::open_connection();
    
    tables::create_menu(&connection).unwrap_or_else(|err| {
        eprintln!("Error while creating table 'menu', error: {err}");
        process::exit(1);
    });

    tables::create_cats(&connection).unwrap_or_else(|err| {
        eprintln!("Error while creating table 'cats', erorr: {err}");
        process::exit(1);
    });

    tables::create_user(&connection).unwrap_or_else(|err| {
        eprintln!("Error while creating table 'user', error: {err}");
        process::exit(1);
    });
}
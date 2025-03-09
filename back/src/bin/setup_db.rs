use sqlite;
use dotenv::dotenv;
use std::{ env, process };
use back::db::tables;

fn main() {
    dotenv().ok();

    let db = env::var("DB_NAME").unwrap_or_else(|err| {
        eprintln!("Error while retreiving 'DB_NAME' env variable. Error: {err}");
        process::exit(1);
    });

    let connection = sqlite::open(db)
        .unwrap_or_else(|err| {
            eprintln!("Error while opening connection to database Error: {err}");
            process::exit(1);
        });
    
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
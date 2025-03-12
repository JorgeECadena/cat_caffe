use actix_cors::Cors;
use actix_web::{post, web, http, App, HttpResponse, HttpServer, Responder};
use dotenv::dotenv;
use serde_json::json;
use back::{ self, admin, auth, db::{self, queries}, errors::{UserCreationError, UserLoginError} };
use std::{ env, process };

#[post("/admin/register")]
async fn register_admin(req: web::Json<admin::RegisterRequest>) -> impl Responder {
    dotenv().ok();

    let admin_code = env::var("ADMIN_KEY").unwrap_or_else(|err| {
        eprintln!("Error while retrieving 'ADMIN_KEY' env variable. Error: {err}");
        process::exit(1);
    });

    if req.admin_code != admin_code {
        return HttpResponse::Forbidden().json(json!({
            "error": "Codigo de administrador invalido"
        }));
    }

    let password = auth::hash(&req.password).unwrap_or_else(|err| {
        eprintln!("Error while hashing password. Error: {err}");
        process::exit(1);
    });

    let user = db::User {
        username: req.username.clone(),
        password: password,
        is_admin: true,
        ..Default::default()
    };

    match queries::create_user(&user) {
        Ok(_) => {
            HttpResponse::Ok().json(json!({
                "message": "Usuario registrado correctamente"
            }))
        },
        Err(UserCreationError::UserAlreadyExists) => {
            HttpResponse::Conflict().json(json!({
                "error": "El usuario ya existe"
            }))
        },
        Err(UserCreationError::DbError(err)) => {
            eprintln!("Database error: {err}");
            process::exit(1);
        }
    }
}

#[post("/admin/login")]
async fn sign_in_admin(req: web::Json<admin::LoginRequest>) -> impl Responder {
    let user = db::User {
        username: req.username.clone(),
        password: req.password.clone(),
        is_admin: true,
        ..Default::default()
    };

    match auth::check_password(&user) {
        Ok(_) => {
            let token = auth::generate_jwt(&user).unwrap_or_else(|err| {
                eprintln!("Error while generating JWT. Error: {err}");
                process::exit(1);
            });

            HttpResponse::Ok().json(json!({
                "token": token
            }))
        },
        Err(UserLoginError::UserDoesNotExist) => {
            HttpResponse::NotFound().json(json!({
                "error": "El usuario no existe"
            }))
        },
        Err(UserLoginError::InvalidPassword) => {
            HttpResponse::Forbidden().json(json!({
                "error": "Password invalido"
            }))
        },
        Err(UserLoginError::DbError(err)) => {
            eprintln!("Database error: {err}");
            process::exit(1);
        },
        Err(UserLoginError::UnknownError) => {
            eprintln!("Unknown error.");
            process::exit(1);
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        dotenv().ok();
        let allowed_origin = env::var("ALLOWED_ORIGIN").unwrap_or_else(|err| {
            eprintln!("Error while retrieving 'ALLOWED_ORIGIN'. Error: {err}");
            process::exit(1);
        });
        let cors = Cors::default()
            .allowed_origin(&allowed_origin)
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers([http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);
        App::new()
            .wrap(cors)
            .service(register_admin)
            .service(sign_in_admin)
    })
    .bind(back::bind_config())?
    .run()
    .await
}
use actix_cors::Cors;
use actix_web::{post, web, http, App, HttpResponse, HttpServer, Responder};
use dotenv::dotenv;
use serde_json::json;
use back::{ self, admin, db::{self, queries}, errors::UserCreationError };
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

    let password = back::hash(&req.password).unwrap_or_else(|err| {
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
    })
    .bind(back::bind_config())?
    .run()
    .await
}
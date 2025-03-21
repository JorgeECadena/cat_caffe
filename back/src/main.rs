use actix_cors::Cors;
use actix_web::{get, post, web, http, App, HttpResponse, HttpServer, Responder};
use dotenv::dotenv;
use serde_json::json;
use back::{ self, admin, auth, db::{self, queries}, errors::{
    UserCreationError, 
    UserLoginError, 
    CatCreationError, 
    CatRetrievalError, 
    DishCreationError,
    DishRetrievalError
} };
use std::{ env, process };

#[post("/register")]
async fn register(req: web::Json<back::UserCreationRequest>) -> impl Responder {
    let password = auth::hash(&req.password).unwrap_or_else(|err| {
        eprintln!("Error while hashing password. Error: {err}");
        process::exit(1);
    });

    let user = db::User {
        username: req.username.clone(),
        password: password,
        is_admin: false,
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

#[post("/login")]
async fn sign_in(req: web::Json<admin::LoginRequest>) -> impl Responder {
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

#[post("/admin/validate-token")]
async fn validate_admin_token(req: web::Json<admin::JWT>) -> impl Responder {
    match auth::validate_jwt(&req.token) {
        Ok(claims) => {
            if !claims.is_admin {
                return HttpResponse::Forbidden().json(json!({
                    "error": "Usuario no autorizado"
                }));
            }

            HttpResponse::Ok().json(json!({
                "message": "success"
            }))
        },
        Err(_) => {
            HttpResponse::Forbidden().json(json!({
                "error": "Token invalido, intenta volver a iniciar sesion"
            }))
        }
    }
}

#[post("/admin/cat/create")]
async fn create_cat(req: web::Json<admin::CatCreation>) -> impl Responder {
    let cat = db::Cat {
        name: req.name.clone(),
        description: req.description.clone(),
        image: req.image.clone()
    };

    match queries::add_cat(&cat) {
        Ok(_) => {
            HttpResponse::Ok().json(json!({
                "message": "Gato registrado correctamente"
            }))
        },
        Err(CatCreationError::InvalidImage) => {
            HttpResponse::BadRequest().json(json!({
                "error": "Error al decodificar la imagen"
            }))
        },
        Err(CatCreationError::DbError(_)) => {
            HttpResponse::InternalServerError().json(json!({
                "error": "Algo salio mal al guardar el gato"
            }))
        }
    }
}

#[post("/admin/menu/add")]
async fn add_food(req: web::Json<admin::DishCreation>) -> impl Responder {
    let dish = db::Dish {
        name: req.name.clone(),
        price: req.price.clone(),
    };

    match queries::add_dish(&dish) {
        Ok(_) => {
            HttpResponse::Ok().json(json!({
                "message": "Platillo agregado con exito"
            }))
        },
        Err(DishCreationError::DbError(_)) => {
            HttpResponse::InternalServerError().json(json!({
                "error": "Algo salio mal al guardar el platillo"
            }))
        }
    }
}

#[get("/admin/cat/list")]
async fn get_cats() -> impl Responder {
    match queries::get_all_cats() {
        Ok(cats) => {
            HttpResponse::Ok().json(cats)
        },
        Err(CatRetrievalError::DbError(err)) => {
            eprintln!("Error: {err}");
            HttpResponse::InternalServerError().json(json!({
                "error": "No se pudieron obtener los gatos"
            }))
        }
    }
}

#[get("/admin/menu/list")]
async fn get_menu() -> impl Responder {
    match queries::get_all_menu() {
        Ok(dishes) => {
            HttpResponse::Ok().json(dishes)
        },
        Err(DishRetrievalError::DbError(err)) => {
            eprintln!("Error: {err}");
            HttpResponse::InternalServerError().json(json!({
                "error": "No se pudo obtener el menu"
            }))
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
            .allow_any_origin()
            .allowed_origin(&allowed_origin)
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers([http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);
        App::new()
            .wrap(cors)
            .service(register_admin)
            .service(register)
            .service(sign_in)
            .service(sign_in_admin)
            .service(validate_admin_token)
            .service(create_cat)
            .service(add_food)
            .service(get_cats)
            .service(get_menu)
    })
    .bind(back::bind_config())?
    .run()
    .await
}
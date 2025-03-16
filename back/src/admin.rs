use serde::{ Deserialize, Serialize };

#[derive(Deserialize, Serialize)]
pub struct RegisterRequest {
    pub username: String,
    pub password: String,
    pub confirmation: String,
    pub admin_code: String,
}

#[derive(Deserialize, Serialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Deserialize, Serialize)]
pub struct JWT {
    pub token: String,
}

#[derive(Deserialize, Serialize)]
pub struct CatCreation {
    pub name: String,
    pub description: String,
    pub image: String,
}

#[derive(Deserialize, Serialize)]
pub struct DishCreation {
    pub name: String,
    pub price: f64,
}
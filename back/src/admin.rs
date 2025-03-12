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
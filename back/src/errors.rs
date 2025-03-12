use sqlite;

#[derive(Debug)]
pub enum UserCreationError {
    UserAlreadyExists,
    DbError(sqlite::Error),
}

#[derive(Debug)]
pub enum UserLoginError {
    UserDoesNotExist,
    InvalidPassword,
    UnknownError,
    DbError(sqlite::Error),
}
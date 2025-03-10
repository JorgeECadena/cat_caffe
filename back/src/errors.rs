use sqlite;

#[derive(Debug)]
pub enum UserCreationError {
    UserAlreadyExists,
    DbError(sqlite::Error),
}
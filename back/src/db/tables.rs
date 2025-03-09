use sqlite;

pub fn create_menu(conn: &sqlite::Connection) -> sqlite::Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS menu(
            name TEXT NOT NULL,
            price REAL NOT NULL
        )"
    )
}

pub fn create_cats(conn: &sqlite::Connection) -> sqlite::Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS cats(
            name TEXT NOT NULL,
            image BLOB NOT NULL,
            info TEXT NOT NULL
        )"
    )
}

pub fn create_user(conn: &sqlite::Connection) -> sqlite::Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS user(
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            gender TEXT,
            age INTEGER,
            isAdmin INTEGER
        )"
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_menu() {
        let connection = sqlite::open(":memory:").expect("Failed to open test db");
        let result = create_menu(&connection);
        assert!(result.is_ok());
    }

    #[test]
    fn test_create_cats() {
        let connection = sqlite::open(":memory:").expect("Failed to open test db");
        let result = create_cats(&connection);
        assert!(result.is_ok());
    }

    #[test]
    fn test_create_user() {
        let connection = sqlite::open(":memory:").expect("Failed to open test db");
        let result = create_user(&connection);
        assert!(result.is_ok());
    }
}
import LoginForm from "./LoginForm";
import styles from "./Generics.module.css";

function AdminLogin() {
    return (
        <>
            <div className={styles.pageContainer}>
                <div className={`${styles.container} bg-mountain`}>
                    <h1 className="no-margin ta-center">Iniciar sesion</h1>
                    <LoginForm />
                </div>
            </div>
        </>
    );
}

export default AdminLogin;
import RegistrationForm from "./RegistrationForm";
import styles from "./Generics.module.css";

function AdminRegister() {
    return (
        <>
            <div className={styles.pageContainer}>
                <div className={`${styles.container} bg-mountain`}>
                    <h1 className="no-margin">Registrar</h1>
                    <RegistrationForm />
                </div>
            </div>
        </>
    );
}

export default AdminRegister;
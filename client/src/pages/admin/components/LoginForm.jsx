import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./Forms.module.css";

function LoginForm() {
    const [formData, setFormData] = useState({username: "", password: ""});
    const [error, setError] = useState("");

    const redirect = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegisterRedirect = () => {
        redirect("/admin/create-user");
    };

    const handleSubmit = (e) => {
        console.log("Barbo");
    }

    return (
        <>
            <form onSubmit={handleSubmit} className={`${styles.form} ta-start`}>
                {error && <p className="no-magin ta-center error">{error}</p>}

                <div className={styles.field}>
                    <p className="no-margin">Nombre de usuario:</p>
                    <input 
                        type="text" 
                        className={`${styles.input} bg-vanilla`}
                        name="username"
                        placeholder="Nombre de usuario"
                        value={FormData.username}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.field}>
                    <p className="no-margin">Password:</p>
                    <input 
                        type="text" 
                        className={`${styles.input} bg-vanilla`}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.buttons}>
                    <div className={styles.secondaryContainer}>
                        <p className="no-margin fs-12 ta-center">No tienes cuenta?</p>
                        <button type="button" onClick={handleRegisterRedirect} className={`${styles.button} ${styles.secondaryBtn} bg-mustang vanilla fw-bold`}>Registrarse</button>
                    </div>

                    <button type="submit" className={`${styles.button} ${styles.primaryBtn} bg-saddle vanilla fw-bold`}>Iniciar sesion</button>
                </div>
            </form>
        </>
    );
}

export default LoginForm;
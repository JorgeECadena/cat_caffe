import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { register } from "../../../utils/validation";
import styles from "./Forms.module.css";

const API_URL = import.meta.env.VITE_API_URL;

function RegistrationForm() {
    const [formData, setFormData] = useState({username: "", password: "", confirmation: ""});
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const redirect = useNavigate();

    const handleCode = (e) => {
        setCode(e.target.value);
    };

    const handleLoginRedirect = () => {
        redirect("/admin/login");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (error) {
            setError("");
        }

        if (success) {
            setSuccess("");
        }

        const validationError = register(formData);

        if (validationError) {
            setError(validationError);
            return;
        }

        const requestBody = {
            ...formData,
            admin_code: code
        };

        try {
            const response = await fetch(`${API_URL}/admin/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.status === 403) {
                const errorJson = await response.json();
                const errorMessage = errorJson.error;
                setError(errorMessage);
                return;
            }
            else if (response.status === 409) {
                const errorJson = await response.json();
                const errorMessage = errorJson.error;
                setError(errorMessage);
                return;
            }
            else if (!response.ok) {
                setError("Ha ocurrido un error al registrar usuario");
                return;
            }
            const json = await response.json();

            setSuccess(json.message);
            setFormData({username: "", password: "", confirmation: ""});
            setCode("");
        } catch (err) {
            setError("Error al registrar usuario");
        }
    }

    return (
            <>
                <form onSubmit={handleSubmit} className={`${styles.form} ta-start`}>
                    {error && <p className="no-margin ta-center error">{error}</p>}
                    {success && <p className="no-margin ta-center success">{success}</p>}
                    <div className={styles.field}>
                        <p className="no-margin">Nombre de usuario:</p>
                        <input 
                            className={`${styles.input} bg-vanilla`}
                            type="text" 
                            name="username"
                            placeholder="Nombre de usuario"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.field}>
                        <p className="no-margin">Password:</p>
                        <input 
                            className={`${styles.input} bg-vanilla`}
                            onChange={handleChange}
                            placeholder="Password"
                            value={formData.password}
                            type="password" 
                            name="password"
                        />
                    </div>
                    <div className={styles.field}>
                        <p className="no-margin">Confirmar password:</p>
                        <input 
                            type="password" 
                            name="confirmation"
                            onChange={handleChange}
                            placeholder="Confirmar password"
                            value={formData.confirmation}
                            className={`${styles.input} bg-vanilla`}
                        />
                    </div>
                    <div className={styles.field}>
                        <p className="no-margin">Codigo de administrador:</p>
                        <input 
                            onChange={handleCode}
                            value={code}
                            placeholder="Codigo de administrador"
                            type="password" 
                            className={`${styles.input} bg-vanilla`}
                        />
                    </div>

                    <div className={styles.buttons}>
                        <div className={styles.secondaryContainer}>
                            <p className="no-margin  fs-12 ta-center">Ya tienes cuenta?</p>
                            <button type="button" className={`${styles.button} ${styles.secondaryBtn} bg-mustang vanilla fw-bold`} onClick={handleLoginRedirect}>Iniciar sesion</button>
                        </div>

                        <button className={`${styles.button} ${styles.primaryBtn} bg-saddle vanilla fw-bold`} type="submit">Registrarse</button>
                    </div>
                </form>
            </>
    );
}

export default RegistrationForm;
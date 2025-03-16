import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { register } from "../../utils/validation";
import forms from "../admin/components/Forms.module.css";

const API_URL = import.meta.env.VITE_API_URL;

function RegisterForm() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmation: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const redirect = useNavigate();

    const handleLoginRedirect = () => {
        redirect("/login");
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

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
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
        } catch (err) {
            setError("Error al registrar usuario");
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className={`${forms.form} ta-start`}>
                {error && <p className="no-margin ta-center error">{error}</p>}
                {success && (
                    <p className="no-margin ta-center success">{success}</p>
                )}
                <div className={forms.field}>
                    <p className="no-margin">Nombre de usuario:</p>
                    <input
                        className={`${forms.input} bg-vanilla`}
                        type="text"
                        name="username"
                        placeholder="Nombre de usuario"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className={forms.field}>
                    <p className="no-margin">Password:</p>
                    <input
                        className={`${forms.input} bg-vanilla`}
                        onChange={handleChange}
                        placeholder="Password"
                        value={formData.password}
                        type="password"
                        name="password"
                    />
                </div>
                <div className={forms.field}>
                    <p className="no-margin">Confirmar password:</p>
                    <input
                        type="password"
                        name="confirmation"
                        onChange={handleChange}
                        placeholder="Confirmar password"
                        value={formData.confirmation}
                        className={`${forms.input} bg-vanilla`}
                    />
                </div>

                <div className={forms.buttons}>
                    <div className={forms.secondaryContainer}>
                        <p className="no-margin  fs-12 ta-center">
                            Ya tienes cuenta?
                        </p>
                        <button
                            type="button"
                            className={`${forms.button} ${forms.secondaryBtn} bg-mustang vanilla fw-bold`}
                            onClick={handleLoginRedirect}
                        >
                            Iniciar sesion
                        </button>
                    </div>

                    <button
                        className={`${forms.button} ${forms.primaryBtn} bg-saddle vanilla fw-bold`}
                        type="submit"
                    >
                        Registrarse
                    </button>
                </div>
            </form>
        </>
    );
}

export default RegisterForm;

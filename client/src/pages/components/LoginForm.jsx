import { useNavigate } from "react-router-dom";
import { useState } from "react";
import forms from "../admin/components/Forms.module.css";

const API_URL = import.meta.env.VITE_API_URL;

function LoginForm() {
    const [formData, setFormData] = useState({username: "", password: ""});
    const [error, setError] = useState("");

    const redirect = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegisterRedirect = () => {
        redirect("/create-user");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (error) {
            setError("");
        }

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.status === 403) {
                setError("Password invalido");
                return;
            } else if (response.status === 404) {
                setError("El usuario no existe");
                return;
            } else if (!response.ok) {
                setError("Ocurrio un error, vuelve a intentarlo!");
                return;
            }

            const json = await response.json();
            const token = json.token;

            localStorage.setItem("token", token);
            
            redirect("/");
        } catch (e) {
            console.log("Exception caught while making the request", e);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={`${forms.form} ta-start`}>
                {error && <p className="no-margin ta-center error">{error}</p>}

                <div className={forms.field}>
                    <p className="no-margin">Nombre de usuario:</p>
                    <input 
                        type="text" 
                        className={`${forms.input} bg-vanilla`}
                        name="username"
                        placeholder="Nombre de usuario"
                        value={FormData.username}
                        onChange={handleChange}
                    />
                </div>

                <div className={forms.field}>
                    <p className="no-margin">Password:</p>
                    <input 
                        type="password" 
                        className={`${forms.input} bg-vanilla`}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div className={forms.buttons}>
                    <div className={forms.secondaryContainer}>
                        <p className="no-margin fs-12 ta-center">No tienes cuenta?</p>
                        <button type="button" onClick={handleRegisterRedirect} className={`${forms.button} ${forms.secondaryBtn} bg-mustang vanilla fw-bold`}>Registrarse</button>
                    </div>

                    <button type="submit" className={`${forms.button} ${forms.primaryBtn} bg-saddle vanilla fw-bold`}>Iniciar sesion</button>
                </div>
            </form>
        </>
    );
}

export default LoginForm;
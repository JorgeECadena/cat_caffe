import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { register } from "../../../utils/validation";
import "./RegistrationForm.css";
import "../../../App.css";

const API_URL = import.meta.env.VITE_API_URL;

function RegistrationForm() {
    const [formData, setFormData] = useState({username: "", password: "", confirmation: ""});
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

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
        const validationError = register(formData);

        if (validationError) {
            setError(validationError);
            return;
        }

        const requestBody = {
            ...formData,
            adminCode: code
        };

        try {
            const response = await fetch(`${API_URL}/admin/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) throw new Error("Error registering user");

            console.log(response);
        } catch (err) {
            console.error(err);
        }
    }

    return (
            <>
                <form onSubmit={handleSubmit} className="form ta-start">
                    {error && <p className="no-margin ta-center error">{error}</p>}
                    <div className="field">
                        <p className="no-margin">Nombre de usuario:</p>
                        <input 
                            className="input bg-vanilla"
                            type="text" 
                            name="username"
                            placeholder="Nombre de usuario"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="field">
                        <p className="no-margin">Password:</p>
                        <input 
                            className="input bg-vanilla"
                            onChange={handleChange}
                            placeholder="Password"
                            value={formData.password}
                            type="password" 
                            name="password"
                        />
                    </div>
                    <div className="field">
                        <p className="no-margin">Confirmar password:</p>
                        <input 
                            type="password" 
                            name="confirmation"
                            onChange={handleChange}
                            placeholder="Confirmar password"
                            value={formData.confirmation}
                            className="input bg-vanilla" 
                        />
                    </div>
                    <div className="field">
                        <p className="no-margin">Codigo de administrador:</p>
                        <input 
                            onChange={handleCode}
                            value={code}
                            placeholder="Codigo de administrador"
                            type="password" 
                            className="input bg-vanilla" 
                        />
                    </div>

                    <div className="buttons">
                        <div className="login">
                            <p className="no-margin  fs-12 ta-center">Ya tienes cuenta?</p>
                            <button type="button" className="button login-btn bg-mustang vanilla fw-bold" onClick={handleLoginRedirect}>Iniciar sesion</button>
                        </div>

                        <button className="button register-btn bg-saddle vanilla fw-bold" type="submit">Registrarse</button>
                    </div>
                </form>
            </>
    );
}

export default RegistrationForm;
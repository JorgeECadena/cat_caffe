import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
            <form onSubmit={handleSubmit} className="form ta-start">
                {error && <p className="no-magin ta-center error">{error}</p>}

                <div className="field">
                    <p className="no-margin">Nombre de usuario:</p>
                    <input 
                        type="text" 
                        className="input bg-vanilla" 
                        name="username"
                        placeholder="Nombre de usuario"
                        value={FormData.username}
                        onChange={handleChange}
                    />
                </div>

                <div className="field">
                    <p className="no-margin">Password:</p>
                    <input 
                        type="text" 
                        className="input bg-vanilla" 
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="buttons">
                    <div className="register">
                        <p className="no-margin fs-12 ta-center">No tienes cuenta?</p>
                        <button type="button" onClick={handleRegisterRedirect} className="button login-btn bg-mustang vanilla fw-bold">Registrarse</button>
                    </div>

                    <button type="submit" className="button register-btn bg-saddle vanilla fw-bold">Iniciar sesion</button>
                </div>
            </form>
        </>
    );
}

export default LoginForm;
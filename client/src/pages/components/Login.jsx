import generics from "../admin/components/Generics.module.css";
import LoginForm from "./LoginForm";

function Login() {
    return (
        <>
            <div className={generics.pageContainer}>
                <div className={`${generics.container} bg-mountain`}>
                    <h1 className="no-margin ta-center">Iniciar sesion</h1>
                    <LoginForm />
                </div>
            </div>
        </>
    );
}

export default Login;
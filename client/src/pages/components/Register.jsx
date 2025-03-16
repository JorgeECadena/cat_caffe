import generics from "../admin/components/Generics.module.css";
import RegisterForm from "./RegisterForm";

function Register() {
    return (
        <>
            <div className={generics.pageContainer}>
                <div className={`${generics.container} bg-mountain`}>
                    <h1 className="no-margin">Registrarse</h1>
                    <RegisterForm />
                </div>
            </div>
        </>
    );
}

export default Register;
import LoginForm from "./LoginForm";

function AdminLogin() {
    return (
        <>
            <div className="page-container">
                <div className="container bg-mountain">
                    <h1 className="no-margin ta-center">Iniciar sesion</h1>
                    <LoginForm />
                </div>
            </div>
        </>
    );
}

export default AdminLogin;
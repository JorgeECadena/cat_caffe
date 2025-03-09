import RegistrationForm from "./RegistrationForm";
import "./Register.css";
import "../../../App.css";

function AdminRegister() {
    return (
        <>
            <div className="page-container">
                <div className="container bg-mountain">
                    <h1 className="no-margin">Registrar</h1>
                    <RegistrationForm />
                </div>
            </div>
        </>
    );
}

export default AdminRegister;
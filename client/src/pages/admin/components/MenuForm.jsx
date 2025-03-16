import { useNavigate } from "react-router-dom";
import { useState } from "react";
import generics from "./Generics.module.css";
import forms from "./Forms.module.css";

const API_URL = import.meta.env.VITE_API_URL;

function MenuForm() {
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({"name": "", "price": ""});

    const redirect = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: name === "price" ? (value === "" ? "" : parseInt(value, 10)) : value
        });
    };

    const handleCancel = () => {
        redirect("/admin");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (error) {
            setError("");
        }

        try {
            const response = await fetch(`${API_URL}/admin/menu/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });

            if (response.status === 400) {
                const errorJson = await response.json();
                const errorMessage = errorJson.error;
                setError(errorMessage);
                return;
            }

            const json = await response.json();

            console.log(json);
        } catch (e) {
            setError(`Unexpected error: ${e}`);
        }
    };

    return (
        <>
            <div className={`${generics.pageContainer}`}>
                <div className={`${generics.container} bg-mountain`}>
                    <h1 className={`no-margin ta-center`}>Agregar al menu</h1>

                    <form onSubmit={handleSubmit} className={`${forms.form} ta-start`}>
                        { error && <p className="no-margin ta-center error">{error}</p>}
                        <div className={`${forms.field}`}>
                            <p className="no-margin">Nombre del platillo:</p>
                            <input 
                                type="text" 
                                placeholder="Nombre del platillo"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`${forms.input} bg-vanilla`} 
                            />
                        </div>

                        <div className={`${forms.field}`}>
                            <p className="no-margin">Precio del platillo:</p>
                            <input 
                                type="number" 
                                step="1"
                                min="0"
                                placeholder="Precio"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className={`${forms.input} bg-vanilla`} 
                            />
                        </div>

                        <div className={`${forms.buttons}`}>
                            <div className={`${forms.secondaryContainer}`}>
                                <button type="button" className={`${forms.button} ${forms.secondaryBtn} bg-mustang vanilla fw-bold`} onClick={handleCancel}>Cancelar</button>
                            </div>

                            <button type="submit" className={`${forms.button} ${forms.primaryBtn} bg-saddle vanilla fw-bold`}>Agregar platillo</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default MenuForm;
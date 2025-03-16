import { useNavigate } from "react-router-dom";
import { useState } from "react";
import generics from "./Generics.module.css";
import forms from "./Forms.module.css";

const API_URL = import.meta.env.VITE_API_URL;

function CatForm() {
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({"name": "", "description": "", "image": ""});

    const redirect = useNavigate();

    const handleCancel = () => {
        redirect("/admin");
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setError("Error al subir el archivo, favor de subirlo de nuevo.");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            const base64String = reader.result.split(",")[1];
            setFormData({
                ...formData,
                image: base64String, 
            });
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (error) {
            setError("");
        }

        try {
            const response = await fetch(`${API_URL}/admin/cat/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.status == 400) {
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
                    <h1 className={`no-margin ta-center`}>Crear gato</h1>

                    <form onSubmit={handleSubmit} className={`${forms.form} ta-start`}>
                        {error && <p className="no-margin ta-center error">{error}</p>}
                        <div className={`${forms.field}`}>
                            <p className={`no-margin`}>Nombre del gato:</p>
                            <input 
                                type="text" 
                                placeholder="Nombre del gato"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`${forms.input} bg-vanilla`} 
                            />
                        </div>

                        <div className={`${forms.field}`}>
                            <p className={`no-margin`}>Descripcion del gato:</p>
                            <input 
                                type="text" 
                                placeholder="Descripcion"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={`${forms.input} bg-vanilla`}
                            />
                        </div>

                        <div className={`${forms.field}`}>
                            <p className={`no-margin`}>Imagen del gato:</p>
                            <input 
                                type="file" 
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>  

                        <div className={`${forms.buttons}`}>
                            <div className={`${forms.secondaryContainer}`}>
                                <button type="button" className={`${forms.button} ${forms.secondaryBtn} bg-mustang vanilla fw-bold`} onClick={handleCancel}>Cancelar</button>
                            </div>
                            <button className={`${forms.button} ${forms.primaryBtn} bg-saddle vanilla fw-bold`} type="submit">Crear gato</button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
}

export default CatForm;
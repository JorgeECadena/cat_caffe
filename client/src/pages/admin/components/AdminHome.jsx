import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CatList from "./CatList";
import generics from "./Generics.module.css";
import styles from "./Home.module.css";

function AdminHome() {
    const [showCats, setShowCats] = useState(false);

    const redirect = useNavigate();

    const handleAdd = () => {
        redirect("/admin/create-cat");
    };

    const handleShowCats = () => {
        setShowCats(!showCats);
    };

    return (
        <>
            <div className={`${generics.pageContainer}`}>
                <div className={`${generics.container} bg-mountain`}>
                    <h1 className={``}>Tablas</h1>

                    <div className={`${styles.container} bg-saddle`}>
                        <h2 className={`no-margin vanilla`}>Cats</h2>

                        <div className={`${styles.btnsContainer}`}>
                            <button className={`${styles.button} bg-mustang vanilla fw-bold`} onClick={handleShowCats} >Ver</button>
                            <button className={`${styles.button} bg-mustang vanilla fw-bold`} onClick={handleAdd}>Agregar</button>
                        </div>
                    </div>
                    { showCats && <CatList /> }
                </div>
            </div>
        </>
    );
}

export default AdminHome;

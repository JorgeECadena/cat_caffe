import { useNavigate } from "react-router-dom";
import generics from "./Generics.module.css";
import styles from "./Home.module.css";

function AdminHome() {
    const redirect = useNavigate();

    const handleAdd = () => {
        redirect("/admin/create-cat");
    };

    return (
        <>
            <div className={`${generics.pageContainer}`}>
                <div className={`${generics.container} bg-mountain`}>
                    <h1 className={``}>Tablas</h1>

                    <div className={`${styles.container} bg-saddle`}>
                        <h2 className={`no-margin vanilla`}>Cats</h2>

                        <div className={`${styles.btnsContainer}`}>
                            <button className={`${styles.button} bg-mustang vanilla fw-bold`} >Ver</button>
                            <button className={`${styles.button} bg-mustang vanilla fw-bold`} onClick={handleAdd}>Agregar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminHome;

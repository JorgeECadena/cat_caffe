import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CatList from "./CatList";
import DishList from "./DishList"
import generics from "./Generics.module.css";
import styles from "./Home.module.css";

function AdminHome() {
    const [showCats, setShowCats] = useState(false);
    const [showDishes, setShowDishes] = useState(false);

    const redirect = useNavigate();

    const handleAddCats = () => {
        redirect("/admin/create-cat");
    };
    const handleAddMenu = () => {
        redirect("/admin/add-menu");
    };

    const handleShowCats = () => {
        setShowCats(!showCats);
    };
    const handleShowDishes = () => {
        setShowDishes(!showDishes);
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
                            <button className={`${styles.button} bg-mustang vanilla fw-bold`} onClick={handleAddCats}>Agregar</button>
                        </div>
                    </div>
                    { showCats && <CatList /> }

                    <div className={`${styles.container} bg-saddle`}>
                        <h2 className={`no-margin vanilla`}>Menu</h2>

                        <div className={`${styles.btnsContainer}`}>
                            <button className={`${styles.button} bg-mustang vanilla fw-bold`} onClick={handleShowDishes}>Ver</button>
                            <button className={`${styles.button} bg-mustang vanilla fw-bold`} onClick={handleAddMenu}>Agregar</button>
                        </div>
                    </div>
                    { showDishes && <DishList />}
                </div>
            </div>
        </>
    );
}

export default AdminHome;
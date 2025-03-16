import { useState, useEffect } from "react";
import styles from "./DishList.module.css";

const API_URL = import.meta.env.VITE_API_URL;

function DishList() {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const response = await fetch(`${API_URL}/admin/menu/list`);

                if (!response.ok) {
                    console.log("Something went wrong");
                }

                const data = await response.json();
                setDishes(data);

            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDishes();
    }, []);

    if (loading) return <p className="no-margin">Loading...</p>;
    if (error) return <p classname="no-margin">Error: {error}</p>;
    if (dishes.length === 0) return <p className="no-margin">No dishes found</p>;

    return (
        <>
            <div className={`${styles.dishList}`}>
                {dishes.map((dish) => (
                    <div key={dish.name} className={`${styles.dishCard}`}>
                        <h3 className={`${styles.dishName}`}>{dish.name}</h3>
                        <p className={`${styles.dishPrice}`}>${dish.price}</p>
                    </div>
                ))}
            </div>
        </>
    );
}

export default DishList;
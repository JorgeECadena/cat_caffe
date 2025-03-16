import { useState, useEffect } from "react";
import styles from "./CatList.module.css";

const API_URL = import.meta.env.VITE_API_URL;

function CatList() {
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const response = await fetch(`${API_URL}/admin/cat/list`);

                if (!response.ok) {
                    console.log("Error while fetching cats");
                }

                const data = await response.json();
                console.log(data);
                setCats(data);
            } catch (e) {
                console.log("Error: ", e)
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCats();
    }, []);

    if (loading) return <p className="no-margin">Loading...</p>;
    if (error) return <p className="no-margin">Error: {error}</p>;
    if (cats.length === 0) return <p className="no-margin">No cats found.</p>;

    return (
        <>
            <div className={styles.catList}>
                {cats.map((cat) => (
                    <div key={cat.name} className={styles.catCard}>
                        <h3 className="no-margin">{cat.name}</h3>
                        <p className="no-margin">{cat.description}</p>
                        <img src={`data:image/jpeg;base64,${cat.image}`} alt={cat.name} className={styles.catImage} />
                    </div>
                ))}
            </div>
        </>
    );
}

export default CatList;
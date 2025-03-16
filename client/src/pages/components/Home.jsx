import CatList from "../admin/components/CatList";
import DishList from "../admin/components/DishList";
import styles from "./Home.module.css";

function Home() {
    return (
        <>
           <div className={styles.pageContainer}>
                {/* ✅ Header */}
                <header className={styles.header}>
                    <h1>Cat Caffe</h1>
                </header>

                {/* ✅ "Sobre Nosotros" Section */}
                <section className={styles.aboutSection}>
                    <h2>Sobre Nosotros</h2>
                    <p>
                        Bienvenidos a Cat Caffe, un lugar donde puedes disfrutar de un café delicioso
                        en compañía de adorables gatos rescatados. Nos dedicamos a brindar un espacio 
                        acogedor tanto para nuestros clientes como para nuestros felinos.
                    </p>
                </section>

                {/* ✅ Render the cats */}
                <section className={styles.catsSection}>
                    <h2>Conoce a nuestros gatos</h2>
                    <CatList />
                </section>

                {/* ✅ Render the menu */}
                <section className={styles.menuSection}>
                    <h2>Menú</h2>
                    <DishList />
                </section>
            </div> 
        </>
    );
}

export default Home;
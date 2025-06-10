import Footer from '../ui/Footer/Footer';
import Navbar from '../ui/Navbar/Navbar';
import styles from './Nosotros.module.css';

const Nosotros: React.FC = () => {
  return (
    <div className={styles.infoPageContainer}>
      <Navbar />
      <div className={styles.infoContainer}>
        <h1>Sobre Nosotros</h1>
        <p>
          Fundada en 1925 por Don Maximiliano Herrero, nuestra empresa comenzó como un pequeño taller de confección de ropa en el barrio de San Telmo, Buenos Aires. Con esfuerzo, dedicación y un compromiso inquebrantable con la calidad, Don Maximiliano transformó su pasión por el diseño y la confección en una marca reconocida y respetada en el mundo de la moda.
        </p>
        <p>
          A lo largo de las décadas, nuestra empresa ha sabido adaptarse a las nuevas tendencias, sin perder de vista sus raíces artesanales. Con el paso de los años, pasamos de ser un taller familiar a una red de tiendas distribuidas en las principales ciudades del país. Cada una de nuestras prendas refleja la tradición, el cuidado y el esmero que nos han distinguido desde nuestros inicios.
        </p>
        <p>
          En la actualidad, seguimos apostando por la innovación, combinando materiales de primera calidad con diseños exclusivos que buscan satisfacer las necesidades de un público exigente y cosmopolita. Nos enorgullece mantener una producción responsable, respetuosa con el medio ambiente y con las comunidades que nos rodean.
        </p>
        <p>
          El legado de Don Maximiliano sigue presente en cada costura y en cada diseño, recordándonos que el éxito verdadero se construye sobre la base del esfuerzo, la pasión y el compromiso con cada uno de nuestros clientes.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Nosotros;

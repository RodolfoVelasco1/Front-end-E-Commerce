import Footer from '../ui/Footer/Footer';
import Navbar from '../ui/Navbar/Navbar';
import styles from './Nosotros.module.css';


const Admin: React.FC = () => {
  

  

  return (
    
    <div className={styles.infoPageContainer}>
        <Navbar />
        
      <div className={styles.infoContainer}>
        <h1>Sobre Nosotros</h1>
        <p>MadMax Indumentaria es una empresa fundada hace 100 años por Maximiliano Herrero, también conocido como "El Loco Max" (De ahí su nombre en inglés).</p>
        <p>Max creía que la ropa nos volvía esclavos del sistema y así decidió vender toda su ropa en la calle, incluso la que llevaba puesta.</p>
        <p>Cuando vio como la gente hacía fila para comprar su ropa, utilizó sus ganancias para abrir un pequeño local de ropa.</p>
        <p>Ese local se convirtió en una franquisia, y esa franquisia se convirtió en una de las tiendas de ropa más caras del mundo.</p>
        <p>Lamentablemente, el Loco Max fue asesinado por su mejor amigo Enzo DiLado quien robó su fortuna y se quedó con su esposa, sus hijos y su empresa.</p>
        <p>Afortunadamente, la policía pudo arrestarlo, y después de 10 días de trabajo comunitario, fue puesto en libertad por buen comportamiento.</p>
        <p>Ahora, arrepentido del crimen que cometió, Enzo volvió a la presidencia de la empresa para cumplir el sueño de su amigo Max: vender ropa barata y de mala calidad a precios muy caros para hacer mucho dinero.</p>
        <p> ~ En memoria del Loco Max, para nosotros siempre serás MadMax ~</p>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
import Footer from '../ui/Footer/Footer';
import ListaProductos from '../ui/ListaProductos/ListaProductos';
import Navbar from '../ui/Navbar/Navbar';
import styles from './Admin.module.css';


const Admin: React.FC = () => {
  

  

  return (
    
    <div className={styles.adminContainer}>
        <Navbar />
        
      <div className={styles.sidebar}>
        <h1>ADMINISTRACIÓN</h1>
        <ListaProductos />
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
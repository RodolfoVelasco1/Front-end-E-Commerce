import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  
  return (
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <Link to="/">MadMax Indumentaria</Link>
          </div>

          <div className={styles.footerLinks}>
            <h3>LINKS</h3>
            <ul>
              <li><Link to="/sobre-nosotros">SOBRE NOSOTROS</Link></li>
              <li><Link to="/libro-quejas">LIBRO DE QUEJAS ONLINE</Link></li>
              <li><Link to="/devoluciones">DEVOLUCIONES</Link></li>
            </ul>
          </div>

          <div className={styles.footerContact}>
                <h3>CONTACTO</h3>
                <p>+54 9 291 630 6205</p>
                <p>Cnel. Rodríguez, 273</p>
                <div className={styles.socialLinks}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-facebook"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-twitter"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram"></i>
                </a>
                </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import useStore from '../../../store/store';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const cartItemsCount = useStore(state => state.getCartItemsCount());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link to="/" className={styles.logoLink}>
          <div className={styles.logo}>MadMax Indumentaria</div>
        </Link>

        <div className={styles.navLinks}>
          <Link to="/hombre" className={styles.navLink}>Hombre</Link>
          <Link to="/mujer" className={styles.navLink}>Mujer</Link>
          <Link to="/nino" className={styles.navLink}>Unisex</Link>
          <Link to="/ofertas" className={styles.navLink}>Ofertas</Link>
        </div>

        <div className={styles.navbarRight}>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchButton}>
              <i className="fas fa-search"></i>
            </button>
          </form>

          <div className={styles.navbarIcons}>
            <Link to="/account" className={styles.iconLink}>
              <i className="fas fa-user"></i>
            </Link>
            <Link to="/cart" className={styles.iconLink}>
              <div className={styles.cartIconContainer}>
                <i className="fas fa-shopping-cart"></i>
                {cartItemsCount > 0 && (
                  <span className={styles.cartBadge}>{cartItemsCount}</span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
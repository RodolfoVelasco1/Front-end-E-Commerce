import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from './Navbar.module.css';
import useStore from '../../../store/store';

interface Imagen { id: number; url: string; alt: string; }
interface Producto {
  id: number;
  nombre: string;
}
interface DetalleProducto {
  id: number;
  color: string;
  producto: Producto;
  imagenes: Imagen[];
}

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DetalleProducto[]>([]);
  
  // Store hooks
  const cartItemsCount = useStore(state => state.getCartItemsCount());
  const isAuthenticated = useStore(state => state.isAuthenticated());
  const logout = useStore(state => state.logout);
  const initializeAuth = useStore(state => state.initializeAuth);
  
  const navigate = useNavigate();

  // Inicializar auth al montar el componente
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:3001/detallesProductos?_expand=producto');
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Error cargando productos para búsqueda:', error);
      }
    };

    fetchProductos();
  }, []);

  const filteredResults = searchQuery
    ? searchResults.filter(producto =>
        producto.producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredResults.length > 0) {
      navigate(`/producto/${filteredResults[0].producto.id}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
        navigate('/account'); // Redirige a la página de cuenta
      });
      }
    });
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
          <Link to="/unisex" className={styles.navLink}>Unisex</Link>
          <Link to="/ofertas" className={styles.navLink}>Ofertas</Link>
        </div>

        <div className={styles.navbarRight}>
          <form className={styles.searchForm} onSubmit={handleSearch} style={{ position: 'relative' }}>
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

            {/* Dropdown */}
            {searchQuery && filteredResults.length > 0 && (
              <div className={styles.searchDropdown}>
                {filteredResults.slice(0, 5).map(producto => (
                  <div
                    key={producto.id}
                    className={styles.searchResult}
                    onClick={() => {
                      setSearchQuery('');
                      navigate(`/producto/${producto.producto.id}`);
                    }}
                  >
                    {producto.producto.nombre}
                  </div>
                ))}
              </div>
            )}
          </form>

          <div className={styles.navbarIcons}>
            {/* Iconos condicionales basados en el estado de autenticación */}
            {isAuthenticated ? (
              <>
                {/* Icono para ir al perfil de usuario */}
                <Link to="/usuario" className={styles.iconLink} title="Mi Perfil">
                  <i className="fas fa-user-circle"></i>
                </Link>
                
                {/* Icono para cerrar sesión */}
                <button 
                  onClick={handleLogout} 
                  className={styles.iconButton}
                  title="Cerrar Sesión"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </>
            ) : (
              /* Icono para iniciar sesión (solo cuando NO está autenticado) */
              <Link to="/account" className={styles.iconLink} title="Iniciar Sesión">
                <i className="fas fa-user"></i>
              </Link>
            )}
            
            <Link to="/carrito" className={styles.iconLink}>
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
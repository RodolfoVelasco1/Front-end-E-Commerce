import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import Swal from 'sweetalert2';
import Footer from '../ui/Footer/Footer';
import Navbar from '../ui/Navbar/Navbar';
import ProductCard from '../ui/ProductCard/ProductCard';
import { useProductStore } from '../../store/productStore';

const Home = () => {
  // Acceder al store de productos
  const { detallesProductos, fetchProductos } = useProductStore();
  const navigate = useNavigate();

  // Cargar productos cuando se monta el componente
  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Seleccionar 3 productos aleatorios del store
  const getRandomProducts = () => {
    // Asegurarse de que hay productos disponibles
    if (!detallesProductos || detallesProductos.length === 0) {
      return [];
    }

    // Copiar el array para no modificar el original
    const shuffled = [...detallesProductos].filter(detalle => detalle.activo);
    
    // Si hay menos de 3 productos, devolver todos
    if (shuffled.length <= 3) {
      return shuffled;
    }
    
    // Seleccionar 3 productos aleatorios
    const result = [];
    for (let i = 0; i < 3 && shuffled.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * shuffled.length);
      result.push(shuffled.splice(randomIndex, 1)[0]);
    }
    
    return result;
  };

  // Mostrar notificación al agregar producto al carrito
  const handleAddToCart = (productName: string) => {
    Swal.fire({
      title: '¡Producto agregado!',
      text: `${productName} ha sido agregado al carrito`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Handle buy now click
  const handleBuyNow = () => {
    navigate('/productos');
  };

  // Handle view all products
  const handleViewAllProducts = () => {
    navigate('/productos');
  };

  // Obtener productos aleatorios para mostrar
  const randomProducts = getRandomProducts();

  return (
    <div className={styles.container}>
      <Navbar />
      <section className={styles.homeSection}>
        <div className={styles.homeBackground}>
          
        </div>
        <div className={styles.homeContent}>
          <h1 className={styles.homeText}>
            <span>100 años</span> ofreciéndote <br />
            <span className={styles.highlight}>la mejor</span> calidad
          </h1>
          <button className={styles.ctaButton} onClick={handleBuyNow}>
            COMPRAR AHORA
          </button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className={styles.featuredSection}>
        <h2 className={styles.sectionTitle}>Conocé algunos de nuestros productos</h2>
        <div className={styles.showcaseContainer}>
          <div className={styles.productCards}>
            {randomProducts.map((detalleProducto) => (
              <div key={detalleProducto.id} className={styles.productCardWrapper}>
                <ProductCard 
                  detalleProducto={detalleProducto} 
                  onAddToCart={() => handleAddToCart(detalleProducto.producto.nombre)}
                />
              </div>
            ))}
            <div className={styles.viewAllContainer}>
            <button 
              className={styles.viewAllButton}
              onClick={handleViewAllProducts}
            >
              Ver todos los productos
            </button>
          </div>
          </div>
          
        </div>
      </section>

      {/* Categories Sections */}
      <section className={styles.categoriesSection}>
        <div className={styles.categoryCard} onClick={() => navigate('/indumentaria')}>
          <div className={styles.categoryIndumentaria}>
            <h2 className={styles.categoryTitle}>INDUMENTARIA</h2>
          </div>
        </div>
        
        <div className={styles.categoryCard} onClick={() => navigate('/calzado')}>
          <div className={styles.categoryCalzado}>
            <h2 className={styles.categoryTitle}>CALZADO</h2>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
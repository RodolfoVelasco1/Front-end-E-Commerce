import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProductDetailPage.module.css';
import useStore from '../../store/store';
import Footer from '../ui/Footer/Footer';
import Navbar from '../ui/Navbar/Navbar';


// Interfaces
interface Categoria {
  id: number;
  nombre: string;
}

interface Descuento {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  porcentaje: number;
}

interface Imagen {
  id: number;
  url: string;
  alt: string;
}

interface Producto {
  id: number;
  nombre: string;
  sexo: 'MASCULINO' | 'FEMENINO' | 'UNISEX';
  precio_compra: number;
  precio_venta: number;
  tipoProducto: 'INDUMENTARIA' | 'CALZADO';
  categorias: Categoria[];
}

interface Stock {
  id: number;
  stock: number;
  talle: {
    id: number;
    name: string;
  };
}

interface DetalleProducto {
  id: number;
  color: string;
  activo: boolean;
  producto: Producto;
  descuento: Descuento | null;
  imagenes: Imagen[];
  stocks: Stock[];
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useStore();

  // Estados
  const [detalleProducto, setDetalleProducto] = useState<DetalleProducto | null>(null);
  const [detallesDisponibles, setDetallesDisponibles] = useState<DetalleProducto[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedTalle, setSelectedTalle] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Cargar producto y variantes
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // Obtener todos los detalles de productos
        const response = await fetch('http://localhost:3001/detallesProductos');
        if (!response.ok) throw new Error('Error al cargar producto');
        
        const allDetalles: DetalleProducto[] = await response.json();
        
        // Filtrar por el ID del producto
        const productVariants = allDetalles.filter(
          detalle => detalle.producto.id === parseInt(id) && detalle.activo
        );
        
        if (productVariants.length === 0) {
          throw new Error('Producto no encontrado');
        }
        
        setDetallesDisponibles(productVariants);
        setDetalleProducto(productVariants[0]);
        setSelectedColor(productVariants[0].color);
        
        // Obtener talles disponibles para el primer color
        const tallesDisponibles = productVariants[0].stocks
          .filter(stock => stock.stock > 0)
          .map(stock => stock.talle.name);
        
        if (tallesDisponibles.length > 0) {
          setSelectedTalle(tallesDisponibles[0]);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Actualizar producto cuando cambia el color
  useEffect(() => {
    if (selectedColor && detallesDisponibles.length > 0) {
      const selectedVariant = detallesDisponibles.find(
        detalle => detalle.color === selectedColor
      );
      
      if (selectedVariant) {
        setDetalleProducto(selectedVariant);
        setSelectedImageIndex(0);
        
        // Resetear talle seleccionado y seleccionar el primero disponible
        const tallesDisponibles = selectedVariant.stocks
          .filter(stock => stock.stock > 0)
          .map(stock => stock.talle.name);
        
        if (tallesDisponibles.length > 0) {
          setSelectedTalle(tallesDisponibles[0]);
        } else {
          setSelectedTalle('');
        }
      }
    }
  }, [selectedColor, detallesDisponibles]);

  // Verificar si el descuento está activo
  const isDescuentoActivo = (descuento: Descuento | null): boolean => {
    if (!descuento) return false;
    
    const now = new Date();
    const fechaInicio = new Date(descuento.fechaInicio);
    const fechaFin = new Date(descuento.fechaFin);
    
    return now >= fechaInicio && now <= fechaFin;
  };

  // Obtener precio final
  const getPrecioFinal = () => {
    if (!detalleProducto) return 0;
    
    const descuentoActivo = isDescuentoActivo(detalleProducto.descuento);
    return descuentoActivo && detalleProducto.descuento
      ? detalleProducto.producto.precio_venta * (1 - detalleProducto.descuento.porcentaje / 100)
      : detalleProducto.producto.precio_venta;
  };

  // Obtener stock disponible para talle seleccionado
  const getStockDisponible = () => {
    if (!detalleProducto || !selectedTalle) return 0;
    
    const stockInfo = detalleProducto.stocks.find(
      stock => stock.talle.name === selectedTalle
    );
    
    return stockInfo ? stockInfo.stock : 0;
  };

  // Obtener colores únicos disponibles
  const getColoresDisponibles = () => {
    return [...new Set(detallesDisponibles.map(detalle => detalle.color))];
  };

  // Obtener talles disponibles para el color seleccionado
  const getTallesDisponibles = () => {
    if (!detalleProducto) return [];
    
    return detalleProducto.stocks
      .filter(stock => stock.stock > 0)
      .map(stock => stock.talle.name);
  };

  // Manejar agregar al carrito
  const handleAddToCart = () => {
    if (!detalleProducto || !selectedTalle || quantity <= 0) return;
    
    const stockDisponible = getStockDisponible();
    if (quantity > stockDisponible) {
      alert(`Solo hay ${stockDisponible} unidades disponibles`);
      return;
    }

    const cartProduct = {
      id: detalleProducto.id, // Usamos el ID del detalle para distinguir color/talle
      name: `${detalleProducto.producto.nombre} - ${selectedColor} - ${selectedTalle}`,
      price: getPrecioFinal(),
      image: detalleProducto.imagenes[0]?.url || "/api/placeholder/300/300"
    };

    // Agregar la cantidad seleccionada
    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct);
    }

    alert(`${quantity} producto(s) agregado(s) al carrito`);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (error || !detalleProducto) {
    return (
      <div className={styles.error}>
        <h2>Error</h2>
        <p>{error || 'Producto no encontrado'}</p>
        <button onClick={() => navigate('/')} className={styles.backButton}>
          Volver al inicio
        </button>
      </div>
    );
  }

  const precioFinal = getPrecioFinal();
  const descuentoActivo = isDescuentoActivo(detalleProducto.descuento);
  const stockDisponible = getStockDisponible();
  const coloresDisponibles = getColoresDisponibles();
  const tallesDisponibles = getTallesDisponibles();

  return (
    <>
    <Navbar />
    <div className={styles.productDetailPage}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <button onClick={() => navigate('/')} className={styles.breadcrumbLink}>
            Inicio
          </button>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>
            {detalleProducto.producto.nombre}
          </span>
        </nav>

        <div className={styles.productContent}>
          {/* Galería de imágenes */}
          <div className={styles.imageGallery}>
            <div className={styles.mainImage}>
              <img
                src={detalleProducto.imagenes[selectedImageIndex]?.url || "/api/placeholder/500/500"}
                alt={detalleProducto.imagenes[selectedImageIndex]?.alt || detalleProducto.producto.nombre}
                className={styles.productImage}
                onError={(e) => {
                  e.currentTarget.src = "/api/placeholder/500/500";
                }}
              />
              {descuentoActivo && detalleProducto.descuento && (
                <div className={styles.discountBadge}>
                  {detalleProducto.descuento.porcentaje}% OFF
                </div>
              )}
            </div>
            
            {detalleProducto.imagenes.length > 1 && (
              <div className={styles.thumbnails}>
                {detalleProducto.imagenes.map((imagen, index) => (
                  <button
                    key={imagen.id}
                    className={`${styles.thumbnail} ${index === selectedImageIndex ? styles.active : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={imagen.url}
                      alt={imagen.alt}
                      onError={(e) => {
                        e.currentTarget.src = "/api/placeholder/100/100";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className={styles.productInfo}>
            <h1 className={styles.productTitle}>{detalleProducto.producto.nombre}</h1>
            
            <div className={styles.productMeta}>
              <span className={styles.productType}>{detalleProducto.producto.tipoProducto}</span>
              <span className={styles.productGender}>{detalleProducto.producto.sexo}</span>
            </div>

            {/* Categorías */}
            <div className={styles.categories}>
              {detalleProducto.producto.categorias.map(categoria => (
                <span key={categoria.id} className={styles.categoryTag}>
                  {categoria.nombre}
                </span>
              ))}
            </div>

            {/* Precio */}
            <div className={styles.priceSection}>
              {descuentoActivo ? (
                <div className={styles.priceWithDiscount}>
                  <span className={styles.originalPrice}>
                    ${detalleProducto.producto.precio_venta.toLocaleString()}
                  </span>
                  <span className={styles.finalPrice}>
                    ${precioFinal.toLocaleString()}
                  </span>
                  <span className={styles.savings}>
                    Ahorras ${(detalleProducto.producto.precio_venta - precioFinal).toLocaleString()}
                  </span>
                </div>
              ) : (
                <span className={styles.finalPrice}>
                  ${precioFinal.toLocaleString()}
                </span>
              )}
            </div>

            {/* Selector de color */}
            <div className={styles.optionSection}>
              <h3>Color:</h3>
              <div className={styles.colorOptions}>
                {coloresDisponibles.map(color => (
                  <button
                    key={color}
                    className={`${styles.colorOption} ${selectedColor === color ? styles.selected : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de talle */}
            <div className={styles.optionSection}>
              <h3>Talle:</h3>
              <div className={styles.sizeOptions}>
                {tallesDisponibles.map(talle => (
                  <button
                    key={talle}
                    className={`${styles.sizeOption} ${selectedTalle === talle ? styles.selected : ''}`}
                    onClick={() => setSelectedTalle(talle)}
                  >
                    {talle}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock disponible */}
            <div className={styles.stockInfo}>
              <span className={`${styles.stockStatus} ${stockDisponible > 0 ? styles.inStock : styles.outOfStock}`}>
                {stockDisponible > 0 
                  ? `${stockDisponible} unidades disponibles`
                  : 'Sin stock'
                }
              </span>
            </div>

            {/* Selector de cantidad */}
            {stockDisponible > 0 && (
              <div className={styles.quantitySection}>
                <label htmlFor="quantity">Cantidad:</label>
                <div className={styles.quantityControls}>
                  <button
                    className={styles.quantityButton}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={stockDisponible}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(stockDisponible, parseInt(e.target.value) || 1)))}
                    className={styles.quantityInput}
                  />
                  <button
                    className={styles.quantityButton}
                    onClick={() => setQuantity(Math.min(stockDisponible, quantity + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Precio total */}
            {quantity > 1 && (
              <div className={styles.totalPrice}>
                <strong>Total: ${(precioFinal * quantity).toLocaleString()}</strong>
              </div>
            )}

            {/* Botón agregar al carrito */}
            <button
              className={styles.addToCartButton}
              onClick={handleAddToCart}
              disabled={stockDisponible === 0 || !selectedTalle}
            >
              {stockDisponible === 0 
                ? 'Sin stock' 
                : !selectedTalle 
                  ? 'Selecciona un talle'
                  : 'Agregar al carrito'
              }
            </button>

            {/* Información adicional del descuento */}
            {descuentoActivo && detalleProducto.descuento && (
              <div className={styles.discountInfo}>
                <h4>🎉 {detalleProducto.descuento.nombre}</h4>
                <p>Válido hasta: {new Date(detalleProducto.descuento.fechaFin).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default ProductDetailPage;
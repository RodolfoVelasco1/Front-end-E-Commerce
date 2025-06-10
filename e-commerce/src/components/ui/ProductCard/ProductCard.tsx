import React from 'react';
import styles from './ProductCard.module.css';
import useStore from '../../../store/store';


// Interfaces para los tipos de datos
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

interface DetalleProducto {
  id: number;
  color: string;
  activo: boolean;
  producto: Producto;
  descuento: Descuento | null;
  imagenes: Imagen[];
}

interface ProductCardProps {
  detalleProducto: DetalleProducto;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ detalleProducto, onAddToCart }) => {
  const { producto, color, descuento, imagenes } = detalleProducto;
  const imagen = imagenes && imagenes.length > 0 ? imagenes[0] : null;
  
  // Obtenemos addToCart del store
  const { addToCart } = useStore();
  
  // Calcular precio con descuento si existe
  const precioFinal = descuento 
    ? producto.precio_venta * (1 - descuento.porcentaje / 100) 
    : producto.precio_venta;
  
  // Verificar si el descuento está activo (fecha actual entre fechaInicio y fechaFin)
  const isDescuentoActivo = () => {
    if (!descuento) return false;
    
    const now = new Date();
    const fechaInicio = new Date(descuento.fechaInicio);
    const fechaFin = new Date(descuento.fechaFin);
    
    return now >= fechaInicio && now <= fechaFin;
  };
  
  const descuentoActivo = isDescuentoActivo();

  // Función para manejar click en agregar al carrito
  const handleAddToCart = () => {
    // Crear el producto en el formato que espera el store
    const cartProduct = {
      id: producto.id,
      name: producto.nombre,
      price: precioFinal,
      image: imagen ? imagen.url : "/api/placeholder/300/300"
    };
    
    // Agregar al carrito
    addToCart(cartProduct);
    
    // Llamar callback si existe
    if (onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        {imagen ? (
          <img 
            src={imagen.url} 
            alt={imagen.alt} 
            className={styles.productImage}
            // Usar imagen de placeholder en caso de que la URL no funcione
            onError={(e) => {
              e.currentTarget.src = "/api/placeholder/300/300";
            }}
          />
        ) : (
          <img src="/api/placeholder/300/300" alt="Imagen no disponible" className={styles.productImage} />
        )}
        
        {descuentoActivo && descuento && (
          <div className={styles.discountBadge}>
            {descuento.porcentaje}% OFF
          </div>
        )}
      </div>
      
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{producto.nombre}</h3>
        <div className={styles.productDetails}>
          <span className={styles.productColor}>Color: {color}</span>
          <span className={styles.productType}>{producto.tipoProducto}</span>
          <span className={styles.productGender}>{producto.sexo}</span>
        </div>
        
        <div className={styles.categories}>
          {producto.categorias.map(categoria => (
            <span key={categoria.id} className={styles.categoryTag}>
              {categoria.nombre}
            </span>
          ))}
        </div>
        
        <div className={styles.priceContainer}>
          {descuentoActivo ? (
            <>
              <span className={styles.originalPrice}>${producto.precio_venta.toLocaleString()}</span>
              <span className={styles.finalPrice}>${precioFinal.toLocaleString()}</span>
            </>
          ) : (
            <span className={styles.finalPrice}>${producto.precio_venta.toLocaleString()}</span>
          )}
        </div>
        
        <button className={styles.addToCartButton} onClick={handleAddToCart}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
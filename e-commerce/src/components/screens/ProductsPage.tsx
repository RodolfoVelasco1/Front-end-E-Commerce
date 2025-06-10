// ProductsPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './ProductsPage.module.css';
import Navbar from '../ui/Navbar/Navbar';
import Footer from '../ui/Footer/Footer';
import { useNavigate } from 'react-router-dom';

// Tipos basados en tu db.json
interface Categoria {
  id: number;
  nombre: string;
}

interface Talle {
  id: number;
  name: string;
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

interface Stock {
  id: number;
  stock: number;
  talle: Talle;
}

interface Producto {
  id: number;
  nombre: string;
  sexo: string;
  precio_compra: number;
  precio_venta: number;
  tipoProducto: string;
  categorias: Categoria[];
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

const ProductsPage: React.FC = () => {
  const location = useLocation();

  const navigate = useNavigate();
  
  // Estados para los datos
  const [detallesProductos, setDetallesProductos] = useState<DetalleProducto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [talles, setTalles] = useState<Talle[]>([]);
  const [coloresDisponibles, setColoresDisponibles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    sexo: '',
    tipoProducto: '',
    categoria: '',
    talle: '',
    color: '',
    ofertas: false // Nuevo filtro para ofertas
  });
  
  // Estado para ordenamiento de precios
  const [ordenPrecio, setOrdenPrecio] = useState(''); // '', 'asc', 'desc'
  
  const [productosFiltrados, setProductosFiltrados] = useState<DetalleProducto[]>([]);

  // Función para obtener el filtro inicial basado en la ruta
  const getInitialFilter = () => {
    const path = location.pathname;
    switch (path) {
      case '/calzado':
        return { tipoProducto: 'CALZADO' };
      case '/indumentaria':
        return { tipoProducto: 'INDUMENTARIA' };
      case '/hombre':
        return { sexo: 'MASCULINO' };
      case '/mujer':
        return { sexo: 'FEMENINO' };
      case '/unisex':
        return { sexo: 'UNISEX' };
      case '/ofertas':
        return { ofertas: true };
      default:
        return {};
    }
  };

  // Cargar datos del db.json
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/detallesProductos?_expand=producto');
        const detalles = await response.json();
        
        // Cargar categorías
        const categoriasResponse = await fetch('http://localhost:3001/categorias');
        const categoriasData = await categoriasResponse.json();
        
        // Cargar talles
        const tallesResponse = await fetch('http://localhost:3001/talles');
        const tallesData = await tallesResponse.json();
        
        // Extraer colores únicos de los productos
        const coloresUnicos = [...new Set(detalles.map((detalle: DetalleProducto) => detalle.color as string))].sort() as string[];
        
        setDetallesProductos(detalles);
        setCategorias(categoriasData);
        setTalles(tallesData);
        setColoresDisponibles(coloresUnicos);
        setProductosFiltrados(detalles);
        
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  // Aplicar filtro inicial basado en la ruta
  useEffect(() => {
    const initialFilter = getInitialFilter();
    if (Object.keys(initialFilter).length > 0) {
      setFiltros(prev => ({
        ...prev,
        ...initialFilter
      }));
    }
  }, [location.pathname]);

  // Aplicar filtros
  useEffect(() => {
    let resultado = [...detallesProductos];

    // Filtro especial para ofertas
    if (filtros.ofertas) {
      resultado = resultado.filter(detalle => 
        detalle.descuento && tieneDescuentoActivo(detalle.descuento)
      );
    }

    // Filtrar por sexo
    if (filtros.sexo) {
      resultado = resultado.filter(detalle => detalle.producto.sexo === filtros.sexo);
    }

    // Filtrar por tipo de producto
    if (filtros.tipoProducto) {
      resultado = resultado.filter(detalle => detalle.producto.tipoProducto === filtros.tipoProducto);
    }

    // Filtrar por categoría
    if (filtros.categoria) {
      resultado = resultado.filter(detalle => 
        detalle.producto.categorias.some(cat => cat.nombre === filtros.categoria)
      );
    }

    // Filtrar por talle
    if (filtros.talle) {
      resultado = resultado.filter(detalle => 
        detalle.stocks.some(stock => stock.talle.name === filtros.talle)
      );
    }

    // Filtrar por color
    if (filtros.color) {
      resultado = resultado.filter(detalle => detalle.color === filtros.color);
    }

    // Ordenar por precio
    if (ordenPrecio === 'asc') {
      resultado.sort((a, b) => calcularPrecioFinal(a) - calcularPrecioFinal(b));
    } else if (ordenPrecio === 'desc') {
      resultado.sort((a, b) => calcularPrecioFinal(b) - calcularPrecioFinal(a));
    }

    setProductosFiltrados(resultado);
  }, [filtros, detallesProductos, location.pathname, ordenPrecio]);

  // Cambiar filtros
  const cambiarFiltro = (nombre: string, valor: string | boolean) => {
    setFiltros(prev => ({
      ...prev,
      [nombre]: valor
    }));
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      sexo: '',
      tipoProducto: '',
      categoria: '',
      talle: '',
      color: '',
      ofertas: false
    });
    setOrdenPrecio('');
  };

  // Verificar si hay descuento activo
  const tieneDescuentoActivo = (descuento: Descuento | null): boolean => {
    if (!descuento) return false;
    
    const ahora = new Date();
    const inicio = new Date(descuento.fechaInicio);
    const fin = new Date(descuento.fechaFin);
    
    return ahora >= inicio && ahora <= fin;
  };

  // Calcular precio final
  const calcularPrecioFinal = (detalle: DetalleProducto): number => {
    if (detalle.descuento && tieneDescuentoActivo(detalle.descuento)) {
      return detalle.producto.precio_venta * (1 - detalle.descuento.porcentaje / 100);
    }
    return detalle.producto.precio_venta;
  };

  // Obtener el título según la ruta
  const getTitulo = () => {
    const path = location.pathname;
    switch (path) {
      case '/calzado':
        return 'Calzado';
      case '/indumentaria':
        return 'Indumentaria';
      case '/hombre':
        return 'Productos para Hombre';
      case '/mujer':
        return 'Productos para Mujer';
      case '/nino':
        return 'Productos Unisex';
      case '/ofertas':
        return 'Ofertas';
      default:
        return 'Productos';
    }
  };

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <>
    <Navbar />
    <div className={styles.productosContainer}>
      
      {/* Sidebar de filtros */}
      <div className={styles.filtrosSidebar}>
        <div className={styles.filtrosHeader}>
          <h3>Filtros</h3>
          <button onClick={limpiarFiltros} className={styles.limpiarBtn}>
            Limpiar todo
          </button>
        </div>

        {/* Filtro por ofertas */}
        <div className={styles.filtroGrupo}>
          <label>
            <input 
              type="checkbox" 
              checked={filtros.ofertas}
              onChange={(e) => cambiarFiltro('ofertas', e.target.checked)}
            />
            Solo ofertas
          </label>
        </div>

        {/* Filtro por sexo */}
        <div className={styles.filtroGrup}>
          <label>Sexo:</label>
          <select 
            value={filtros.sexo} 
            onChange={(e) => cambiarFiltro('sexo', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
            <option value="UNISEX">Unisex</option>
          </select>
        </div>

        {/* Filtro por tipo de producto */}
        <div className={styles.filtroGrupo}>
          <label>Tipo:</label>
          <select 
            value={filtros.tipoProducto} 
            onChange={(e) => cambiarFiltro('tipoProducto', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="INDUMENTARIA">Indumentaria</option>
            <option value="CALZADO">Calzado</option>
          </select>
        </div>

        {/* Filtro por categoría */}
        <div className={styles.filtroGrupo}>
          <label>Categoría:</label>
          <select 
            value={filtros.categoria} 
            onChange={(e) => cambiarFiltro('categoria', e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        {/* Filtro por talle */}
        <div className={styles.filtroGrupo}>
          <label>Talle:</label>
          <select 
            value={filtros.talle} 
            onChange={(e) => cambiarFiltro('talle', e.target.value)}
          >
            <option value="">Todos</option>
            {talles.map(talle => (
              <option key={talle.id} value={talle.name}>{talle.name}</option>
            ))}
          </select>
        </div>

        {/* Filtro por color */}
        <div className={styles.filtroGrupo}>
          <label>Color:</label>
          <select 
            value={filtros.color}
            onChange={(e) => cambiarFiltro('color', e.target.value)}
          >
            <option value="">Todos los colores</option>
            {coloresDisponibles.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>

        {/* Ordenamiento por precio */}
        <div className={styles.filtroGrupo}>
          <label>Ordenar por precio:</label>
          <select 
            value={ordenPrecio}
            onChange={(e) => setOrdenPrecio(e.target.value)}
          >
            <option value="">Sin ordenar</option>
            <option value="asc">Precio: Menor a Mayor</option>
            <option value="desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {/* Lista de productos */}
      <div className={styles.productosMain}>
        <div className={styles.productosHeader}>
          <h2>{getTitulo()} ({productosFiltrados.length})</h2>
        </div>

        <div className={styles.productosGrid}>
          {productosFiltrados.map(detalle => {
            const precioFinal = calcularPrecioFinal(detalle);
            const tieneDescuento = detalle.descuento && tieneDescuentoActivo(detalle.descuento);
            const stockTotal = detalle.stocks.reduce((total, stock) => total + stock.stock, 0);
            
            return (
              <div 
                key={detalle.id} 
                className={styles.productoCard}
                onClick={() => navigate(`/producto/${detalle.producto.id}`)}
                style={{ cursor: 'pointer' }}
              >
                {/* Imagen del producto */}
                <div className={styles.productoImagen}>
                  {detalle.imagenes && detalle.imagenes[0] ? (
                    <img 
                      src={detalle.imagenes[0].url} 
                      alt={detalle.imagenes[0].alt}
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/300/300';
                      }}
                    />
                  ) : (
                    <img src="/api/placeholder/300/300" alt="Sin imagen" />
                  )}
                  
                  {tieneDescuento && (
                    <div className={styles.descuentoBadge}>
                      -{detalle.descuento!.porcentaje}%
                    </div>
                  )}
                </div>

                {/* Información del producto */}
                <div className={styles.productoInfo}>
                  <h3>{detalle.producto.nombre}</h3>
                  <p className={styles.productoColor}>Color: {detalle.color}</p>
                  <p className={styles.productoTipo}>{detalle.producto.tipoProducto} - {detalle.producto.sexo}</p>
                  
                  <div className={styles.productoCategorias}>
                    {detalle.producto.categorias.map(cat => (
                      <span key={cat.id} className={styles.categoriaTag}>{cat.nombre}</span>
                    ))}
                  </div>

                  <div className={styles.productoTalles}>
                    <strong>Talles disponibles:</strong>
                    {detalle.stocks.map(stock => (
                      <span key={stock.id} className={styles.talleInfo}>
                        {stock.talle.name} ({stock.stock})
                      </span>
                    ))}
                  </div>

                  <div className={styles.productoPrecio}>
                    {tieneDescuento ? (
                      <>
                        <span className={styles.precioOriginal}>${detalle.producto.precio_venta}</span>
                        <span className={styles.precioFinal}>${precioFinal}</span>
                      </>
                    ) : (
                      <span className={styles.precioFinal}>${detalle.producto.precio_venta}</span>
                    )}
                  </div>

                  <div className={styles.productoStock}>
                    Stock total: {stockTotal} unidades
                  </div>

                  <button className={styles.agregarCarritoBtn}>
                    Agregar al carrito
                  </button>
                </div>
              </div>

            );
          })}
          
        </div>

        {productosFiltrados.length === 0 && (
          <div className={styles.sinProductos}>
            No se encontraron productos con los filtros seleccionados.
          </div>
        )}
        
      </div>
      
    </div>
    <Footer />
    </>
  );
};

export default ProductsPage;
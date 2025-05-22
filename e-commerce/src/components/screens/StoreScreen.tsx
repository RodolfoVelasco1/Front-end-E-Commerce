import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './StoreScreen.module.css';
import Filtro from '../ui/Filters/Filtro';
import { IDetalleProducto } from '../../types/IDetalleProducto';
import { ISexo } from '../../types/iSexo';
import { ITipoProducto } from '../../types/ITipoProducto';
import { useProductStore } from '../../store/productStore';
import ListProducts from '../ui/ListProductsStore/ListProductsStore';
import FilterTags from '../ui/Filters/FilterTags';

const StoreScreen: React.FC = () => {
  const { categoria } = useParams<{ categoria?: string }>();
  const { productos, fetchProductos, isLoading } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState<IDetalleProducto[]>([]);
  
  // Estado para los filtros
  const [filters, setFilters] = useState({
    sexo: categoria === 'hombre' 
          ? ISexo.MASCULINO 
          : categoria === 'mujer' 
          ? ISexo.FEMENINO 
          : categoria === 'unisex' 
          ? ISexo.UNISEX 
          : '',
    talle: '',
    precio: '',
    ofertas: false,
    tipoProducto: categoria === 'indumentaria' 
                 ? ITipoProducto.ROPA 
                 : categoria === 'calzado' 
                 ? ITipoProducto.CALZADO 
                 : categoria === 'accesorios' 
                 ? ITipoProducto.ACCESORIO 
                 : ''
  });

  // Cargar productos al inicio
  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Actualizar filtros cuando cambia la categoría en la URL
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      sexo: categoria === 'hombre' 
            ? ISexo.MASCULINO 
            : categoria === 'mujer' 
            ? ISexo.FEMENINO 
            : categoria === 'unisex' 
            ? ISexo.UNISEX 
            : prev.sexo,
      tipoProducto: categoria === 'indumentaria' 
                   ? ITipoProducto.ROPA 
                   : categoria === 'calzado' 
                   ? ITipoProducto.CALZADO 
                   : categoria === 'accesorios' 
                   ? ITipoProducto.ACCESORIO 
                   : prev.tipoProducto
    }));
  }, [categoria]);

  // Aplicar filtros a los productos
  useEffect(() => {
    let filtered = [...productos];
    
    // Filtrar por sexo
    if (filters.sexo) {
      filtered = filtered.filter(item => item.producto.sexo === filters.sexo);
    }
    
    // Filtrar por tipo de producto
    if (filters.tipoProducto) {
      filtered = filtered.filter(item => item.producto.tipoProducto === filters.tipoProducto);
    }
    
    // Filtrar por talle
    if (filters.talle) {
      filtered = filtered.filter(item => 
        item.stocks.some(stock => stock.talle.name === filters.talle)
      );
    }
    
    // Filtrar por ofertas
    if (filters.ofertas) {
      filtered = filtered.filter(item => item.descuento !== null);
    }
    
    // Ordenar por precio
    if (filters.precio === 'asc') {
      filtered.sort((a, b) => a.producto.precio_venta - b.producto.precio_venta);
    } else if (filters.precio === 'desc') {
      filtered.sort((a, b) => b.producto.precio_venta - a.producto.precio_venta);
    }
    
    setFilteredProducts(filtered);
  }, [productos, filters]);

  // Manejar cambios en los filtros
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  // Limpiar todos los filtros
  const handleClearFilters = () => {
    setFilters({
      sexo: '',
      talle: '',
      precio: '',
      ofertas: false,
      tipoProducto: ''
    });
  };

  // Remover un filtro específico
  const handleRemoveFilter = (filterKey: string) => {
    if (filterKey === 'all') {
      handleClearFilters();
      return;
    }
    
    setFilters(prev => ({
      ...prev,
      [filterKey]: filterKey === 'ofertas' ? false : ''
    }));
  };

  return (
    <div className={styles.storeContainer}>
      <div className={styles.filterSidebar}>
        <Filtro 
          filters={filters} 
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>
      <div className={styles.productsArea}>
        <h1 className={styles.storeTitle}>
          {categoria 
            ? categoria.charAt(0).toUpperCase() + categoria.slice(1) 
            : 'Todos los productos'}
        </h1>
        
        {isLoading ? (
          <div className={styles.loading}>Cargando productos...</div>
        ) : (
          <>
            <FilterTags 
              filters={filters} 
              productsCount={filteredProducts.length} 
              onRemoveFilter={handleRemoveFilter} 
            />
            <ListProducts products={filteredProducts} />
          </>
        )}
      </div>
    </div>
  );
};

export default StoreScreen;
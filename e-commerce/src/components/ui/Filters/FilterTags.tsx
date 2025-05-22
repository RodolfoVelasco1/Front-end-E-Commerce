import React from 'react';
import styles from './FilterTags.module.css';
import { ISexo } from '../../../types/iSexo';
import { ITipoProducto } from '../../../types/ITipoProducto';

interface FilterTagsProps {
  filters: {
    sexo: string;
    talle: string;
    precio: string; 
    ofertas: boolean;
    tipoProducto: string;
  };
  productsCount: number;
  onRemoveFilter: (filterKey: string) => void;
}

const FilterTags: React.FC<FilterTagsProps> = ({ filters, productsCount, onRemoveFilter }) => {
  // Verificar si hay filtros activos
  const hasActiveFilters = 
    !!filters.sexo || 
    !!filters.talle || 
    !!filters.precio || 
    filters.ofertas || 
    !!filters.tipoProducto;
  
  if (!hasActiveFilters) {
    return (
      <div className={styles.resultCount}>
        Mostrando {productsCount} producto{productsCount !== 1 ? 's' : ''}
      </div>
    );
  }

  // Traducir los valores de filtro a texto legible
  const getSexoLabel = (sexo: string) => {
    switch (sexo) {
      case ISexo.MASCULINO: return 'Hombre';
      case ISexo.FEMENINO: return 'Mujer';
      case ISexo.UNISEX: return 'Unisex';
      default: return '';
    }
  };

  const getTipoProductoLabel = (tipo: string) => {
    switch (tipo) {
      case ITipoProducto.ROPA: return 'Indumentaria';
      case ITipoProducto.CALZADO: return 'Calzado';
      case ITipoProducto.ACCESORIO: return 'Accesorios';
      default: return '';
    }
  };

  const getPrecioLabel = (precio: string) => {
    switch (precio) {
      case 'asc': return 'Precio: menor a mayor';
      case 'desc': return 'Precio: mayor a menor';
      default: return '';
    }
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.resultCount}>
        {productsCount} producto{productsCount !== 1 ? 's' : ''} encontrado{productsCount !== 1 ? 's' : ''}
      </div>
      
      <div className={styles.activeTags}>
        {filters.sexo && (
          <div className={styles.filterTag}>
            {getSexoLabel(filters.sexo)}
            <button 
              className={styles.removeButton} 
              onClick={() => onRemoveFilter('sexo')}
              aria-label={`Quitar filtro ${getSexoLabel(filters.sexo)}`}
            >
              ×
            </button>
          </div>
        )}
        
        {filters.tipoProducto && (
          <div className={styles.filterTag}>
            {getTipoProductoLabel(filters.tipoProducto)}
            <button 
              className={styles.removeButton} 
              onClick={() => onRemoveFilter('tipoProducto')}
              aria-label={`Quitar filtro ${getTipoProductoLabel(filters.tipoProducto)}`}
            >
              ×
            </button>
          </div>
        )}
        
        {filters.talle && (
          <div className={styles.filterTag}>
            Talle: {filters.talle}
            <button 
              className={styles.removeButton} 
              onClick={() => onRemoveFilter('talle')}
              aria-label={`Quitar filtro talle ${filters.talle}`}
            >
              ×
            </button>
          </div>
        )}
        
        {filters.precio && (
          <div className={styles.filterTag}>
            {getPrecioLabel(filters.precio)}
            <button 
              className={styles.removeButton} 
              onClick={() => onRemoveFilter('precio')}
              aria-label={`Quitar ordenamiento por precio`}
            >
              ×
            </button>
          </div>
        )}
        
        {filters.ofertas && (
          <div className={styles.filterTag}>
            Sólo ofertas
            <button 
              className={styles.removeButton} 
              onClick={() => onRemoveFilter('ofertas')}
              aria-label="Quitar filtro de ofertas"
            >
              ×
            </button>
          </div>
        )}
        
        <button 
          className={styles.clearAllButton} 
          onClick={() => onRemoveFilter('all')}
          aria-label="Limpiar todos los filtros"
        >
          Limpiar todo
        </button>
      </div>
    </div>
  );
};

export default FilterTags;
import React from 'react';
import styles from './Filtro.module.css';
import { useTalles } from '../../../hooks/useTalles';
import { ISexo } from '../../../types/iSexo';
import { ITipoProducto } from '../../../types/ITipoProducto';


interface FiltroProps {
  filters: {
    sexo: string;
    talle: string;
    precio: string;
    ofertas: boolean;
    tipoProducto: string;
  };
  onFilterChange: (filters: FiltroProps['filters']) => void;
  onClearFilters: () => void;
}

const Filtro: React.FC<FiltroProps> = ({ filters, onFilterChange, onClearFilters }) => {
  const { talles, isLoading: tallesLoading } = useTalles();

  const handleSexoChange = (sexo: string) => {
    onFilterChange({ ...filters, sexo });
  };

  const handleTalleChange = (talle: string) => {
    onFilterChange({ ...filters, talle });
  };

  const handlePrecioChange = (precio: string) => {
    onFilterChange({ ...filters, precio });
  };

  const handleOfertasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, ofertas: e.target.checked });
  };

  const handleTipoProductoChange = (tipoProducto: string) => {
    onFilterChange({ ...filters, tipoProducto });
  };

  return (
    <div className={styles.filtroContainer}>
      <div className={styles.filtroHeader}>
        <h2 className={styles.filtroTitle}>Filtros</h2>
        <button onClick={onClearFilters} className={styles.clearButton}>
          Limpiar todo
        </button>
      </div>

      {/* Filtro por Sexo */}
      <div className={styles.filtroSection}>
        <h3 className={styles.filtroSectionTitle}>Sexo</h3>
        <div className={styles.filterOptions}>
          <button
            className={`${styles.filterButton} ${filters.sexo === ISexo.MASCULINO ? styles.active : ''}`}
            onClick={() => handleSexoChange(filters.sexo === ISexo.MASCULINO ? '' : ISexo.MASCULINO)}
          >
            Hombre
          </button>
          <button
            className={`${styles.filterButton} ${filters.sexo === ISexo.FEMENINO ? styles.active : ''}`}
            onClick={() => handleSexoChange(filters.sexo === ISexo.FEMENINO ? '' : ISexo.FEMENINO)}
          >
            Mujer
          </button>
          <button
            className={`${styles.filterButton} ${filters.sexo === ISexo.UNISEX ? styles.active : ''}`}
            onClick={() => handleSexoChange(filters.sexo === ISexo.UNISEX ? '' : ISexo.UNISEX)}
          >
            Unisex
          </button>
        </div>
      </div>

      {/* Filtro por Tipo de Producto */}
      <div className={styles.filtroSection}>
        <h3 className={styles.filtroSectionTitle}>Tipo de Producto</h3>
        <div className={styles.filterOptions}>
          <button
            className={`${styles.filterButton} ${filters.tipoProducto === ITipoProducto.ROPA ? styles.active : ''}`}
            onClick={() => handleTipoProductoChange(filters.tipoProducto === ITipoProducto.ROPA ? '' : ITipoProducto.ROPA)}
          >
            Indumentaria
          </button>
          <button
            className={`${styles.filterButton} ${filters.tipoProducto === ITipoProducto.CALZADO ? styles.active : ''}`}
            onClick={() => handleTipoProductoChange(filters.tipoProducto === ITipoProducto.CALZADO ? '' : ITipoProducto.CALZADO)}
          >
            Calzado
          </button>
          <button
            className={`${styles.filterButton} ${filters.tipoProducto === ITipoProducto.ACCESORIO ? styles.active : ''}`}
            onClick={() => handleTipoProductoChange(filters.tipoProducto === ITipoProducto.ACCESORIO ? '' : ITipoProducto.ACCESORIO)}
          >
            Accesorios
          </button>
        </div>
      </div>

      {/* Filtro por Talle */}
      <div className={styles.filtroSection}>
        <h3 className={styles.filtroSectionTitle}>Talle</h3>
        {tallesLoading ? (
          <div className={styles.loadingTalles}>Cargando...</div>
        ) : (
          <div className={styles.tallesGrid}>
            {talles.map((talle) => (
              <button
                key={talle.id}
                className={`${styles.talleButton} ${filters.talle === talle.name ? styles.active : ''}`}
                onClick={() => handleTalleChange(filters.talle === talle.name ? '' : talle.name)}
              >
                {talle.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filtro por Precio */}
      <div className={styles.filtroSection}>
        <h3 className={styles.filtroSectionTitle}>Precio</h3>
        <div className={styles.precioOptions}>
          <button
            className={`${styles.filterButton} ${filters.precio === 'asc' ? styles.active : ''}`}
            onClick={() => handlePrecioChange(filters.precio === 'asc' ? '' : 'asc')}
          >
            Menor a mayor
          </button>
          <button
            className={`${styles.filterButton} ${filters.precio === 'desc' ? styles.active : ''}`}
            onClick={() => handlePrecioChange(filters.precio === 'desc' ? '' : 'desc')}
          >
            Mayor a menor
          </button>
        </div>
      </div>

      {/* Filtro por Ofertas */}
      <div className={styles.filtroSection}>
        <h3 className={styles.filtroSectionTitle}>Ofertas</h3>
        <div className={styles.ofertasCheck}>
          <input
            type="checkbox"
            id="ofertas"
            checked={filters.ofertas}
            onChange={handleOfertasChange}
            className={styles.checkbox}
          />
          <label htmlFor="ofertas" className={styles.checkboxLabel}>
            Mostrar solo ofertas
          </label>
        </div>
      </div>
    </div>
  );
};

export default Filtro;
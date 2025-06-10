import React from 'react';
import styles from './Filtro.module.css';

export interface FilterState {
  colores: string[];
  talles: string[];
  sexos: ('MASCULINO' | 'FEMENINO' | 'UNISEX')[];
  categorias: string[];
  soloPromociones: boolean;
  ordenamiento: 'mayor_precio' | 'menor_precio' | 'ninguno';
}

interface FiltroProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableColors: string[];
  availableSizes: string[];
  availableCategories: string[];
}

const Filtro: React.FC<FiltroProps> = ({
  filters,
  onFiltersChange,
  availableColors,
  availableSizes,
  availableCategories
}) => {
  
  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked
      ? [...filters.colores, color]
      : filters.colores.filter(c => c !== color);
    
    onFiltersChange({
      ...filters,
      colores: newColors
    });
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked
      ? [...filters.talles, size]
      : filters.talles.filter(s => s !== size);
    
    onFiltersChange({
      ...filters,
      talles: newSizes
    });
  };

  const handleGenderChange = (gender: 'MASCULINO' | 'FEMENINO' | 'UNISEX', checked: boolean) => {
    const newGenders = checked
      ? [...filters.sexos, gender]
      : filters.sexos.filter(g => g !== gender);
    
    onFiltersChange({
      ...filters,
      sexos: newGenders
    });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categorias, category]
      : filters.categorias.filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      categorias: newCategories
    });
  };

  const handlePromotionChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      soloPromociones: checked
    });
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      ordenamiento: value as 'mayor_precio' | 'menor_precio' | 'ninguno'
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      colores: [],
      talles: [],
      sexos: [],
      categorias: [],
      soloPromociones: false,
      ordenamiento: 'ninguno'
    });
  };

  return (
    <div className={styles.filtroContainer}>
      <div className={styles.filtroHeader}>
        <h3>Filtros</h3>
        <button 
          className={styles.clearButton}
          onClick={clearAllFilters}
        >
          Limpiar filtros
        </button>
      </div>

      {/* Filtro de Color */}
      <div className={styles.filtroSection}>
        <h4>Color</h4>
        <div className={styles.checkboxGroup}>
          {availableColors.map(color => (
            <label key={color} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={filters.colores.includes(color)}
                onChange={(e) => handleColorChange(color, e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>{color}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filtro de Talle */}
      <div className={styles.filtroSection}>
        <h4>Talle</h4>
        <div className={styles.checkboxGroup}>
          {availableSizes.map(size => (
            <label key={size} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={filters.talles.includes(size)}
                onChange={(e) => handleSizeChange(size, e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filtro de Sexo */}
      <div className={styles.filtroSection}>
        <h4>Sexo</h4>
        <div className={styles.checkboxGroup}>
          {(['MASCULINO', 'FEMENINO', 'UNISEX'] as const).map(gender => (
            <label key={gender} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={filters.sexos.includes(gender)}
                onChange={(e) => handleGenderChange(gender, e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                {gender === 'MASCULINO' ? 'Masculino' : 
                 gender === 'FEMENINO' ? 'Femenino' : 'Unisex'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Filtro de Categoría */}
      <div className={styles.filtroSection}>
        <h4>Categoría</h4>
        <div className={styles.checkboxGroup}>
          {availableCategories.map(category => (
            <label key={category} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={filters.categorias.includes(category)}
                onChange={(e) => handleCategoryChange(category, e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filtro de Promociones */}
      <div className={styles.filtroSection}>
        <h4>Promociones</h4>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.soloPromociones}
              onChange={(e) => handlePromotionChange(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>Solo productos en promoción</span>
          </label>
        </div>
      </div>

      {/* Ordenamiento */}
      <div className={styles.filtroSection}>
        <h4>Ordenar por</h4>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="ordenamiento"
              value="ninguno"
              checked={filters.ordenamiento === 'ninguno'}
              onChange={(e) => handleSortChange(e.target.value)}
              className={styles.radio}
            />
            <span className={styles.radioText}>Sin ordenar</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="ordenamiento"
              value="menor_precio"
              checked={filters.ordenamiento === 'menor_precio'}
              onChange={(e) => handleSortChange(e.target.value)}
              className={styles.radio}
            />
            <span className={styles.radioText}>Precio: Menor a Mayor</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="ordenamiento"
              value="mayor_precio"
              checked={filters.ordenamiento === 'mayor_precio'}
              onChange={(e) => handleSortChange(e.target.value)}
              className={styles.radio}
            />
            <span className={styles.radioText}>Precio: Mayor a Menor</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Filtro;
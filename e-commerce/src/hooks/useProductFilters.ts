import { useState, useMemo } from 'react';
import { FilterState } from '../components/ui/Filters/Filtro';

// Interfaces necesarias (basadas en los archivos existentes)
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
  tipoProducto: 'ROPA' | 'CALZADO' | 'ACCESORIO';
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

export const useProductFilters = (detallesProductos: DetalleProducto[]) => {
  // Estado inicial de filtros
  const [filters, setFilters] = useState<FilterState>({
    colores: [],
    talles: [],
    sexos: [],
    categorias: [],
    soloPromociones: false,
    ordenamiento: 'ninguno'
  });

  // Función para verificar si un descuento está activo
  const isDescuentoActivo = (descuento: Descuento | null): boolean => {
    if (!descuento) return false;
    
    const now = new Date();
    const fechaInicio = new Date(descuento.fechaInicio);
    const fechaFin = new Date(descuento.fechaFin);
    
    return now >= fechaInicio && now <= fechaFin;
  };

  // Obtener valores únicos para los filtros
  const availableFilters = useMemo(() => {
    const colores = [...new Set(detallesProductos.map(d => d.color))];
    const talles = [...new Set(
      detallesProductos.flatMap(d => d.stocks.map(s => s.talle.name))
    )];
    const categorias = [...new Set(
      detallesProductos.flatMap(d => d.producto.categorias.map(c => c.nombre))
    )];

    return {
      colores: colores.sort(),
      talles: talles.sort(),
      categorias: categorias.sort()
    };
  }, [detallesProductos]);

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    let filtered = detallesProductos.filter(detalle => {
      // Solo productos activos
      if (!detalle.activo) return false;

      // Filtro por color
      if (filters.colores.length > 0 && !filters.colores.includes(detalle.color)) {
        return false;
      }

      // Filtro por talle
      if (filters.talles.length > 0) {
        const tienesTalle = detalle.stocks.some(stock => 
          filters.talles.includes(stock.talle.name) && stock.stock > 0
        );
        if (!tienesTalle) return false;
      }

      // Filtro por sexo
      if (filters.sexos.length > 0 && !filters.sexos.includes(detalle.producto.sexo)) {
        return false;
      }

      // Filtro por categoría
      if (filters.categorias.length > 0) {
        const tieneCategoria = detalle.producto.categorias.some(categoria =>
          filters.categorias.includes(categoria.nombre)
        );
        if (!tieneCategoria) return false;
      }

      // Filtro por promociones
      if (filters.soloPromociones && !isDescuentoActivo(detalle.descuento)) {
        return false;
      }

      return true;
    });

    // Ordenamiento
    if (filters.ordenamiento === 'menor_precio') {
      filtered.sort((a, b) => {
        const precioA = a.descuento && isDescuentoActivo(a.descuento)
          ? a.producto.precio_venta * (1 - a.descuento.porcentaje / 100)
          : a.producto.precio_venta;
        
        const precioB = b.descuento && isDescuentoActivo(b.descuento)
          ? b.producto.precio_venta * (1 - b.descuento.porcentaje / 100)
          : b.producto.precio_venta;
        
        return precioA - precioB;
      });
    } else if (filters.ordenamiento === 'mayor_precio') {
      filtered.sort((a, b) => {
        const precioA = a.descuento && isDescuentoActivo(a.descuento)
          ? a.producto.precio_venta * (1 - a.descuento.porcentaje / 100)
          : a.producto.precio_venta;
        
        const precioB = b.descuento && isDescuentoActivo(b.descuento)
          ? b.producto.precio_venta * (1 - b.descuento.porcentaje / 100)
          : b.producto.precio_venta;
        
        return precioB - precioA;
      });
    }

    return filtered;
  }, [detallesProductos, filters]);

  // Función para actualizar filtros
  const updateFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilters({
      colores: [],
      talles: [],
      sexos: [],
      categorias: [],
      soloPromociones: false,
      ordenamiento: 'ninguno'
    });
  };

  return {
    filters,
    filteredProducts,
    availableFilters,
    updateFilters,
    clearFilters,
    totalResults: filteredProducts.length
  };
};
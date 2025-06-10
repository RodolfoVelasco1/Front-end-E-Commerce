import { useState, useEffect } from 'react';

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

// Estado del hook
interface ProductDetailState {
  detalleProducto: DetalleProducto | null;
  detallesDisponibles: DetalleProducto[];
  selectedColor: string;
  selectedTalle: string;
  selectedImageIndex: number;
  quantity: number;
  loading: boolean;
  error: string | null;
}

// Acciones del hook
interface ProductDetailActions {
  setSelectedColor: (color: string) => void;
  setSelectedTalle: (talle: string) => void;
  setSelectedImageIndex: (index: number) => void;
  setQuantity: (quantity: number) => void;
  isDescuentoActivo: (descuento: Descuento | null) => boolean;
  getPrecioFinal: () => number;
  getStockDisponible: () => number;
  getColoresDisponibles: () => string[];
  getTallesDisponibles: () => string[];
}

// Tipo de retorno del hook
interface UseProductDetailReturn extends ProductDetailState, ProductDetailActions {}

export const useProductDetail = (productId: string | undefined): UseProductDetailReturn => {
  // Estados
  const [state, setState] = useState<ProductDetailState>({
    detalleProducto: null,
    detallesDisponibles: [],
    selectedColor: '',
    selectedTalle: '',
    selectedImageIndex: 0,
    quantity: 1,
    loading: true,
    error: null,
  });

  // Función para verificar si un descuento está activo
  const isDescuentoActivo = (descuento: Descuento | null): boolean => {
    if (!descuento) return false;
    
    const now = new Date();
    const fechaInicio = new Date(descuento.fechaInicio);
    const fechaFin = new Date(descuento.fechaFin);
    
    return now >= fechaInicio && now <= fechaFin;
  };

  // Función para obtener el precio final
  const getPrecioFinal = (): number => {
    if (!state.detalleProducto) return 0;
    
    const descuentoActivo = isDescuentoActivo(state.detalleProducto.descuento);
    return descuentoActivo && state.detalleProducto.descuento
      ? state.detalleProducto.producto.precio_venta * (1 - state.detalleProducto.descuento.porcentaje / 100)
      : state.detalleProducto.producto.precio_venta;
  };

  // Función para obtener stock disponible para talle seleccionado
  const getStockDisponible = (): number => {
    if (!state.detalleProducto || !state.selectedTalle) return 0;
    
    const stockInfo = state.detalleProducto.stocks.find(
      stock => stock.talle.name === state.selectedTalle
    );
    
    return stockInfo ? stockInfo.stock : 0;
  };

  // Función para obtener colores únicos disponibles
  const getColoresDisponibles = (): string[] => {
    return [...new Set(state.detallesDisponibles.map(detalle => detalle.color))];
  };

  // Función para obtener talles disponibles para el color seleccionado
  const getTallesDisponibles = (): string[] => {
    if (!state.detalleProducto) return [];
    
    return state.detalleProducto.stocks
      .filter(stock => stock.stock > 0)
      .map(stock => stock.talle.name);
  };

  // Función para actualizar el estado
  const updateState = (updates: Partial<ProductDetailState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Acciones
  const setSelectedColor = (color: string) => {
    updateState({ selectedColor: color });
  };

  const setSelectedTalle = (talle: string) => {
    updateState({ selectedTalle: talle });
  };

  const setSelectedImageIndex = (index: number) => {
    updateState({ selectedImageIndex: index });
  };

  const setQuantity = (quantity: number) => {
    updateState({ quantity });
  };

  // Cargar producto y variantes
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;

      try {
        updateState({ loading: true, error: null });
        
        // Obtener todos los detalles de productos
        const response = await fetch('http://localhost:3001/detallesProductos');
        if (!response.ok) throw new Error('Error al cargar producto');
        
        const allDetalles: DetalleProducto[] = await response.json();
        
        // Filtrar por el ID del producto
        const productVariants = allDetalles.filter(
          detalle => detalle.producto.id === parseInt(productId) && detalle.activo
        );
        
        if (productVariants.length === 0) {
          throw new Error('Producto no encontrado');
        }
        
        const firstVariant = productVariants[0];
        
        // Obtener talles disponibles para el primer color
        const tallesDisponibles = firstVariant.stocks
          .filter(stock => stock.stock > 0)
          .map(stock => stock.talle.name);
        
        updateState({
          detallesDisponibles: productVariants,
          detalleProducto: firstVariant,
          selectedColor: firstVariant.color,
          selectedTalle: tallesDisponibles.length > 0 ? tallesDisponibles[0] : '',
          selectedImageIndex: 0,
          loading: false
        });
        
      } catch (err) {
        updateState({
          error: err instanceof Error ? err.message : 'Error desconocido',
          loading: false
        });
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Actualizar producto cuando cambia el color
  useEffect(() => {
    if (state.selectedColor && state.detallesDisponibles.length > 0) {
      const selectedVariant = state.detallesDisponibles.find(
        detalle => detalle.color === state.selectedColor
      );
      
      if (selectedVariant) {
        // Resetear talle seleccionado y seleccionar el primero disponible
        const tallesDisponibles = selectedVariant.stocks
          .filter(stock => stock.stock > 0)
          .map(stock => stock.talle.name);
        
        updateState({
          detalleProducto: selectedVariant,
          selectedImageIndex: 0,
          selectedTalle: tallesDisponibles.length > 0 ? tallesDisponibles[0] : ''
        });
      }
    }
  }, [state.selectedColor, state.detallesDisponibles]);

  return {
    // Estado
    ...state,
    
    // Acciones
    setSelectedColor,
    setSelectedTalle,
    setSelectedImageIndex,
    setQuantity,
    
    // Funciones utilitarias
    isDescuentoActivo,
    getPrecioFinal,
    getStockDisponible,
    getColoresDisponibles,
    getTallesDisponibles,
  };
};
import { useEffect } from 'react';
import { create } from 'zustand';
import { ICategoria } from '../types/ICategoria';

// Definición de la interfaz del estado de categorías
interface CategoryState {
  // Datos
  categorias: ICategoria[];
  
  // Acciones
  fetchCategorias: () => Promise<void>;
  addCategoria: (categoria: ICategoria) => Promise<void>;
  updateCategoria: (id: number, categoria: ICategoria) => Promise<void>;
  deleteCategoria: (id: number) => Promise<void>;
}

// Datos mock para probar la interfaz
const mockCategorias: ICategoria[] = [
  { id: 1, nombre: 'Casual' },
  { id: 2, nombre: 'Deportivo' },
  { id: 3, nombre: 'Formal' },
  { id: 4, nombre: 'Verano' },
  { id: 5, nombre: 'Invierno' },
  { id: 6, nombre: 'Ofertas' },
  { id: 7, nombre: 'Nuevos' }
];

// Creación del store de categorías
export const useCategoryStore = create<CategoryState>((set, get) => ({
  // Estado inicial
  categorias: mockCategorias,
  
  // Métodos para cargar datos
  fetchCategorias: async () => {
    // En un caso real, aquí cargarías datos de la API
    // Por ahora usamos los mock data
    set({ categorias: mockCategorias });
  },
  
  // Métodos CRUD
  addCategoria: async (categoria) => {
    const newId = Math.max(...get().categorias.map(c => c.id)) + 1;
    const newCategoria = { ...categoria, id: newId };
    set({ categorias: [...get().categorias, newCategoria] });
  },
  
  updateCategoria: async (id, categoria) => {
    set({
      categorias: get().categorias.map(c => 
        c.id === id ? { ...categoria, id } : c
      )
    });
  },
  
  deleteCategoria: async (id) => {
    set({
      categorias: get().categorias.filter(c => c.id !== id)
    });
  }
}));

// Hook para manejar las categorías
export const useCategoryManager = () => {
  const {
    categorias,
    fetchCategorias,
    addCategoria,
    updateCategoria,
    deleteCategoria
  } = useCategoryStore();
  
  // Cargamos las categorías cuando se monta el componente
  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);
  
  return {
    categorias,
    addCategoria,
    updateCategoria,
    deleteCategoria
  };
};
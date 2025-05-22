import { useEffect } from 'react';
import { useProductStore } from '../store/productStore';
import { useCategoryStore } from './useCategories';

// Este hook facilita el uso del store de productos y carga los datos cuando se monta el componente
export const useProductManager = () => {
  const {
    // Datos
    productListItems,
    productos,
    detallesProductos,
    talles,
    stocks,
    
    // Estado UI
    selectedProduct,
    isViewModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isAddModalOpen,
    
    // Métodos fetch
    fetchProductos,
    
    // Métodos CRUD
    addProducto,
    updateProducto,
    deleteProducto,
    
    // Métodos UI
    openViewModal,
    openEditModal,
    openDeleteModal,
    openAddModal,
    closeModals
  } = useProductStore();
  
  // Obtenemos las categorías del store de categorías
  const { categorias, fetchCategorias } = useCategoryStore();
  
  // Cargamos los productos y categorías cuando se monta el componente
  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, [fetchProductos, fetchCategorias]);
  
  return {
    // Datos
    productListItems,
    productos,
    detallesProductos,
    talles,
    categorias, // Ahora viene del store de categorías
    stocks,
    
    // Estado UI
    selectedProduct,
    isViewModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isAddModalOpen,
    
    // Métodos CRUD
    addProducto,
    updateProducto,
    deleteProducto,
    
    // Métodos UI
    openViewModal,
    openEditModal,
    openDeleteModal,
    openAddModal,
    closeModals
  };
};
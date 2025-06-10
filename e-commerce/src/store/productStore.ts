import { create } from 'zustand';
import { IProducto } from '../types/IProducto';
import { IDetalleProducto } from '../types/IDetalleProducto';
import { ITalle } from '../types/ITalle';
import { IStock } from '../types/IStock';
import { ICategoria } from '../types/ICategoria';
import { IDescuento } from '../types/IDescuento';
import { IImagen } from '../types/IImagen';

// Interfaz para el producto mostrado en la lista (combinación de varias interfaces)
export interface ProductListItem {
  id: number;
  nombre: string;
  talle: string;
  color: string;
  precio: number;
  stock: number;
  detalleProductoId: number;
}

// Estado del store
interface ProductState {
  // Datos
  productos: IProducto[];
  detallesProductos: IDetalleProducto[];
  talles: ITalle[];
  stocks: IStock[];
  categorias: ICategoria[];
  descuentos: IDescuento[];
  imagenes: IImagen[];
  
  // Items procesados para la lista
  productListItems: ProductListItem[];
  
  // Estado UI
  selectedProduct: ProductListItem | null;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isAddModalOpen: boolean;
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchProductos: () => Promise<void>;
  fetchTalles: () => Promise<void>;
  fetchCategorias: () => Promise<void>;
  fetchDescuentos: () => Promise<void>;
  fetchImagenes: () => Promise<void>;
  addProducto: (producto: IProducto, detalleProducto: IDetalleProducto, stocks: IStock[]) => Promise<void>;
  updateProducto: (producto: IProducto, detalleProducto: IDetalleProducto, stocks: IStock[]) => Promise<void>;
  deleteProducto: (id: number) => Promise<void>;
  
  // Acciones UI
  setSelectedProduct: (product: ProductListItem | null) => void;
  openViewModal: (product: ProductListItem) => void;
  openEditModal: (product: ProductListItem) => void;
  openDeleteModal: (product: ProductListItem) => void;
  openAddModal: () => void;
  closeModals: () => void;
}

// Configuración de la API
const API_BASE_URL = 'http://localhost:3001'; // Asume que usas json-server en puerto 3001

// Funciones para hacer peticiones a la API
const apiService = {
  // GET requests
  async getProductos(): Promise<IProducto[]> {
    const response = await fetch(`${API_BASE_URL}/productos`);
    if (!response.ok) throw new Error('Error al cargar productos');
    return response.json();
  },

  async getDetallesProductos(): Promise<IDetalleProducto[]> {
    const response = await fetch(`${API_BASE_URL}/detallesProductos`);
    if (!response.ok) throw new Error('Error al cargar detalles de productos');
    return response.json();
  },

  async getTalles(): Promise<ITalle[]> {
    const response = await fetch(`${API_BASE_URL}/talles`);
    if (!response.ok) throw new Error('Error al cargar talles');
    return response.json();
  },

  async getStocks(): Promise<IStock[]> {
    const response = await fetch(`${API_BASE_URL}/stocks`);
    if (!response.ok) throw new Error('Error al cargar stocks');
    return response.json();
  },

  async getCategorias(): Promise<ICategoria[]> {
    const response = await fetch(`${API_BASE_URL}/categorias`);
    if (!response.ok) throw new Error('Error al cargar categorías');
    return response.json();
  },

  async getDescuentos(): Promise<IDescuento[]> {
    const response = await fetch(`${API_BASE_URL}/descuentos`);
    if (!response.ok) throw new Error('Error al cargar descuentos');
    return response.json();
  },

  async getImagenes(): Promise<IImagen[]> {
    const response = await fetch(`${API_BASE_URL}/imagenes`);
    if (!response.ok) throw new Error('Error al cargar imágenes');
    return response.json();
  },

  // POST requests
  async createProducto(producto: Omit<IProducto, 'id'>): Promise<IProducto> {
    const response = await fetch(`${API_BASE_URL}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });
    if (!response.ok) throw new Error('Error al crear producto');
    return response.json();
  },

  async createDetalleProducto(detalle: Omit<IDetalleProducto, 'id'>): Promise<IDetalleProducto> {
    const response = await fetch(`${API_BASE_URL}/detallesProductos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(detalle)
    });
    if (!response.ok) throw new Error('Error al crear detalle de producto');
    return response.json();
  },

  async createStock(stock: Omit<IStock, 'id'>): Promise<IStock> {
    const response = await fetch(`${API_BASE_URL}/stocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stock)
    });
    if (!response.ok) throw new Error('Error al crear stock');
    return response.json();
  },

  // PUT requests
  async updateProducto(id: number, producto: IProducto): Promise<IProducto> {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });
    if (!response.ok) throw new Error('Error al actualizar producto');
    return response.json();
  },

  async updateDetalleProducto(id: number, detalle: IDetalleProducto): Promise<IDetalleProducto> {
    const response = await fetch(`${API_BASE_URL}/detallesProductos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(detalle)
    });
    if (!response.ok) throw new Error('Error al actualizar detalle de producto');
    return response.json();
  },

  async updateStock(id: number, stock: IStock): Promise<IStock> {
    const response = await fetch(`${API_BASE_URL}/stocks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stock)
    });
    if (!response.ok) throw new Error('Error al actualizar stock');
    return response.json();
  },

  // DELETE requests
  async deleteProducto(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar producto');
  },

  async deleteDetalleProducto(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/detallesProductos/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar detalle de producto');
  },

  async deleteStock(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/stocks/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar stock');
  }
};

// Función para procesar datos y crear items para la lista
const processProductListItems = (detallesProductos: IDetalleProducto[]): ProductListItem[] => {
  return detallesProductos.flatMap(detalle => {
    // Si un producto tiene múltiples stocks (talles), crea un item por cada talle
    return detalle.stocks.map(stock => ({
      id: detalle.producto.id,
      nombre: detalle.producto.nombre,
      talle: stock.talle.name,
      color: detalle.color,
      precio: detalle.producto.precio_venta,
      stock: stock.stock,
      detalleProductoId: detalle.id
    }));
  });
};

// Creación del store
export const useProductStore = create<ProductState>((set, get) => ({
  // Estado inicial
  productos: [],
  detallesProductos: [],
  talles: [],
  stocks: [],
  categorias: [],
  descuentos: [],
  imagenes: [],
  productListItems: [],
  selectedProduct: null,
  isViewModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  isAddModalOpen: false,
  loading: false,
  error: null,

  // Método principal para cargar todos los datos
  fetchProductos: async () => {
    set({ loading: true, error: null });
    
    try {
      // Cargar todos los datos necesarios en paralelo
      const [productos, detallesProductos, talles, stocks, categorias, descuentos, imagenes] = await Promise.all([
        apiService.getProductos(),
        apiService.getDetallesProductos(),
        apiService.getTalles(),
        apiService.getStocks(),
        apiService.getCategorias(),
        apiService.getDescuentos(),
        apiService.getImagenes()
      ]);

      set({
        productos,
        detallesProductos,
        talles,
        stocks,
        categorias,
        descuentos,
        imagenes,
        productListItems: processProductListItems(detallesProductos),
        loading: false
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        loading: false 
      });
    }
  },

  // Métodos individuales para cargar datos específicos
  fetchTalles: async () => {
    try {
      const talles = await apiService.getTalles();
      set({ talles });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al cargar talles' });
    }
  },

  fetchCategorias: async () => {
    try {
      const categorias = await apiService.getCategorias();
      set({ categorias });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al cargar categorías' });
    }
  },

  fetchDescuentos: async () => {
    try {
      const descuentos = await apiService.getDescuentos();
      set({ descuentos });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al cargar descuentos' });
    }
  },

  fetchImagenes: async () => {
    try {
      const imagenes = await apiService.getImagenes();
      set({ imagenes });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al cargar imágenes' });
    }
  },

  // Métodos CRUD
  addProducto: async (producto, detalleProducto, stocks) => {
    set({ loading: true, error: null });
    
    try {
      // 1. Crear el producto
      const newProducto = await apiService.createProducto(producto);
      
      // 2. Crear los stocks
      const createdStocks = await Promise.all(
        stocks.map(stock => apiService.createStock(stock))
      );
      
      // 3. Crear el detalle del producto con referencia al producto y stocks creados
      const detalleToCreate = {
        ...detalleProducto,
        producto: newProducto,
        stocks: createdStocks
      };
      
      const newDetalle = await apiService.createDetalleProducto(detalleToCreate);
      
      // 4. Actualizar el estado local
      set({
        productos: [...get().productos, newProducto],
        detallesProductos: [...get().detallesProductos, newDetalle],
        stocks: [...get().stocks, ...createdStocks],
        productListItems: processProductListItems([...get().detallesProductos, newDetalle]),
        loading: false
      });
      
      get().closeModals();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al agregar producto',
        loading: false 
      });
    }
  },

  updateProducto: async (producto, detalleProducto, stocks) => {
    set({ loading: true, error: null });
    
    try {
      // 1. Actualizar el producto
      const updatedProducto = await apiService.updateProducto(producto.id, producto);
      
      // 2. Actualizar los stocks
      const updatedStocks = await Promise.all(
        stocks.map(stock => 
          stock.id 
            ? apiService.updateStock(stock.id, stock)
            : apiService.createStock(stock)
        )
      );
      
      // 3. Actualizar el detalle del producto
      const detalleToUpdate = {
        ...detalleProducto,
        producto: updatedProducto,
        stocks: updatedStocks
      };
      
      const updatedDetalle = await apiService.updateDetalleProducto(detalleProducto.id, detalleToUpdate);
      
      // 4. Actualizar el estado local
      const updatedProductos = get().productos.map(p => 
        p.id === producto.id ? updatedProducto : p
      );
      
      const updatedDetalles = get().detallesProductos.map(d => 
        d.id === detalleProducto.id ? updatedDetalle : d
      );
      
      const existingStocks = get().stocks.filter(s => 
        !stocks.some(us => us.id === s.id)
      );
      
      set({
        productos: updatedProductos,
        detallesProductos: updatedDetalles,
        stocks: [...existingStocks, ...updatedStocks],
        productListItems: processProductListItems(updatedDetalles),
        loading: false
      });
      
      get().closeModals();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al actualizar producto',
        loading: false 
      });
    }
  },

  deleteProducto: async (id) => {
    set({ loading: true, error: null });
    
    try {
      // 1. Encontrar el detalle del producto a eliminar
      const detalleToDelete = get().detallesProductos.find(d => d.producto.id === id);
      
      if (detalleToDelete) {
        // 2. Eliminar los stocks asociados
        await Promise.all(
          detalleToDelete.stocks.map(stock => apiService.deleteStock(stock.id))
        );
        
        // 3. Eliminar el detalle del producto
        await apiService.deleteDetalleProducto(detalleToDelete.id);
      }
      
      // 4. Eliminar el producto
      await apiService.deleteProducto(id);
      
      // 5. Actualizar el estado local
      const updatedProductos = get().productos.filter(p => p.id !== id);
      const updatedDetalles = get().detallesProductos.filter(d => d.producto.id !== id);
      const updatedStocks = get().stocks.filter(s => 
        !detalleToDelete?.stocks.some(ds => ds.id === s.id)
      );
      
      set({
        productos: updatedProductos,
        detallesProductos: updatedDetalles,
        stocks: updatedStocks,
        productListItems: processProductListItems(updatedDetalles),
        loading: false
      });
      
      get().closeModals();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al eliminar producto',
        loading: false 
      });
    }
  },

  // Métodos UI
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  
  openViewModal: (product) => set({ 
    selectedProduct: product, 
    isViewModalOpen: true,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    isAddModalOpen: false
  }),
  
  openEditModal: (product) => set({ 
    selectedProduct: product, 
    isViewModalOpen: false,
    isEditModalOpen: true,
    isDeleteModalOpen: false,
    isAddModalOpen: false
  }),
  
  openDeleteModal: (product) => set({ 
    selectedProduct: product, 
    isViewModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: true,
    isAddModalOpen: false
  }),
  
  openAddModal: () => set({ 
    selectedProduct: null, 
    isViewModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    isAddModalOpen: true
  }),
  
  closeModals: () => set({ 
    isViewModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    isAddModalOpen: false,
    error: null
  })
}));
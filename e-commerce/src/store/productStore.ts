import { create } from 'zustand';
import { IProducto } from '../types/IProducto';
import { IDetalleProducto } from '../types/IDetalleProducto';
import { ITalle } from '../types/ITalle';
import { IStock } from '../types/IStock';
import { ICategoria } from '../types/ICategoria';
import { IDescuento } from '../types/IDescuento';
import { IImagen } from '../types/IImagen';
import { ISexo } from '../types/iSexo';
import { ITipoProducto } from '../types/ITipoProducto';


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
  
  // Acciones
  fetchProductos: () => Promise<void>;
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

// Datos mock para probar la interfaz
const mockProductos: IProducto[] = [
  { id: 1, nombre: 'Nombre1', sexo: ISexo.MASCULINO, precio_compra: 1000, precio_venta: 1500, tipoProducto: ITipoProducto.CALZADO, categorias: [] },
  { id: 2, nombre: 'Nombre2', sexo: ISexo.FEMENINO, precio_compra: 800, precio_venta: 1200, tipoProducto: ITipoProducto.ROPA, categorias: [] },
  { id: 3, nombre: 'Nombre3', sexo: ISexo.UNISEX, precio_compra: 500, precio_venta: 900, tipoProducto: ITipoProducto.ACCESORIO, categorias: [] },
  { id: 4, nombre: 'Nombre4', sexo: ISexo.FEMENINO, precio_compra: 1200, precio_venta: 2000, tipoProducto: ITipoProducto.ROPA, categorias: [] },
  { id: 5, nombre: 'Nombre5', sexo: ISexo.MASCULINO, precio_compra: 600, precio_venta: 1100, tipoProducto: ITipoProducto.CALZADO, categorias: [] },
  { id: 6, nombre: 'Nombre6', sexo: ISexo.UNISEX, precio_compra: 300, precio_venta: 600, tipoProducto: ITipoProducto.ACCESORIO, categorias: [] },
  { id: 7, nombre: 'Nombre7', sexo: ISexo.FEMENINO, precio_compra: 900, precio_venta: 1800, tipoProducto: ITipoProducto.ROPA, categorias: [] },
];

const mockTalles: ITalle[] = [
  { id: 1, name: 'Talle1' },
  { id: 2, name: 'Talle2' },
  { id: 3, name: 'Talle3' },
  { id: 4, name: 'Talle4' },
  { id: 5, name: 'Talle5' },
  { id: 6, name: 'Talle6' },
  { id: 7, name: 'Talle7' },
];

const mockStocks: IStock[] = [
  { id: 1, stock: 10, talle: mockTalles[0] },
  { id: 2, stock: 15, talle: mockTalles[1] },
  { id: 3, stock: 8, talle: mockTalles[2] },
  { id: 4, stock: 20, talle: mockTalles[3] },
  { id: 5, stock: 5, talle: mockTalles[4] },
  { id: 6, stock: 12, talle: mockTalles[5] },
  { id: 7, stock: 7, talle: mockTalles[6] },
];

const mockDetallesProductos: IDetalleProducto[] = [
  { id: 1, color: 'Color1', activo: true, producto: mockProductos[0], descuento: null, imagenes: [], stocks: [mockStocks[0]] },
  { id: 2, color: 'Color2', activo: true, producto: mockProductos[1], descuento: null, imagenes: [], stocks: [mockStocks[1]] },
  { id: 3, color: 'Color3', activo: true, producto: mockProductos[2], descuento: null, imagenes: [], stocks: [mockStocks[2]] },
  { id: 4, color: 'Color4', activo: true, producto: mockProductos[3], descuento: null, imagenes: [], stocks: [mockStocks[3]] },
  { id: 5, color: 'Color5', activo: true, producto: mockProductos[4], descuento: null, imagenes: [], stocks: [mockStocks[4]] },
  { id: 6, color: 'Color6', activo: true, producto: mockProductos[5], descuento: null, imagenes: [], stocks: [mockStocks[5]] },
  { id: 7, color: 'Color7', activo: true, producto: mockProductos[6], descuento: null, imagenes: [], stocks: [mockStocks[6]] },
];

// Función para procesar datos y crear items para la lista
const processProductListItems = (detallesProductos: IDetalleProducto[]): ProductListItem[] => {
  return detallesProductos.map(detalle => {
    const stock = detalle.stocks[0]?.stock || 0;
    const talle = detalle.stocks[0]?.talle.name || '';
    
    return {
      id: detalle.producto.id,
      nombre: detalle.producto.nombre,
      talle,
      color: detalle.color,
      precio: detalle.producto.precio_venta,
      stock,
      detalleProductoId: detalle.id
    };
  });
};

// Creación del store
export const useProductStore = create<ProductState>((set, get) => ({
  // Estado inicial
  productos: mockProductos,
  detallesProductos: mockDetallesProductos,
  talles: mockTalles,
  stocks: mockStocks,
  categorias: [],
  descuentos: [],
  imagenes: [],
  productListItems: processProductListItems(mockDetallesProductos),
  selectedProduct: null,
  isViewModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  isAddModalOpen: false,

  // Métodos para cargar datos
  fetchProductos: async () => {
    // En un caso real, aquí cargarías datos de la API
    // Por ahora usamos los mock data
    const detallesProductos = mockDetallesProductos;
    set({ 
      detallesProductos,
      productListItems: processProductListItems(detallesProductos)
    });
  },

  // Métodos CRUD
  addProducto: async (producto, detalleProducto, stocks) => {
    // Simulamos un ID para el nuevo producto
    const newProductoId = Math.max(...get().productos.map(p => p.id)) + 1;
    const newDetalleId = Math.max(...get().detallesProductos.map(d => d.id)) + 1;
    
    // Creamos las nuevas entidades
    const newProducto = { ...producto, id: newProductoId };
    const newDetalle = { 
      ...detalleProducto, 
      id: newDetalleId, 
      producto: newProducto,
      stocks: stocks.map((stock, index) => ({
        ...stock,
        id: get().stocks.length + index + 1
      }))
    };
    
    // Actualizamos el estado
    set({
      productos: [...get().productos, newProducto],
      detallesProductos: [...get().detallesProductos, newDetalle],
      stocks: [...get().stocks, ...newDetalle.stocks],
      productListItems: processProductListItems([...get().detallesProductos, newDetalle])
    });
    
    get().closeModals();
  },

  updateProducto: async (producto, detalleProducto, stocks) => {
    // Actualizamos los productos
    const updatedProductos = get().productos.map(p => 
      p.id === producto.id ? producto : p
    );
    
    // Actualizamos los detalles
    const updatedDetalles = get().detallesProductos.map(d => 
      d.id === detalleProducto.id 
        ? { ...detalleProducto, producto, stocks } 
        : d
    );
    
    // Actualizamos los stocks
    const existingStocks = get().stocks.filter(s => 
      !detalleProducto.stocks.some(ds => ds.id === s.id)
    );
    
    set({
      productos: updatedProductos,
      detallesProductos: updatedDetalles,
      stocks: [...existingStocks, ...stocks],
      productListItems: processProductListItems(updatedDetalles)
    });
    
    get().closeModals();
  },

  deleteProducto: async (id) => {
    // Encontramos los detalles asociados al producto
    const detalleToDelete = get().detallesProductos.find(d => d.producto.id === id);
    
    if (detalleToDelete) {
      // Eliminamos los stocks asociados
      const stocksToKeep = get().stocks.filter(s => 
        !detalleToDelete.stocks.some(ds => ds.id === s.id)
      );
      
      // Eliminamos el detalle y el producto
      const updatedDetalles = get().detallesProductos.filter(d => d.producto.id !== id);
      const updatedProductos = get().productos.filter(p => p.id !== id);
      
      set({
        productos: updatedProductos,
        detallesProductos: updatedDetalles,
        stocks: stocksToKeep,
        productListItems: processProductListItems(updatedDetalles)
      });
    }
    
    get().closeModals();
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
    isAddModalOpen: false
  })
}));
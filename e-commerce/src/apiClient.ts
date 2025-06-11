import axios from 'axios';
import { IDetalleProducto } from './types/IDetalleProducto';
import { ITalle } from './types/ITalle';
import { ISexo } from './types/ISexo';
import { ITipoProducto } from './types/ITipoProducto';


// Configuración de axios para la API real
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Datos de ejemplo para desarrollo mientras no hay backend
const mockTalles: ITalle[] = [
  { id: 1, name: 'XS' },
  { id: 2, name: 'S' },
  { id: 3, name: 'M' },
  { id: 4, name: 'L' },
  { id: 5, name: 'XL' },
  { id: 6, name: 'XXL' },
  { id: 7, name: '36' },
  { id: 8, name: '37' },
  { id: 9, name: '38' },
  { id: 10, name: '39' },
  { id: 11, name: '40' },
  { id: 12, name: '41' },
  { id: 13, name: '42' },
  { id: 14, name: '43' },
  { id: 15, name: '44' },
];

// Datos de ejemplo para productos
const mockProducts: IDetalleProducto[] = [
  {
    id: 1,
    color: '#000000',
    activo: true,
    producto: {
      id: 1,
      nombre: 'Remera Classic',
      sexo: ISexo.HOMBRE,
      precio_compra: 15,
      precio_venta: 29.99,
      tipoProducto: ITipoProducto.ROPA,
      categorias: [{ id: 1, nombre: 'Remeras' }]
    },
    descuento: null,
    imagenes: [
      { id: 1, url: '/assets/remera-negra.jpg', alt: 'Remera Classic negra' }
    ],
    stocks: [
      { id: 1, stock: 10, talle: { id: 2, name: 'S' } },
      { id: 2, stock: 15, talle: { id: 3, name: 'M' } },
      { id: 3, stock: 8, talle: { id: 4, name: 'L' } }
    ]
  },
  {
    id: 2,
    color: '#0000FF',
    activo: true,
    producto: {
      id: 2,
      nombre: 'Remera Sport',
      sexo: ISexo.HOMBRE,
      precio_compra: 18,
      precio_venta: 34.99,
      tipoProducto: ITipoProducto.ROPA,
      categorias: [{ id: 1, nombre: 'Remeras' }, { id: 2, nombre: 'Deportiva' }]
    },
    descuento: {
      id: 1,
      nombre: 'Descuento Verano',
      fechaInicio: '2025-01-01',
      fechaFin: '2025-06-30',
      porcentaje: 20
    },
    imagenes: [
      { id: 2, url: '/assets/remera-azul.jpg', alt: 'Remera Sport azul' }
    ],
    stocks: [
      { id: 4, stock: 5, talle: { id: 2, name: 'S' } },
      { id: 5, stock: 12, talle: { id: 3, name: 'M' } },
      { id: 6, stock: 7, talle: { id: 4, name: 'L' } }
    ]
  },
  {
    id: 3,
    color: '#FFFFFF',
    activo: true,
    producto: {
      id: 3,
      nombre: 'Vestido Elegante',
      sexo: ISexo.MUJER,
      precio_compra: 45,
      precio_venta: 89.99,
      tipoProducto: ITipoProducto.ROPA,
      categorias: [{ id: 3, nombre: 'Vestidos' }]
    },
    descuento: null,
    imagenes: [
      { id: 3, url: '/assets/vestido-blanco.jpg', alt: 'Vestido Elegante blanco' }
    ],
    stocks: [
      { id: 7, stock: 3, talle: { id: 2, name: 'S' } },
      { id: 8, stock: 6, talle: { id: 3, name: 'M' } },
      { id: 9, stock: 4, talle: { id: 4, name: 'L' } }
    ]
  },
  {
    id: 4,
    color: '#000000',
    activo: true,
    producto: {
      id: 4,
      nombre: 'Zapatillas Runner',
      sexo: ISexo.UNISEX,
      precio_compra: 60,
      precio_venta: 119.99,
      tipoProducto: ITipoProducto.CALZADO,
      categorias: [{ id: 4, nombre: 'Zapatillas' }, { id: 2, nombre: 'Deportiva' }]
    },
    descuento: {
      id: 2,
      nombre: 'Descuento Running',
      fechaInicio: '2025-04-01',
      fechaFin: '2025-05-31',
      porcentaje: 15
    },
    imagenes: [
      { id: 4, url: '/assets/zapatillas-negras.jpg', alt: 'Zapatillas Runner negras' }
    ],
    stocks: [
      { id: 10, stock: 2, talle: { id: 9, name: '38' } },
      { id: 11, stock: 4, talle: { id: 10, name: '39' } },
      { id: 12, stock: 3, talle: { id: 11, name: '40' } },
      { id: 13, stock: 5, talle: { id: 12, name: '41' } }
    ]
  },
  {
    id: 5,
    color: '#A52A2A',
    activo: true,
    producto: {
      id: 5,
      nombre: 'Medias Spider-man',
      sexo: ISexo.HOMBRE,
      precio_compra: 25,
      precio_venta: 49.99,
      tipoProducto: ITipoProducto.ROPA,
      categorias: [{ id: 5, nombre: 'Medias' }]
    },
    descuento: null,
    imagenes: [
      { id: 5, url: '/assets/medias.jpg', alt: 'Medias marrón' }
    ],
    stocks: [
      { id: 14, stock: 8, talle: { id: 1, name: 'XS' } }
    ]
  }
];

// Cliente API con opciones de mock o real
export const apiClient = {
  // Método genérico GET
  get: async (url: string) => {
    // En un entorno de desarrollo sin backend, devolvemos datos de ejemplo
    if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_USE_REAL_API) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular retraso de red
      
      if (url === '/talles') {
        return { data: mockTalles };
      }
      
      if (url === '/detalleProductos') {
        return { data: mockProducts };
      }
      
      if (url.startsWith('/detalleProductos/')) {
        const id = parseInt(url.split('/').pop() || '0');
        const producto = mockProducts.find(p => p.id === id);
        if (producto) {
          return { data: producto };
        }
        throw new Error('Producto no encontrado');
      }
      
      // Si no coincide con ninguna ruta mock
      throw new Error(`Ruta no implementada en el mock: ${url}`);
    }
    
    // En caso de tener API real
    return axiosClient.get(url);
  },
  
  // Método genérico POST
  post: async (url: string, data: any) => {
    // En desarrollo con mock
    if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_USE_REAL_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('POST Mock request:', url, data);
      return { data: { success: true, id: Math.floor(Math.random() * 1000) + 100 } };
    }
    
    // Con API real
    return axiosClient.post(url, data);
  },
  
  // Añade más métodos según sea necesario: put, delete, etc.
};
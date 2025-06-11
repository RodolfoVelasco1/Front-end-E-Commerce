import React, { useState, useEffect } from 'react';
import styles from './Modal.module.css';
import { ProductListItem } from '../../../store/productStore';
import { useProductManager } from '../../../hooks/useProducts';
import { ISexo } from '../../../types/ISexo';
import { ITipoProducto } from '../../../types/ITipoProducto';

// Add type definition for Descuento
interface IDescuento {
  id: number;
  nombre: string;
  porcentaje: number;
  fechaInicio: string;
  fechaFin: string;
}

interface ModalProps {
  isOpen: boolean;
  mode: 'view' | 'edit' | 'delete' | 'add';
  onClose: () => void;
  onConfirm?: () => void;
  productData: ProductListItem | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, mode, onClose, onConfirm, productData }) => {
  const {
    detallesProductos,
    talles,
    categorias,
    addProducto,
    updateProducto
  } = useProductManager();
  
  // Mock descuentos data - replace this with actual data from your store/API
  const descuentos: IDescuento[] = [
    {
      id: 1,
      nombre: "Descuento de Temporada",
      porcentaje: 15,
      fechaInicio: "2025-06-01",
      fechaFin: "2025-07-31"
    },
    {
      id: 2,
      nombre: "Black Friday",
      porcentaje: 25,
      fechaInicio: "2025-11-25",
      fechaFin: "2025-11-30"
    }
  ];
  
  // Encontrar el detalle del producto completo para edición/visualización
  const detalleProducto = productData 
    ? detallesProductos.find(d => d.id === productData.detalleProductoId) 
    : null;
  
  const producto = detalleProducto ? detalleProducto.producto : null;
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    color: '',
    precio_compra: 0,
    precio_venta: 0,
    sexo: ISexo.UNISEX,
    tipoProducto: ITipoProducto.ROPA,
    stocks: [] as { id: number, talle: any, stock: number }[],
    activo: true,
    selectedCategorias: [] as number[],
    // Nuevos campos para imágenes y descuentos
    imagenes: [] as { id: number, url: string, alt: string }[],
    descuentoId: null as number | null
  });

  // Cargar datos del producto cuando se abre el modal
  useEffect(() => {
    if (detalleProducto && producto && mode !== 'add') {
      setFormData({
        nombre: producto.nombre,
        color: detalleProducto.color,
        precio_compra: producto.precio_compra,
        precio_venta: producto.precio_venta,
        sexo: producto.sexo,
        tipoProducto: producto.tipoProducto,
        stocks: detalleProducto.stocks,
        activo: detalleProducto.activo,
        selectedCategorias: producto.categorias.map(c => c.id),
        imagenes: detalleProducto.imagenes || [],
        descuentoId: detalleProducto.descuento ? detalleProducto.descuento.id : null
      });
    } else if (mode === 'add') {
      // Reset form para añadir un nuevo producto
      setFormData({
        nombre: '',
        color: '',
        precio_compra: 0,
        precio_venta: 0,
        sexo: ISexo.UNISEX,
        tipoProducto: ITipoProducto.ROPA,
        stocks: [
          {
            id: 0, // Se asignará un ID real al guardar
            talle: talles[0],
            stock: 0
          }
        ],
        activo: true,
        selectedCategorias: [],
        imagenes: [{ id: 0, url: '', alt: '' }],
        descuentoId: null
      });
    }
  }, [detalleProducto, producto, mode, talles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Manejar diferentes tipos de inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleStockChange = (talleId: number, value: number) => {
    setFormData({
      ...formData,
      stocks: formData.stocks.map(s => 
        s.talle.id === talleId ? { ...s, stock: value } : s
      )
    });
  };

  const handleAddTalle = () => {
    // Encontrar el primer talle que no está en el stock actual
    const availableTalle = talles.find(t => 
      !formData.stocks.some(s => s.talle.id === t.id)
    );

    if (availableTalle) {
      setFormData({
        ...formData,
        stocks: [
          ...formData.stocks,
          {
            id: 0, // Se asignará un ID real al guardar
            talle: availableTalle,
            stock: 0
          }
        ]
      });
    }
  };

  const handleRemoveTalle = (talleId: number) => {
    setFormData({
      ...formData,
      stocks: formData.stocks.filter(s => s.talle.id !== talleId)
    });
  };

  const handleCategoriaChange = (categoriaId: number) => {
    const isSelected = formData.selectedCategorias.includes(categoriaId);
    
    if (isSelected) {
      // Quitar de la selección
      setFormData({
        ...formData,
        selectedCategorias: formData.selectedCategorias.filter(id => id !== categoriaId)
      });
    } else {
      // Agregar a la selección
      setFormData({
        ...formData,
        selectedCategorias: [...formData.selectedCategorias, categoriaId]
      });
    }
  };

  // Nuevas funciones para manejar imágenes
  const handleImageChange = (index: number, field: 'url' | 'alt', value: string) => {
    setFormData({
      ...formData,
      imagenes: formData.imagenes.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    });
  };

  const handleAddImage = () => {
    setFormData({
      ...formData,
      imagenes: [
        ...formData.imagenes,
        { id: 0, url: '', alt: '' }
      ]
    });
  };

  const handleRemoveImage = (index: number) => {
    if (formData.imagenes.length > 1) {
      setFormData({
        ...formData,
        imagenes: formData.imagenes.filter((_, i) => i !== index)
      });
    }
  };

  // Función para manejar cambio de descuento
  const handleDescuentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      descuentoId: value === '' ? null : parseInt(value)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construir categorías del producto
    const productoCategorias = categorias.filter(cat => 
      formData.selectedCategorias.includes(cat.id)
    );

    // Buscar el descuento seleccionado
    const selectedDescuento = formData.descuentoId 
      ? descuentos.find((d: IDescuento) => d.id === formData.descuentoId) || null
      : null;
    
    if (mode === 'edit' && producto && detalleProducto) {
      // Actualizar producto existente
      const updatedProducto = {
        ...producto,
        nombre: formData.nombre,
        precio_compra: formData.precio_compra,
        precio_venta: formData.precio_venta,
        sexo: formData.sexo,
        tipoProducto: formData.tipoProducto,
        categorias: productoCategorias
      };
      
      const updatedDetalleProducto = {
        ...detalleProducto,
        color: formData.color,
        activo: formData.activo,
        producto: updatedProducto,
        descuento: selectedDescuento,
        imagenes: formData.imagenes.filter(img => img.url.trim() !== '')
      };
      
      updateProducto(updatedProducto, updatedDetalleProducto, formData.stocks);
    } else if (mode === 'add') {
      // Crear un nuevo producto
      const newProducto = {
        id: 0, // Se asignará un ID real en el store
        nombre: formData.nombre,
        precio_compra: formData.precio_compra,
        precio_venta: formData.precio_venta,
        sexo: formData.sexo,
        tipoProducto: formData.tipoProducto,
        categorias: productoCategorias
      };
      
      const newDetalleProducto = {
        id: 0, // Se asignará un ID real en el store
        color: formData.color,
        activo: formData.activo,
        producto: newProducto,
        descuento: selectedDescuento,
        imagenes: formData.imagenes.filter(img => img.url.trim() !== ''),
        stocks: []
      };
      
      addProducto(newProducto, newDetalleProducto, formData.stocks);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>
            {mode === 'view' && 'Detalles del Producto'}
            {mode === 'edit' && 'Editar Producto'}
            {mode === 'delete' && 'Eliminar Producto'}
            {mode === 'add' && 'Agregar Nuevo Producto'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          {mode === 'delete' ? (
            <div className={styles.deleteConfirmation}>
              <p>¿Está seguro que desea eliminar el producto "{productData?.nombre}"?</p>
              <p>Esta acción no se puede deshacer.</p>
              <div className={styles.deleteActions}>
                <button 
                  className={styles.cancelButton} 
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button 
                  className={styles.confirmDeleteButton} 
                  onClick={onConfirm}
                >
                  Confirmar Eliminación
                </button>
              </div>
            </div>
          ) : mode === 'view' ? (
            producto && detalleProducto ? (
              <div className={styles.productDetails}>
                <div className={styles.imageSection}>
                  {detalleProducto.imagenes && detalleProducto.imagenes.length > 0 ? (
                    <img 
                      src={detalleProducto.imagenes[0].url} 
                      alt={detalleProducto.imagenes[0].alt}
                      className={styles.productImage}
                    />
                  ) : (
                    <div className={styles.noImage}>
                      No hay imagen disponible
                    </div>
                  )}
                </div>
                
                <div className={styles.infoSection}>
                  <h3>{producto.nombre}</h3>
                  
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Color:</span>
                      <div className={styles.colorDetail}>
                        <div 
                          className={styles.colorSwatch} 
                          style={{ backgroundColor: detalleProducto.color }}
                        />
                        <span>{detalleProducto.color}</span>
                      </div>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Precio de Venta:</span>
                      <span>${producto.precio_venta.toFixed(2)}</span>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Precio de Compra:</span>
                      <span>${producto.precio_compra.toFixed(2)}</span>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Tipo de Producto:</span>
                      <span>{producto.tipoProducto}</span>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Sexo:</span>
                      <span>{producto.sexo}</span>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Estado:</span>
                      <span>{detalleProducto.activo ? 'Activo' : 'Inactivo'}</span>
                    </div>
                  </div>
                  
                  <div className={styles.stockSection}>
                    <h4>Stock por Talle</h4>
                    <div className={styles.stockGrid}>
                      {detalleProducto.stocks.map(stock => (
                        <div key={stock.id} className={styles.stockItem}>
                          <span className={styles.talleName}>{stock.talle.name}:</span>
                          <span className={styles.stockAmount}>{stock.stock} unidades</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {producto.categorias && producto.categorias.length > 0 && (
                    <div className={styles.categoriesSection}>
                      <h4>Categorías</h4>
                      <div className={styles.categoriesList}>
                        {producto.categorias.map(cat => (
                          <span key={cat.id} className={styles.categoryTag}>
                            {cat.nombre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {detalleProducto.descuento && (
                    <div className={styles.discountSection}>
                      <h4>Descuento Aplicado</h4>
                      <p>{detalleProducto.descuento.nombre}: {detalleProducto.descuento.porcentaje}%</p>
                      <p>Válido desde: {new Date(detalleProducto.descuento.fechaInicio).toLocaleDateString()} hasta {new Date(detalleProducto.descuento.fechaFin).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p>No se encontró información del producto.</p>
            )
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formSection}>
                <h3>Información General</h3>
                <div className={styles.formGroup}>
                  <label htmlFor="nombre">Nombre:</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="precio_compra">Precio de Compra:</label>
                    <input
                      type="number"
                      id="precio_compra"
                      name="precio_compra"
                      value={formData.precio_compra}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="precio_venta">Precio de Venta:</label>
                    <input
                      type="number"
                      id="precio_venta"
                      name="precio_venta"
                      value={formData.precio_venta}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="sexo">Sexo:</label>
                    <select
                      id="sexo"
                      name="sexo"
                      value={formData.sexo}
                      onChange={handleInputChange}
                      required
                    >
                      <option value={ISexo.HOMBRE}>Hombre</option>
                      <option value={ISexo.MUJER}>Mujer</option>
                      <option value={ISexo.UNISEX}>Unisex</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="tipoProducto">Tipo de Producto:</label>
                    <select
                      id="tipoProducto"
                      name="tipoProducto"
                      value={formData.tipoProducto}
                      onChange={handleInputChange}
                      required
                    >
                      <option value={ITipoProducto.ROPA}>Indumentaria</option>
                      <option value={ITipoProducto.CALZADO}>Calzado</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="color">Color:</label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <div className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      id="activo"
                      name="activo"
                      checked={formData.activo}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="activo">Producto Activo</label>
                  </div>
                </div>
              </div>

              {/* Nueva sección de descuentos */}
              <div className={styles.formSection}>
                <h3>Promoción/Descuento</h3>
                <div className={styles.formGroup}>
                  <label htmlFor="descuento">Descuento:</label>
                  <select
                    id="descuento"
                    value={formData.descuentoId || ''}
                    onChange={handleDescuentoChange}
                  >
                    <option value="">Sin descuento</option>
                    {descuentos.map((descuento: IDescuento) => (
                      <option key={descuento.id} value={descuento.id}>
                        {descuento.nombre} - {descuento.porcentaje}%
                      </option>
                    ))}
                  </select>
                </div>
                {formData.descuentoId && (
                  <div className={styles.discountInfo}>
                    {(() => {
                      const selectedDiscount = descuentos.find((d: IDescuento) => d.id === formData.descuentoId);
                      return selectedDiscount ? (
                        <p>
                          Válido desde: {new Date(selectedDiscount.fechaInicio).toLocaleDateString()} 
                          hasta: {new Date(selectedDiscount.fechaFin).toLocaleDateString()}
                        </p>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>

              {/* Nueva sección de imágenes */}
              <div className={styles.formSection}>
                <h3>Imágenes del Producto</h3>
                <div className={styles.imageFormSection}>
                  {formData.imagenes.map((imagen, index) => (
                    <div key={index} className={styles.imageFormItem}>
                      <div className={styles.imageFormHeader}>
                        <h4>Imagen {index + 1}</h4>
                        {formData.imagenes.length > 1 && (
                          <button
                            type="button"
                            className={styles.removeImageButton}
                            onClick={() => handleRemoveImage(index)}
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor={`url-${index}`}>URL de la imagen:</label>
                        <input
                          type="url"
                          id={`url-${index}`}
                          value={imagen.url}
                          onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                          placeholder="https://ejemplo.com/imagen.jpg"
                          required
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor={`alt-${index}`}>Texto alternativo:</label>
                        <input
                          type="text"
                          id={`alt-${index}`}
                          value={imagen.alt}
                          onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                          placeholder="Descripción de la imagen"
                          required
                        />
                      </div>
                      
                      {imagen.url && (
                        <div className={styles.imagePreview}>
                          <img 
                            src={imagen.url} 
                            alt={imagen.alt || 'Vista previa'} 
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    className={styles.addImageButton}
                    onClick={handleAddImage}
                  >
                    Agregar otra imagen
                  </button>
                </div>
              </div>
              
              <div className={styles.formSection}>
                <h3>Stock por Talle</h3>
                <div className={styles.stockFormSection}>
                  {formData.stocks.map((stockItem, index) => (
                    <div key={index} className={styles.stockFormItem}>
                      <div className={styles.stockTalleInfo}>
                        <span>{stockItem.talle.name}</span>
                        <button 
                          type="button" 
                          className={styles.removeStockButton}
                          onClick={() => handleRemoveTalle(stockItem.talle.id)}
                          disabled={formData.stocks.length <= 1}
                        >
                          Eliminar
                        </button>
                      </div>
                      <input
                        type="number"
                        value={stockItem.stock}
                        onChange={(e) => handleStockChange(stockItem.talle.id, parseInt(e.target.value))}
                        min="0"
                        required
                      />
                    </div>
                  ))}
                  
                  {formData.stocks.length < talles.length && (
                    <button
                      type="button"
                      className={styles.addTalleButton}
                      onClick={handleAddTalle}
                    >
                      Agregar otro talle
                    </button>
                  )}
                </div>
              </div>
              
              {categorias.length > 0 && (
                <div className={styles.formSection}>
                  <h3>Categorías</h3>
                  <div className={styles.categoriesCheckboxes}>
                    {categorias.map(cat => (
                      <div key={cat.id} className={styles.categoryCheckbox}>
                        <input
                          type="checkbox"
                          id={`cat-${cat.id}`}
                          checked={formData.selectedCategorias.includes(cat.id)}
                          onChange={() => handleCategoriaChange(cat.id)}
                        />
                        <label htmlFor={`cat-${cat.id}`}>{cat.nombre}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                >
                  {mode === 'edit' ? 'Actualizar' : 'Crear'} Producto
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
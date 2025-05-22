import React from 'react';
import styles from './ListaProductos.module.css';
import Modal from '../Modal/Modal';
import { useProductManager } from '../../../hooks/useProducts';

const ListaProductos: React.FC = () => {
  const {
    productListItems,
    selectedProduct,
    isViewModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isAddModalOpen,
    openViewModal,
    openEditModal,
    openDeleteModal,
    openAddModal,
    closeModals,
    deleteProducto
  } = useProductManager();

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      deleteProducto(selectedProduct.id);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Lista de Productos</h1>
        <button className={styles.addButton} onClick={() => openAddModal()}>
          Agregar Nuevo Producto
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Talle</th>
              <th>Color</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {productListItems.map((product) => (
              <tr key={product.detalleProductoId}>
                <td>{product.nombre}</td>
                <td>{product.talle}</td>
                <td>
                  <div 
                    className={styles.colorSwatch} 
                    style={{ backgroundColor: product.color }}
                    title={product.color}
                  />
                  {product.color}
                </td>
                <td>${product.precio.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td className={styles.actions}>
                  <button 
                    className={`${styles.actionButton} ${styles.viewButton}`}
                    onClick={() => openViewModal(product)}
                  >
                    Ver
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => openEditModal(product)}
                  >
                    Editar
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => openDeleteModal(product)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      {(isViewModalOpen || isEditModalOpen || isDeleteModalOpen || isAddModalOpen) && (
        <Modal
          isOpen={isViewModalOpen || isEditModalOpen || isDeleteModalOpen || isAddModalOpen}
          mode={
            isViewModalOpen 
              ? 'view' 
              : isEditModalOpen 
                ? 'edit'
                : isDeleteModalOpen
                  ? 'delete'
                  : 'add'
          }
          onClose={closeModals}
          onConfirm={isDeleteModalOpen ? handleConfirmDelete : undefined}
          productData={selectedProduct}
        />
      )}
    </div>
  );
};

export default ListaProductos;
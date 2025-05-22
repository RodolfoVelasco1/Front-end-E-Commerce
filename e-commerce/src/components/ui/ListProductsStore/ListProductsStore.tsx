import React from 'react';
import styles from './ListProducts.module.css';
import { IDetalleProducto } from '../../../types/IDetalleProducto';
import ProductCard from '../ProductCard/ProductCard';

interface ListProductsProps {
  products: IDetalleProducto[];
}

const ListProducts: React.FC<ListProductsProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className={styles.noProducts}>
        <p>No se encontraron productos con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ListProducts;
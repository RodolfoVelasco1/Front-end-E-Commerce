import { useState } from 'react';
import useStore from '../../store/store';
import Footer from '../ui/Footer/Footer';
import Navbar from '../ui/Navbar/Navbar';
import styles from './cartPage.module.css';

// Componentes de íconos SVG personalizados
const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 7-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
  </svg>
);

const MinusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
  </svg>
);

const ShoppingCartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m3 3 1.664 6.497A2 2 0 0 0 6.601 11H15m0 0-2-7h7.5m-5.5 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
  </svg>
);

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m6-7-7 7 7 7" />
  </svg>
);

const LoadingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" width="20" height="20">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Interfaces para TypeScript
interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const CartPage = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getCartItemsCount 
  } = useStore();

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  // Función para crear preferencia de pago en Mercado Pago
  const createMercadoPagoPreference = async (items: CartItem[]) => {
    try {
      const response = await fetch('http://localhost:8080/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id.toString(),
            title: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: 'ARS', // Cambia según tu moneda
            picture_url: item.image,
          })),
          back_urls: {
            success: `${window.location.origin}/payment/success`,
            failure: `${window.location.origin}/payment/failure`,
            pending: `${window.location.origin}/payment/pending`,
          },
          notification_url: `http://localhost:8080/api/mercadopago/webhook`,
          external_reference: `order_${Date.now()}`, // ID único de la orden
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la preferencia de pago');
      }

      const preference: MercadoPagoPreference = await response.json();
      return preference;
    } catch (error) {
      console.error('Error creating MercadoPago preference:', error);
      throw error;
    }
  };

  const handleCheckout = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // Crear preferencia de pago
      const preference = await createMercadoPagoPreference(cart);
      
      // Redirigir a Mercado Pago
      // En producción usa init_point, en desarrollo usa sandbox_init_point
      const paymentUrl = process.env.NODE_ENV === 'production' 
        ? preference.init_point 
        : preference.sandbox_init_point;
      
      window.location.href = paymentUrl;
      
    } catch (error) {
      console.error('Error during checkout:', error);
      setPaymentError('Error al procesar el pago. Por favor, intenta nuevamente.');
      setIsProcessingPayment(false);
    }
  };

  if (cart.length === 0) {
    return (
        <>
        <Navbar />
      <div className={styles.cartContainer}>
        <div className={styles.cartWrapper}>
          <div className={styles.emptyCart}>
            <ShoppingCartIcon className={styles.icon} />
            <h2 className={styles.cartTitle}>Tu carrito está vacío</h2>
            <p className={styles.cartText}>Agrega algunos productos para comenzar tu compra</p>
            <button 
              className={styles.backButton}
              onClick={() => window.history.back()}
            >
              <ArrowLeftIcon className={styles.iconSmall} />
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
      <Footer />
      </>
    );
  }

  return (
    <>
    <Navbar />
    <div className={styles.cartContainer}>
      <div className={styles.cartWrapper}>
        <div className={styles.cartHeader}>
          <button 
            onClick={() => window.history.back()}
            className={styles.backButton}
          >
            <ArrowLeftIcon className={styles.iconSmall} />
            Seguir comprando
          </button>
          <h1 className={styles.cartTitle}>
            <ShoppingCartIcon className={styles.iconMedium} />
            Mi Carrito ({getCartItemsCount()} {getCartItemsCount() === 1 ? 'producto' : 'productos'})
          </h1>
        </div>

        <div className={styles.cartGrid}>
          <div className={styles.cartItems}>
            {cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemContent}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.productImage}
                      onError={(e) => {
                        e.currentTarget.src = "/api/placeholder/300/300";
                      }}
                    />
                  </div>

                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <div>
                        <h3 className={styles.itemTitle}>{item.name}</h3>
                        <p className={styles.itemPrice}>${item.price.toLocaleString()}</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={styles.removeButton}
                        title="Eliminar producto"
                      >
                        <TrashIcon className={styles.iconSmall} />
                      </button>
                    </div>

                    <div className={styles.quantityControls}>
                      <span className={styles.quantityLabel}>Cantidad:</span>
                      <div className={styles.quantityButtons}>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className={styles.decreaseButton}
                          disabled={item.quantity <= 1}
                        >
                          <MinusIcon className={styles.iconSmall} />
                        </button>
                        
                        <span className={styles.quantityDisplay}>
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className={styles.increaseButton}
                        >
                          <PlusIcon className={styles.iconSmall} />
                        </button>
                      </div>
                      
                      <div className={styles.totalPrice}>
                        <span>${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className={styles.clearCartContainer}>
              <button
                onClick={clearCart}
                className={styles.clearCartButton}
              >
                Vaciar carrito
              </button>
            </div>
          </div>

          <div className={styles.summaryContainer}>
            <div className={styles.summaryBox}>
              <h2 className={styles.summaryTitle}>Resumen del pedido</h2>
              
              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>Subtotal ({getCartItemsCount()} productos):</span>
                  <span>${getCartTotal().toLocaleString()}</span>
                </div>
                
                <div className={styles.summaryRow}>
                  <span>Envío:</span>
                  <span className={styles.freeShipping}>Gratis</span>
                </div>
                
                <hr className={styles.divider} />
                
                <div className={styles.summaryTotal}>
                  <span>Total:</span>
                  <span className={styles.totalAmount}>${getCartTotal().toLocaleString()}</span>
                </div>
              </div>

              {paymentError && (
                <div className={styles.errorMessage}>
                  {paymentError}
                </div>
              )}

              <button
                onClick={handleCheckout}
                className={styles.checkoutButton}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <LoadingIcon className={styles.iconSmall} />
                    Procesando...
                  </>
                ) : (
                  'Pagar con Mercado Pago'
                )}
              </button>


              <div className={styles.securityInfo}>
                <div className={styles.securityText}>
                  <svg className={styles.securityIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pago seguro con Mercado Pago
                </div>
                <p className={styles.encryptionNotice}>
                  Tus datos están protegidos con la máxima seguridad
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default CartPage;
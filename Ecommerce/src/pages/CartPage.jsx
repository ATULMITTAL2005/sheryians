import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/format';

export default function CartPage() {
  const { items, subtotal, shipping, tax, total, updateQuantity, removeItem } = useCart();

  if (!items.length) {
    return <EmptyState title="Your cart is empty." description="Add a few products and return here to review the subtotal and checkout flow." actionLabel="Start shopping" actionTo="/products" />;
  }

  return (
    <div className="page-stack">
      <section className="section-heading">
        <div><span className="eyebrow">Shopping cart</span><h1>Review quantities and totals before checkout.</h1></div>
        <Link to="/products">Continue shopping</Link>
      </section>

      <section className="cart-layout">
        <div className="cart-list">
          {items.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              onIncrease={() => updateQuantity(item.product.id, item.quantity + 1)}
              onDecrease={() => updateQuantity(item.product.id, item.quantity - 1)}
              onRemove={() => removeItem(item.product.id)}
            />
          ))}
        </div>

        <aside className="summary card">
          <h2>Order summary</h2>
          <div><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
          <div><span>Shipping</span><strong>{formatCurrency(shipping)}</strong></div>
          <div><span>Tax</span><strong>{formatCurrency(tax)}</strong></div>
          <div className="summary__total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
          <Button to="/checkout" variant="primary" className="summary__cta">Proceed to checkout</Button>
        </aside>
      </section>
    </div>
  );
}
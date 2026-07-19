import React, { useMemo, useState } from 'react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/format';

const initialForm = { name: '', address: '', city: '', postalCode: '', cardNumber: '' };

export default function CheckoutPage() {
  const { currentUser } = useAuth();
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();
  const [form, setForm] = useState(initialForm);
  const [successOpen, setSuccessOpen] = useState(false);

  const itemSummary = useMemo(() => items.map((item) => `${item.product.name} x ${item.quantity}`).join(', '), [items]);

  const handleSubmit = (event) => {
    event.preventDefault();
    clearCart();
    setSuccessOpen(true);
    setForm(initialForm);
  };

  return (
    <div className="page-stack checkout-page">
      <section className="section-heading">
        <div><span className="eyebrow">Checkout</span><h1>Complete the order with a simple, focused form.</h1></div>
      </section>

      <section className="checkout-layout">
        <form className="card checkout-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Full name
              <input type="text" value={form.name || currentUser?.name || ''} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
            </label>
            <label>
              Address
              <input type="text" value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} required />
            </label>
            <label>
              City
              <input type="text" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} required />
            </label>
            <label>
              Postal code
              <input type="text" value={form.postalCode} onChange={(event) => setForm((current) => ({ ...current, postalCode: event.target.value }))} required />
            </label>
            <label className="form-grid__full">
              Payment placeholder
              <input type="text" value={form.cardNumber} onChange={(event) => setForm((current) => ({ ...current, cardNumber: event.target.value }))} placeholder="Card number or payment note" required />
            </label>
          </div>
          <div className="checkout-form__note"><p>Demo checkout accepts any valid form entry and clears the cart on submit.</p></div>
          <Button type="submit" variant="primary">Place order</Button>
        </form>

        <aside className="summary card">
          <h2>Order details</h2>
          <p>{itemSummary}</p>
          <div><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
          <div><span>Shipping</span><strong>{formatCurrency(shipping)}</strong></div>
          <div><span>Tax</span><strong>{formatCurrency(tax)}</strong></div>
          <div className="summary__total"><span>Grand total</span><strong>{formatCurrency(total)}</strong></div>
        </aside>
      </section>

      <Modal isOpen={successOpen} title="Order placed" onClose={() => setSuccessOpen(false)}>
        <p>Your demo order has been submitted successfully.</p>
        <p>We will send a confirmation to {currentUser?.email ?? 'your email'}.</p>
        <Button to="/products" variant="primary" onClick={() => setSuccessOpen(false)}>Keep shopping</Button>
      </Modal>
    </div>
  );
}
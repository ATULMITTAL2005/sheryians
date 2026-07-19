import React from 'react';
import Button from './Button';
import { formatCurrency } from '../utils/format';

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <article className="cart-item card">
      <img className="cart-item__image" src={item.product.images[0]} alt={item.product.name} loading="lazy" />
      <div className="cart-item__details">
        <h3>{item.product.name}</h3>
        <p>{item.product.category}</p>
        <strong>{formatCurrency(item.product.price)}</strong>
      </div>
      <div className="cart-item__controls">
        <div className="quantity-stepper">
          <button type="button" onClick={onDecrease} aria-label={`Decrease quantity for ${item.product.name}`}>−</button>
          <span>{item.quantity}</span>
          <button type="button" onClick={onIncrease} aria-label={`Increase quantity for ${item.product.name}`}>+</button>
        </div>
        <Button variant="ghost" size="sm" onClick={onRemove}>Remove</Button>
      </div>
    </article>
  );
}

export default React.memo(CartItem);
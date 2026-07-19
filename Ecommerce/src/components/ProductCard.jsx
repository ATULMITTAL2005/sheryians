import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { createStarString, formatCurrency } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <article className="product-card card card--lift">
      <Link className="product-card__media" to={`/products/${product.id}`} aria-label={product.name}>
        <img src={product.images[0]} alt={product.name} loading="lazy" />
        <span className="product-card__badge">{product.badge}</span>
      </Link>
      <div className="product-card__body">
        <div className="product-card__meta">
          <span>{product.category}</span>
          <span aria-label={`${product.rating} out of 5`}>{createStarString(product.rating)}</span>
        </div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-card__footer">
          <strong>{formatCurrency(product.price)}</strong>
          <span>{product.stock} in stock</span>
        </div>
        <div className="product-card__actions">
          <Button to={`/products/${product.id}`} variant="soft" size="sm">
            View details
          </Button>
          <Button variant="primary" size="sm" onClick={() => addToCart(product)}>
            Add to cart
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toggleWishlist(product)}>
            {wishlisted ? 'Saved to wishlist' : 'Save to wishlist'}
          </Button>
        </div>
      </div>
    </article>
  );
}

export default React.memo(ProductCard);
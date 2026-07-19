import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { products } from '../data/products';
import { createStarString, formatCurrency } from '../utils/format';

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const product = products.find((entry) => entry.id === productId);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const relatedProducts = useMemo(
    () => products.filter((entry) => entry.category === product?.category && entry.id !== product?.id).slice(0, 3),
    [product],
  );

  if (!product) {
    return <EmptyState title="Product not found." description="The product you requested may have been moved or removed." actionLabel="Back to products" actionTo="/products" />;
  }

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="page-stack">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, { label: product.name }]} />

      <section className="product-layout card">
        <div className="gallery">
          <img className="gallery__main" src={product.images[selectedImage]} alt={product.name} loading="lazy" />
          <div className="gallery__thumbs">
            {product.images.map((image, index) => (
              <button key={image} type="button" className={selectedImage === index ? 'active' : ''} onClick={() => setSelectedImage(index)} aria-label={`View image ${index + 1} of ${product.name}`}>
                <img src={image} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div className="product-details">
          <span className="eyebrow">{product.badge}</span>
          <h1>{product.name}</h1>
          <p className="product-details__price">{formatCurrency(product.price)}</p>
          <p className="product-details__rating" aria-label={`${product.rating} out of 5`}>{createStarString(product.rating)} <span>{product.rating}</span></p>
          <p>{product.description}</p>
          <p>{product.details}</p>
          <div className="pill-row">{product.specs.map((spec) => <span key={spec} className="pill">{spec}</span>)}</div>
          <div className="product-details__meta">
            <div><span>Category</span><strong>{product.category}</strong></div>
            <div><span>Stock</span><strong>{product.stock}</strong></div>
            <div><span>Colors</span><strong>{product.colors.join(', ')}</strong></div>
          </div>
          <div className="quantity-row">
            <div className="quantity-stepper quantity-stepper--large">
              <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>−</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((current) => current + 1)}>+</button>
            </div>
            <Button variant="primary" onClick={() => addToCart(product, quantity)}>Add to cart</Button>
            <Button variant="ghost" onClick={() => toggleWishlist(product)}>{wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}</Button>
          </div>
          <div className="review-panel card">
            <h2>Reviews</h2>
            <div className="review-list">
              {product.reviews.map((review) => (
                <article key={review.name} className="review-item">
                  <strong>{review.name}</strong>
                  <span>{createStarString(review.rating)}</span>
                  <p>{review.comment}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="page-stack">
          <div className="section-heading">
            <div><span className="eyebrow">Related products</span><h2>More pieces in the same category.</h2></div>
            <Link to="/products">Browse all</Link>
          </div>
          <section className="product-grid">{relatedProducts.map((entry) => <ProductCard key={entry.id} product={entry} />)}</section>
        </section>
      ) : null}
    </div>
  );
}
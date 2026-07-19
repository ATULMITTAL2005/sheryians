import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import { categories, products } from '../data/products';
import { formatCurrency } from '../utils/format';

export default function HomePage() {
  const featuredProducts = useMemo(() => products.filter((product) => product.featured).slice(0, 4), []);

  return (
    <div className="page-stack">
      <section className="hero card">
        <div className="hero__content">
          <span className="eyebrow">Dark theme commerce system</span>
          <h1>Sharp design, fast discovery, and a polished shopping flow.</h1>
          <p>ENQUEUE is a modern React storefront with responsive layouts, reusable components, theme persistence, auth, cart management, and a clean checkout path.</p>
          <div className="hero__actions">
            <Button to="/products" variant="primary">Shop now</Button>
            <Button to="/checkout" variant="soft">Go to checkout</Button>
          </div>
          <div className="hero__stats">
            <div><strong>08+</strong><span>Curated products</span></div>
            <div><strong>04</strong><span>Core shopping flows</span></div>
            <div><strong>02</strong><span>Theme modes</span></div>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__orb hero__orb--one" />
          <div className="hero__orb hero__orb--two" />
          <article className="hero__card card">
            <span className="hero__card-label">Featured pick</span>
            <h2>{featuredProducts[0].name}</h2>
            <p>{featuredProducts[0].description}</p>
            <strong>{formatCurrency(featuredProducts[0].price)}</strong>
            <Link to={`/products/${featuredProducts[0].id}`}>Explore product</Link>
          </article>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <span className="eyebrow">Categories</span>
          <h2>Browse the collection by mood and use case.</h2>
        </div>
        <Button to="/products" variant="ghost">View all products</Button>
      </section>

      <section className="category-grid">
        {categories.map((category) => (
          <Link key={category.id} className="category-card card card--lift" to={`/products?category=${category.id}`}>
            <span>{category.label}</span>
            <h3>{category.description}</h3>
          </Link>
        ))}
      </section>

      <section className="section-heading">
        <div>
          <span className="eyebrow">Featured products</span>
          <h2>Every card is wired for conversion and quick interaction.</h2>
        </div>
      </section>

      <section className="product-grid">
        {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
      </section>

      <section className="benefit-grid">
        <article className="card benefit-card"><h3>Responsive by default</h3><p>Layout stacks cleanly on small screens and opens up into a polished multi-column view on desktop.</p></article>
        <article className="card benefit-card"><h3>Persistent preferences</h3><p>Theme, auth, cart, and wishlist state are stored locally for a smooth demo experience.</p></article>
        <article className="card benefit-card"><h3>Optimized rendering</h3><p>Filtered product lists use memoization, and the app uses lazy loading for route-level splitting.</p></article>
      </section>
    </div>
  );
}
import React from 'react';
import Button from '../components/Button';

export default function NotFoundPage() {
  return (
    <section className="state-card state-card--large">
      <span className="eyebrow">404</span>
      <h1>That page does not exist.</h1>
      <p>Use the navigation to return to the storefront or browse the catalog.</p>
      <Button to="/products" variant="primary">Back to products</Button>
    </section>
  );
}
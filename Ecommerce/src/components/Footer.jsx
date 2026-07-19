import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <strong>Enqueue</strong>
          <p>Minimal dark-theme e-commerce with product discovery, auth, cart, and checkout flows.</p>
        </div>
        <div className="site-footer__links">
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/auth">Account</Link>
        </div>
      </div>
    </footer>
  );
}
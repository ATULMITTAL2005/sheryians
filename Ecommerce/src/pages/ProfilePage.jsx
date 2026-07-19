import React from 'react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <div className="page-stack">
      <section className="section-heading">
        <div><span className="eyebrow">Profile</span><h1>Account overview and saved preferences.</h1></div>
      </section>

      <section className="profile-grid">
        <article className="card profile-card">
          <span className="eyebrow">Signed in</span>
          <h2>{currentUser?.name}</h2>
          <p>{currentUser?.email}</p>
          <div className="profile-card__stats">
            <div><strong>{itemCount}</strong><span>Cart items</span></div>
            <div><strong>{wishlistCount}</strong><span>Wishlist items</span></div>
          </div>
          <Button variant="ghost" onClick={logout}>Sign out</Button>
        </article>

        <article className="card profile-card">
          <span className="eyebrow">Demo features</span>
          <h2>What this app demonstrates</h2>
          <ul className="feature-list">
            <li>Responsive React layout with sticky navigation</li>
            <li>Theme context with persistent dark/light toggle</li>
            <li>Cart, wishlist, and protected checkout flow</li>
            <li>Route-level lazy loading for code splitting</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
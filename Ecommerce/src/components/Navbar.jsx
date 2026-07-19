import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Cart', to: '/cart' },
  { label: 'Profile', to: '/profile' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : '/products');
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" to="/">
          <Logo className="brand__logo" />
          <span>
            <strong>ENQUEUE</strong>
          </span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch} role="search">
          <input type="search" placeholder="Search products, categories, brands" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search products" />
          <button type="submit">Search</button>
        </form>

        <nav className="site-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'dark' ? '☾' : '☼'}</button>
          <Link className="icon-button icon-button--badge" to="/cart" aria-label="Open cart"><span>🛒</span>{itemCount ? <strong>{itemCount}</strong> : null}</Link>
          {currentUser ? (
            <div className="user-menu">
              <button className="user-menu__trigger" type="button" onClick={() => setUserMenuOpen((current) => !current)}>{currentUser.name.split(' ')[0]}</button>
              {userMenuOpen ? (
                <div className="user-menu__panel">
                  <Link to="/profile">Profile</Link>
                  <Link to="/checkout">Checkout</Link>
                  <button type="button" onClick={logout}>Sign out</button>
                </div>
              ) : null}
            </div>
          ) : (
            <Button to="/auth" variant="soft" size="sm">Sign in</Button>
          )}
          <button className="icon-button site-nav__toggle" type="button" onClick={() => setMobileMenuOpen((current) => !current)}>☰</button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          {!currentUser ? <Link to="/auth">Account</Link> : null}
          <button type="button" onClick={toggleTheme}>Toggle {theme === 'dark' ? 'light' : 'dark'} mode</button>
        </div>
      ) : null}
    </header>
  );
}
import React, { useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const initialForm = { name: '', email: '', password: '', confirmPassword: '' };

function isStrongPassword(password) {
  return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}/.test(password);
}

export default function AuthPage() {
  const { isAuthenticated, login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const destination = useMemo(() => location.state?.from ?? '/profile', [location.state]);

  if (isAuthenticated) {
    return <Navigate to={destination} replace />;
  }

  const validate = () => {
    const nextErrors = [];

    if (!form.email.includes('@')) nextErrors.push('Enter a valid email address.');
    if (mode === 'signup' && !form.name.trim()) nextErrors.push('Enter your full name.');
    if (mode === 'signup' && !isStrongPassword(form.password)) nextErrors.push('Password must be at least 8 characters and include upper, lower, number, and symbol.');
    if (mode === 'signup' && form.password !== form.confirmPassword) nextErrors.push('Passwords must match.');

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();

    if (nextErrors.length) {
      setErrors(nextErrors);
      setMessage('');
      return;
    }

    const result = mode === 'login' ? login(form.email, form.password) : signup({ name: form.name, email: form.email, password: form.password });

    if (!result.success) {
      setErrors([result.message]);
      setMessage('');
      return;
    }

    setErrors([]);
    setMessage(result.message);
    navigate(destination, { replace: true });
  };

  return (
    <div className="auth-layout">
      <section className="auth-panel card">
        <span className="eyebrow">Account access</span>
        <h1>{mode === 'login' ? 'Sign in to continue.' : 'Create your account.'}</h1>
        <p>Use the demo account <strong>demo@verve.dev</strong> with password <strong>Verve@1234</strong> or create a new user.</p>

        <div className="toggle-row">
          <Button variant={mode === 'login' ? 'primary' : 'soft'} onClick={() => setMode('login')}>Login</Button>
          <Button variant={mode === 'signup' ? 'primary' : 'soft'} onClick={() => setMode('signup')}>Sign up</Button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' ? (
            <label>
              Name
              <input type="text" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Your full name" />
            </label>
          ) : null}
          <label>
            Email
            <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="name@domain.com" />
          </label>
          <label>
            Password
            <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Enter a strong password" />
          </label>
          {mode === 'signup' ? (
            <label>
              Confirm password
              <input type="password" value={form.confirmPassword} onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))} placeholder="Repeat your password" />
            </label>
          ) : null}

          {errors.length ? <div className="message message--error">{errors.map((error) => <p key={error}>{error}</p>)}</div> : null}
          {message ? <div className="message message--success">{message}</div> : null}
          <Button type="submit" variant="primary">{mode === 'login' ? 'Login' : 'Create account'}</Button>
        </form>
      </section>

      <aside className="auth-aside card">
        <h2>Protected routes</h2>
        <p>Checkout and profile pages are only available after sign-in, but the cart remains visible for browsing.</p>
        <div className="auth-aside__list">
          <div><strong>Theme</strong><span>Stored in localStorage</span></div>
          <div><strong>Auth</strong><span>Demo login and sign-up flow</span></div>
          <div><strong>Validation</strong><span>Email and password strength checks</span></div>
        </div>
      </aside>
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';

export default function Button({ children, variant = 'primary', size = 'md', to, href, className = '', type = 'button', ...rest }) {
  const classes = ['button', `button--${variant}`, `button--${size}`, className].join(' ').trim();

  if (to) {
    return (
      <Link className={classes} to={to} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={classes} href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} type={type} {...rest}>
      {children}
    </button>
  );
}
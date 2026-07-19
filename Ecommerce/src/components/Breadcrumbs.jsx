import React from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={`${item.label}-${item.to ?? index}`}>
            {item.to && !isLast ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
            {!isLast ? <span className="breadcrumbs__separator">/</span> : null}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
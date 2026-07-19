import React from 'react';
import Button from './Button';

export default function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <section className="state-card">
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel ? (
        <Button to={actionTo} variant="primary">
          {actionLabel}
        </Button>
      ) : null}
    </section>
  );
}
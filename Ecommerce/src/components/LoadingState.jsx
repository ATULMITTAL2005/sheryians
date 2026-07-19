import React from 'react';

export default function LoadingState({ label = 'Loading' }) {
  return (
    <section className="state-card state-card--loading">
      <div className="loader" aria-hidden="true" />
      <p>{label}</p>
    </section>
  );
}
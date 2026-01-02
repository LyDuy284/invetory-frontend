import React from 'react';

export const Card = ({ title, extra, children }) => (
  <div className="card">
    <div
      className="card-header"
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <span>{title}</span>
      {extra}
    </div>
    {children}
  </div>
);

import React from 'react';

const TextRevealLabel = ({ children }) => (
  <span className="nav-text-reveal" aria-hidden="true">
    <span className="nav-text-original">{children}</span>
    <span className="nav-text-letters">
      {String(children).split('').map((letter, index) => (
        <span key={`${letter}-${index}`}>{letter === ' ' ? '\u00a0' : letter}</span>
      ))}
    </span>
  </span>
);

export default TextRevealLabel;

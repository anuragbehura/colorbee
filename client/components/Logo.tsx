import React from 'react';

function Logo({ className }: { className?: string }) {
  return (
    <div className={`font-semibold text-2xl ${className || ''}`}>
      Color🐝
    </div>
  );
}

export default Logo;

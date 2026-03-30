import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const InputVintage: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '15px', width: '100%' }}>
      <label style={{ 
        fontSize: '12px', 
        color: 'var(--color3)', 
        fontWeight: 'bold', 
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        {label}
      </label>
      <input 
        {...props}
        style={{ 
          padding: '12px 15px', 
          borderRadius: '2px', 
          border: '1px solid #ddd', 
          backgroundColor: '#fff',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--color5)',
          transition: 'border-color 0.2s',
          ...props.style
        }} 
      />
    </div>
  );
};
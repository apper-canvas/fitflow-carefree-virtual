import React from 'react';

const Input = ({ type = 'text', value, onChange, className, placeholder, ...props }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary ${className || ''}`}
            placeholder={placeholder}
            {...props}
        />
    );
};

export default Input;
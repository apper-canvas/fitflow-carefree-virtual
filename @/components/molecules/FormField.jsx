import React from 'react';
import Input from '@/components/atoms/Input';

const FormField = ({ label, id, type, value, onChange, placeholder, className, name }) => {
    return (
        <div className={className}>
            <label htmlFor={id} className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                {label}
            </label>
            <Input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                name={name}
            />
        </div>
    );
};

export default FormField;
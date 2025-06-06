import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const MenuItem = ({ iconName, name, isActive, onClick }) => {
    return (
        <Button
            onClick={onClick}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                isActive
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
            }`}
        >
            <ApperIcon name={iconName} size={20} />
            <span className="font-medium">{name}</span>
        </Button>
    );
};

export default MenuItem;
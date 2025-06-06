import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ iconName, iconColor, value, label, className }) => {
    return (
        <div className={`bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 border border-surface-200 dark:border-surface-700 ${className || ''}`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`${iconColor} p-3 rounded-xl`}>
                    <ApperIcon name={iconName} size={24} />
                </div>
                <span className="text-2xl font-bold text-surface-900 dark:text-white">
                    {value}
                </span>
            </div>
            <p className="text-surface-600 dark:text-surface-300 font-medium">{label}</p>
        </div>
    );
};

export default StatCard;
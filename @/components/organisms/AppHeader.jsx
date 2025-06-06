import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const AppHeader = ({ darkMode, toggleDarkMode }) => {
    return (
        <header className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-primary to-primary-dark p-2 rounded-xl">
                            <ApperIcon name="Dumbbell" size={24} className="text-white" />
                        </div>
                        <h1 className="text-xl font-heading font-bold text-surface-900 dark:text-white">
                            FitFlow Pro
                        </h1>
                    </div>
                    <Button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                    >
                        <ApperIcon name={darkMode ? 'Sun' : 'Moon'} size={20} />
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
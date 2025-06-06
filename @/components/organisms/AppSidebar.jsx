import React from 'react';
import MenuItem from '@/components/molecules/MenuItem';

const AppSidebar = ({ menuItems, activeSection, setActiveSection }) => {
    return (
        <aside className="w-64 bg-white/50 dark:bg-surface-800/50 backdrop-blur-lg border-r border-surface-200 dark:border-surface-700 min-h-screen p-6">
            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.id}
                        iconName={item.icon}
                        name={item.name}
                        isActive={activeSection === item.id}
                        onClick={() => setActiveSection(item.id)}
                    />
                ))}
            </nav>
        </aside>
    );
};

export default AppSidebar;
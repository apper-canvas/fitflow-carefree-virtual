import React from 'react';
import { format, parseISO } from 'date-fns';

const ProgressEntryItem = ({ entry }) => {
    return (
        <div className="flex justify-between items-center">
            <span className="text-surface-600 dark:text-surface-300">
                {format(parseISO(entry.date), 'MMM dd')}
            </span>
            <span className="font-medium text-surface-900 dark:text-white">
                {entry.weight}kg
            </span>
        </div>
    );
};

export default ProgressEntryItem;
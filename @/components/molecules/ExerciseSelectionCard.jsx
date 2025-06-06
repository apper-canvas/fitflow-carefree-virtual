import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ExerciseSelectionCard = ({ exercise, onAdd }) => {
    return (
        <Button
            onClick={() => onAdd(exercise)}
            className="flex items-center justify-between p-3 bg-surface-100 dark:bg-surface-700 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors text-left"
        >
            <div>
                <p className="font-medium text-surface-900 dark:text-white">{exercise.name}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">{exercise.category}</p>
            </div>
            <ApperIcon name="Plus" size={16} className="text-primary" />
        </Button>
    );
};

export default ExerciseSelectionCard;
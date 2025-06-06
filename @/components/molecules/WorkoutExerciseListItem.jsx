import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const WorkoutExerciseListItem = ({ exercise, onRemove }) => {
    return (
        <div className="flex items-center justify-between p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
            <span className="text-surface-900 dark:text-white">{exercise.name}</span>
            <Button
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 p-1 rounded"
            >
                <ApperIcon name="Trash2" size={16} />
            </Button>
        </div>
    );
};

export default WorkoutExerciseListItem;
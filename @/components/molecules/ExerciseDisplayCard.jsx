import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const ExerciseDisplayCard = ({ exercise }) => {
    return (
        <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 border border-surface-200 dark:border-surface-700 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-surface-900 dark:text-white">
                    {exercise.name}
                </h3>
                <div className="bg-primary/20 p-2 rounded-lg">
                    <ApperIcon name="Activity" size={16} className="text-primary" />
                </div>
            </div>
            <div className="space-y-2">
                <span className="inline-block bg-secondary/20 text-secondary px-3 py-1 rounded-full text-xs font-medium">
                    {exercise.category}
                </span>
                <div className="flex flex-wrap gap-1">
                    {exercise.muscleGroups?.map((muscle, index) => (
                        <span
                            key={index}
                            className="text-xs bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 px-2 py-1 rounded"
                        >
                            {muscle}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExerciseDisplayCard;
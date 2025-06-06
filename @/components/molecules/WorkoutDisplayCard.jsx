import React from 'react';
import { format, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const WorkoutDisplayCard = ({ workout }) => {
    const statusClass = workout.completedDate ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600';
    const statusIcon = workout.completedDate ? 'CheckCircle' : 'Clock';

    return (
        <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 border border-surface-200 dark:border-surface-700 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-surface-900 dark:text-white">
                    {workout.name}
                </h3>
                <div className={`p-2 rounded-lg ${statusClass}`}>
                    <ApperIcon name={statusIcon} size={16} />
                </div>
            </div>
            <div className="space-y-2 text-sm text-surface-600 dark:text-surface-300">
                <p>{workout.exercises?.length || 0} exercises</p>
                {workout.duration && <p>{workout.duration} minutes</p>}
                {workout.scheduledDate && (
                    <p>Scheduled: {format(parseISO(workout.scheduledDate), 'MMM dd')}</p>
                )}
            </div>
        </div>
    );
};

export default WorkoutDisplayCard;
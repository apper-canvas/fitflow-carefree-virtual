import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import QuickStartCard from '@/components/molecules/QuickStartCard';

const QuickStartWorkouts = ({ quickStartWorkouts, onStartWorkout, onNewWorkoutClick }) => {
    return (
        <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-bold text-surface-900 dark:text-white">
                    Quick Start
                </h3>
                <Button
                    onClick={onNewWorkoutClick}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-secondary to-secondary-dark text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    New Workout
                </Button>
            </div>

            {quickStartWorkouts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickStartWorkouts.map((workout) => (
                        <QuickStartCard
                            key={workout.id}
                            workout={workout}
                            onStartWorkout={onStartWorkout}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-surface-500 dark:text-surface-400">
                    <ApperIcon name="Dumbbell" size={48} className="mx-auto mb-4" />
                    <p>No workouts available. Create your first workout to get started!</p>
                </div>
            )}
        </div>
    );
};

export default QuickStartWorkouts;
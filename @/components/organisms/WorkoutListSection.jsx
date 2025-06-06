import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import WorkoutDisplayCard from '@/components/molecules/WorkoutDisplayCard';

const WorkoutListSection = ({ workouts, onNewWorkoutClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-heading font-bold text-surface-900 dark:text-white">
                    My Workouts
                </h2>
                <Button className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                        onClick={onNewWorkoutClick}
                >
                    <ApperIcon name="Plus" size={20} className="inline mr-2" />
                    New Workout
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workouts.map((workout) => (
                    <WorkoutDisplayCard key={workout.id} workout={workout} />
                ))}
            </div>
        </motion.div>
    );
};

export default WorkoutListSection;
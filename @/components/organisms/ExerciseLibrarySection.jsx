import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import ExerciseDisplayCard from '@/components/molecules/ExerciseDisplayCard';

const ExerciseLibrarySection = ({ exercises, onAddExerciseClick }) => {
    const recentExercises = exercises.slice(0, 6);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-heading font-bold text-surface-900 dark:text-white">
                    Exercise Library
                </h2>
                <Button className="bg-gradient-to-r from-secondary to-secondary-dark text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                        onClick={onAddExerciseClick}
                >
                    <ApperIcon name="Plus" size={20} className="inline mr-2" />
                    Add Exercise
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentExercises.map((exercise) => (
                    <ExerciseDisplayCard key={exercise.id} exercise={exercise} />
                ))}
            </div>
        </motion.div>
    );
};

export default ExerciseLibrarySection;
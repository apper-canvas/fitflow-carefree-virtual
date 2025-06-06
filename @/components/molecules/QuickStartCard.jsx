import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const QuickStartCard = ({ workout, onStartWorkout }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-700 dark:to-surface-600 p-4 rounded-xl border border-surface-300 dark:border-surface-600"
        >
            <h4 className="font-heading font-semibold text-surface-900 dark:text-white mb-2">
                {workout.name}
            </h4>
            <p className="text-sm text-surface-600 dark:text-surface-300 mb-4">
                {workout.exercises?.length || 0} exercises
            </p>
            <Button
                onClick={() => onStartWorkout(workout)}
                className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all"
            >
                <ApperIcon name="Play" size={16} className="inline mr-2" />
                Start
            </Button>
        </motion.div>
    );
};

export default QuickStartCard;
import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressEntryItem from '@/components/molecules/ProgressEntryItem';

const ProgressOverviewSection = ({ progress }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-heading font-bold text-surface-900 dark:text-white">
                Progress Overview
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
                    <h3 className="font-heading font-semibold text-surface-900 dark:text-white mb-4">
                        Weekly Workout Progress
                    </h3>
                    <div className="h-48 flex items-center justify-center text-surface-500 dark:text-surface-400">
                        <div className="text-center">
                            <ApperIcon name="BarChart3" size={48} className="mx-auto mb-2" />
                            <p>Progress chart coming soon</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
                    <h3 className="font-heading font-semibold text-surface-900 dark:text-white mb-4">
                        Body Measurements
                    </h3>
                    <div className="space-y-4">
                        {progress.length > 0 ? (
                            progress.slice(0, 3).map((entry, index) => (
                                <ProgressEntryItem key={index} entry={entry} />
                            ))
                        ) : (
                            <div className="text-center text-surface-500 dark:text-surface-400">
                                <ApperIcon name="Scale" size={32} className="mx-auto mb-2" />
                                <p>No progress data yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProgressOverviewSection;
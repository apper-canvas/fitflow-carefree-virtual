import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import WorkoutExerciseListItem from '@/components/molecules/WorkoutExerciseListItem';
import ExerciseSelectionCard from '@/components/molecules/ExerciseSelectionCard';
import workoutService from '@/services/api/workoutService';

const WorkoutBuilder = ({ exercises, onWorkoutCreated, onClose }) => {
    const [newWorkout, setNewWorkout] = useState({
        name: '',
        exercises: [],
        scheduledDate: new Date().toISOString().split('T')[0]
    });

    const handleNewWorkoutChange = (e) => {
        const { name, value } = e.target;
        setNewWorkout(prev => ({ ...prev, [name]: value }));
    };

    const addExerciseToWorkout = (exercise) => {
        const workoutExercise = {
            ...exercise,
            sets: [{ reps: 0, weight: 0, duration: 0, completed: false }]
        };
        setNewWorkout(prev => ({
            ...prev,
            exercises: [...prev.exercises, workoutExercise]
        }));
        toast.success(`Added ${exercise.name} to workout`);
    };

    const removeExerciseFromWorkout = (index) => {
        setNewWorkout(prev => ({
            ...prev,
            exercises: prev.exercises.filter((_, i) => i !== index)
        }));
        toast.info('Exercise removed from workout');
    };

    const createWorkout = async () => {
        if (!newWorkout.name.trim()) {
            toast.error('Please enter a workout name');
            return;
        }

        try {
            const workout = await workoutService.create({
                ...newWorkout,
                id: Date.now().toString(),
                exercises: newWorkout.exercises,
                completedDate: null,
                duration: 0,
                notes: ''
});
            
            onWorkoutCreated(workout);
            setNewWorkout({
                name: '',
                exercises: [],
                scheduledDate: new Date().toISOString().split('T')[0]
            });
            toast.success('Workout created successfully!');
        } catch (error) {
            toast.error('Failed to create workout');
        }
    };

    const recentExercises = exercises.slice(0, 8);

return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-lg rounded-2xl p-6 border border-surface-200 dark:border-surface-700"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-heading font-bold text-surface-900 dark:text-white">
Create New Workout
                        </h3>
                        <Button
                            onClick={onClose}
                            className="p-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                        >
                            <ApperIcon name="X" size={20} />
                        </Button>
                    </div>

                    <div className="space-y-4 mb-6">
                        <FormField
                            label="Workout Name"
                            id="workoutName"
                            type="text"
                            name="name"
                            value={newWorkout.name}
                            onChange={handleNewWorkoutChange}
                            placeholder="Enter workout name..."
                        />
                        <FormField
                            label="Scheduled Date"
                            id="scheduledDate"
                            type="date"
                            name="scheduledDate"
                            value={newWorkout.scheduledDate}
                            onChange={handleNewWorkoutChange}
                        />
                    </div>

                    {newWorkout.exercises.length > 0 && (
                        <div className="mb-6">
                            <h4 className="font-medium text-surface-900 dark:text-white mb-3">Selected Exercises</h4>
                            <div className="space-y-2">
                                {newWorkout.exercises.map((exercise, index) => (
                                    <WorkoutExerciseListItem
                                        key={index}
                                        exercise={exercise}
                                        onRemove={() => removeExerciseFromWorkout(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <h4 className="font-medium text-surface-900 dark:text-white mb-3">Add Exercises</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                            {recentExercises.map((exercise) => (
                                <ExerciseSelectionCard
                                    key={exercise.id}
                                    exercise={exercise}
                                    onAdd={addExerciseToWorkout}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <Button
                            onClick={createWorkout}
                            className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                        >
                            Create Workout
</Button>
                        <Button
                            onClick={onClose}
                            className="px-6 py-3 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                        >
                            Cancel
                        </Button>
</div>
                </motion.div>
    );
};

export default WorkoutBuilder;
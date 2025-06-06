import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import StatCard from '@/components/molecules/StatCard';
import ActiveWorkoutTimer from '@/components/organisms/ActiveWorkoutTimer';
import WorkoutBuilder from '@/components/organisms/WorkoutBuilder';
import QuickStartWorkouts from '@/components/organisms/QuickStartWorkouts';

const DashboardSection = ({
    todaysWorkout,
    totalWorkoutsThisWeek,
    totalMinutesThisWeek,
    currentStreak,
    workouts,
    setWorkouts,
    exercises
}) => {
    const [activeWorkout, setActiveWorkout] = useState(null);
    const [isWorkoutBuilder, setIsWorkoutBuilder] = useState(false);

    const handleStartWorkout = (workout) => {
        setActiveWorkout(workout);
        setIsWorkoutBuilder(false);
    };

    const handleNewWorkoutClick = () => {
        setIsWorkoutBuilder(true);
        setActiveWorkout(null);
    };

    const quickStartWorkouts = workouts.filter(w => !w.completedDate).slice(0, 3);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary via-primary-dark to-secondary p-6 rounded-2xl text-white">
                <h2 className="text-2xl font-heading font-bold mb-2">Good Morning, Champion!</h2>
                <p className="text-primary-light mb-4">Ready to crush your fitness goals today?</p>
                {todaysWorkout && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                        <h3 className="font-semibold mb-2">Today's Workout</h3>
                        <p className="text-sm">{todaysWorkout.name}</p>
                        <p className="text-xs text-primary-light mt-1">
                            {todaysWorkout.exercises?.length || 0} exercises
                        </p>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    iconName="Calendar"
                    iconColor="bg-primary/20"
                    value={totalWorkoutsThisWeek}
                    label="Workouts This Week"
                />
                <StatCard
                    iconName="Clock"
                    iconColor="bg-secondary/20"
                    value={totalMinutesThisWeek}
                    label="Minutes Trained"
                />
                <StatCard
                    iconName="Flame"
                    iconColor="bg-accent/20"
                    value={currentStreak}
                    label="Day Streak"
                />
            </div>

            {/* Workout Features (Timer, Builder, Quick Start) */}
            <ActiveWorkoutTimer
                activeWorkout={activeWorkout}
                setActiveWorkout={setActiveWorkout}
                setWorkouts={setWorkouts}
            />

            {!activeWorkout && (
                <>
                    <WorkoutBuilder
                        exercises={exercises}
                        setWorkouts={setWorkouts}
                        setIsWorkoutBuilder={setIsWorkoutBuilder}
                        isWorkoutBuilder={isWorkoutBuilder}
                    />

                    {!isWorkoutBuilder && (
                        <QuickStartWorkouts
                            quickStartWorkouts={quickStartWorkouts}
                            onStartWorkout={handleStartWorkout}
                            onNewWorkoutClick={handleNewWorkoutClick}
                        />
                    )}
                </>
            )}
        </motion.div>
    );
};

export default DashboardSection;
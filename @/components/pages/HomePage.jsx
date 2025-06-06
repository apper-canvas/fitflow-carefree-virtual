import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import workoutService from '@/services/api/workoutService';
import exerciseService from '@/services/api/exerciseService';
import progressService from '@/services/api/progressService';
import { format, startOfWeek, endOfWeek, isToday, parseISO } from 'date-fns';

import AppHeader from '@/components/organisms/AppHeader';
import AppSidebar from '@/components/organisms/AppSidebar';
import DashboardSection from '@/components/organisms/DashboardSection';
import WorkoutListSection from '@/components/organisms/WorkoutListSection';
import ExerciseLibrarySection from '@/components/organisms/ExerciseLibrarySection';
import ProgressOverviewSection from '@/components/organisms/ProgressOverviewSection';

const HomePage = ({ darkMode, toggleDarkMode }) => {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [workoutData, exerciseData, progressData] = await Promise.all([
          workoutService.getAll(),
          exerciseService.getAll(),
          progressService.getAll()
        ]);
        setWorkouts(workoutData || []);
        setExercises(exerciseData || []);
        setProgress(progressData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  
  const weeklyWorkouts = workouts.filter(workout => {
    if (!workout.completedDate) return false;
    const workoutDate = parseISO(workout.completedDate);
    return workoutDate >= weekStart && workoutDate <= weekEnd;
  });

  const todaysWorkout = workouts.find(workout => 
    workout.scheduledDate && isToday(parseISO(workout.scheduledDate))
  );

  const totalWorkoutsThisWeek = weeklyWorkouts.length;
  const totalMinutesThisWeek = weeklyWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
  const currentStreak = progress.length > 0 ? 7 : 0;

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: 'BarChart3' },
    { id: 'workouts', name: 'Workouts', icon: 'Dumbbell' },
    { id: 'exercises', name: 'Exercises', icon: 'Activity' },
    { id: 'progress', name: 'Progress', icon: 'TrendingUp' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <ApperIcon name="AlertCircle" size={48} className="mx-auto mb-4" />
          <p>Error loading data: {error}</p>
        </div>
      </div>
    );
  }

  const handleNewWorkoutClick = () => {
      setActiveSection('dashboard');
  };

  const handleAddExerciseClick = () => {
    console.log("Add Exercise clicked!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <AppHeader darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div className="flex">
        <AppSidebar
          menuItems={menuItems}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <main className="flex-1 p-6">
          {activeSection === 'dashboard' && (
            <DashboardSection
              todaysWorkout={todaysWorkout}
              totalWorkoutsThisWeek={totalWorkoutsThisWeek}
              totalMinutesThisWeek={totalMinutesThisWeek}
              currentStreak={currentStreak}
              workouts={workouts}
              setWorkouts={setWorkouts}
              exercises={exercises}
            />
          )}

          {activeSection === 'workouts' && (
            <WorkoutListSection 
              workouts={workouts} 
              onNewWorkoutClick={handleNewWorkoutClick}
            />
          )}

          {activeSection === 'exercises' && (
            <ExerciseLibrarySection 
              exercises={exercises} 
              onAddExerciseClick={handleAddExerciseClick}
            />
          )}

          {activeSection === 'progress' && (
            <ProgressOverviewSection progress={progress} />
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
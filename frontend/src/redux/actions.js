// Re-export actions from slices for easier imports
import { 
  setSelectedDate, 
  toggleEventExpanded,
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent
} from './slices/eventsSlice';

import {
  selectGoal,
  clearSelectedGoal,
  fetchGoals,
  createGoal,
  updateGoal,
  deleteGoal
} from './slices/goalsSlice';

import {
  filterTasksByGoal,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask
} from './slices/tasksSlice';

export {
  // Events actions
  setSelectedDate,
  toggleEventExpanded,
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  
  // Goals actions
  selectGoal,
  clearSelectedGoal,
  fetchGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  
  // Tasks actions
  filterTasksByGoal,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask
};
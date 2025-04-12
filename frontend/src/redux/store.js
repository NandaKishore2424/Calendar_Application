import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './slices/eventsSlice';
import goalsReducer from './slices/goalsSlice';
import tasksReducer from './slices/tasksSlice';

const store = configureStore({
  reducer: {
    events: eventsReducer,
    goals: goalsReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
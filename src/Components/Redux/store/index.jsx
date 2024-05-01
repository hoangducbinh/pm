import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/authReducer';
import notificationReducer from '../reducers/notificationReducer';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    // Add more reducers if needed
  },
});



const initialState = {
    newMessageNotification: null,
  };
  
  const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_NEW_MESSAGE_NOTIFICATION':
        return {
          ...state,
          newMessageNotification: action.payload,
        };
      default:
        return state;
    }
  };
  
  export const setNewMessageNotification = (notification) => ({
    type: 'SET_NEW_MESSAGE_NOTIFICATION',
    payload: notification,
  });
  
  export default notificationReducer;
  
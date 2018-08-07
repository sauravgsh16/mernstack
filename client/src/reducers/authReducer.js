import isEmpty from '../validators/is-Empty';
import { SET_CURRENT_USER } from '../actions/types';

const initialState = {
  isAuthenticated: false,
  user: {}
};

const authReducer = (state=initialState, action) => {
  const nextState = Object.assign({}, state);
  switch (action.type) {
    case SET_CURRENT_USER:
      nextState.isAuthenticated = !isEmpty(action.payload);
      nextState.user = action.payload
      return nextState;
    default:
      return state;
  }
}

export default authReducer;
import { TEST_DISPATCH } from '../actions/types';

const initialState = {
  isAuthenticated: false,
  user: {}
};

const authReducer = (state=initialState, action) => {

  const nextState = Object.assign({}, state);

  switch (action.type) {
    case TEST_DISPATCH:
      nextState.user = action.payload;
      return nextState;
    default:
      return state;
  }
}

export default authReducer;
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthHeader from '../utils/setAuthHeader';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

// REGISTER USER
export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem('jwtToken', token);
      // Set token for Auth header
      setAuthHeader(token)
      // Set Current user
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove the token from localstorage
  localStorage.removeItem('jwtToken')
  // Remove the auth header for future requests
  setAuthHeader(false);
  // set current user to empty {} which will also set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

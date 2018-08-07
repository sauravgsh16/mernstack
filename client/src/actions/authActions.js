import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthHeader from '../utils/setAuthHeader';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

// REGISTER USER
export const registerUser = (userData, history) => dispatch => {
  axios.post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// LOGIN USER - get token
export const loginUser = (userData) => dispatch => {
  axios.post('/api/users/login', userData)
    .then(res => {
      // Save token in localstorage
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);
      // Set token for Auth header
      setAuthHeader(token)
      // Set Current user
      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// LOG USER OUT
export const logoutUser = () => dispatch => {
  // Remove the token from localstorage
  localStorage.removeItem('jwtToken')
  // Remove the auth header for future requests
  setAuthHeader(false);
  // set current user to empty {} which will also set isAuthenticated to false
  dispatch(setCurrentUser({}));
}
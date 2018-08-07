import axios from 'axios';

const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorized'] = token;
  } else {
    delete axios.defaults.headers.common['Authorized']
  }
}

export default setAuthHeader;
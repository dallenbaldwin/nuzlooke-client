import axios from 'axios';
// import * as Auth from '../services/auth';

export default () => {
   return axios.create({
      baseURL: `${window.location.protocol}//${window.location.hostname}:3000/api`,
      // headers: {
      //    Authorization: auth.getToken()
      // }
   });
};

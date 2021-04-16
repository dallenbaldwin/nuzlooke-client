import axios from 'axios';
// import * as Auth from '../services/auth';

let port = '3000';
let baseUrl = `http://localhost:${port}/api`;

if (process.env.NODE_ENV === 'production') {
   baseUrl = `https://db-nuzlooke.uvucs.org/api`;
}

export default () => {
   return axios.create({
      baseURL: baseUrl,
      // headers: {
      //    Authorization: auth.getToken()
      // }
   });
};

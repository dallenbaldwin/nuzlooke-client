import axios from 'axios';
import store from '../store/store';

let baseUrl = `http://localhost:3000/api`;

if (process.env.NODE_ENV === 'production') {
   baseUrl = `https://db-nuzlooke.uvucs.org/api`;
}

export default () => {
   return axios.create({
      baseURL: baseUrl,
      headers: {
         'x-auth-token': store.state.token,
      },
   });
};

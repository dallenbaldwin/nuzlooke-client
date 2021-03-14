import store from '../store/store.js';
import axios from 'axios';
// import * as Auth from '../services/auth.js';

export default function http() {
   return axios.create({
      baseURL: store.state.apiURL,
      // headers: {
      //    Authorization: auth.getToken()
      // }
   });
}

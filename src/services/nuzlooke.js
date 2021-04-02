import store from '../store/store';
import axios from 'axios';
// import * as Auth from '../services/auth';

export default function nuzlooke() {
   return axios.create({
      baseURL: store.state.apiURL,
      // headers: {
      //    Authorization: auth.getToken()
      // }
   });
}

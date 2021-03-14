import { isMobile } from 'mobile-device-detect';
import { getUserById } from '../services/user.js';
import store from '../store/store.js';
import router from '../router/router.js';

export default {
   methods: {
      navigate(endpoint) {
         console.log(`navigating to ${endpoint}`);
         router.push(endpoint);
      },
      getRouteInfo() {
         return {
            name: router.currentRoute.name,
            path: router.currentRoute.path,
            params: router.currentRoute.params,
         };
      },
      logout() {
         store.commit('exitGame');
         store.commit('logout');
         this.navigate({ name: 'home' });
      },
      login() {
         // FIXME: this will need to be reworked when we get to authorization
         getUserById('9d0f3fca-f516-479d-8d15-7260c33a55f8')
            .then(res => {
               let user = res.data.response.data;
               store.commit('login', {
                  id: user.id,
                  username: user.username || user.email,
                  games: user.games,
               });
               this.navigate({ name: 'games' });
            })
            .catch(err => console.log);
      },
      exitGame() {
         store.commit('exitGame');
         this.navigate({ name: 'games' });
      },
      mobile() {
         return isMobile;
      },
      arrayify(...values) {
         const a = [];
         values.forEach(value => a.push(value));
         return a.flatMap(i => i); // force it to accept an array of values or a list of values
      },
      deClassify(classObject) {
         return JSON.parse(JSON.stringify(classObject));
      },
      isUndefined(value) {
         return value === undefined || value === null;
      },
   },
};

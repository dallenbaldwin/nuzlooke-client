import { isMobile } from 'mobile-device-detect';
import * as userServices from '../services/user.js';
import store from '../store/store.js';
import router from '../router/router.js';
import Versions from '../constants/Versions.js';
import PartyState from '../constants/PartyState.js';
import Icons from '../constants/Icons.js';
import Pages from '../constants/Pages.js';
import TabMap from '../constants/TabMap.js';

export default {
   data() {
      return {
         Versions: Versions,
         PartyState: PartyState,
         Icons: Icons,
         Pages: Pages,
         TabMap: TabMap,
      };
   },
   methods: {
      navigate(endpoint) {
         router.replace(endpoint);
      },
      logout() {
         store.commit('exitGame');
         store.commit('logout');
         this.navigate({ name: Pages.HOME });
      },
      login() {
         // FIXME: this will need to be reworked when we get to authorization
         userServices
            .getUserById('9d0f3fca-f516-479d-8d15-7260c33a55f8')
            .then(res => {
               let user = this.toAPIResponse(res);
               console.log(user);
               store.commit('login', {
                  id: user.id,
                  username: user.username || user.email,
                  games: user.games,
               });
               this.navigate({ name: Pages.GAMES });
            })
            .catch(err => console.log);
      },
      exitGame() {
         store.commit('exitGame');
         this.navigate({ name: Pages.GAMES });
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
      toAPIResponse(object) {
         if (object.data.data) return object.data.data;
         if (object.data.error) return object.data.error;
      },
   },
};

import { isMobile } from 'mobile-device-detect';
import * as userServices from '../services/user.js';
import store from '../store/store.js';
import router from '../router/router.js';

export default {
   data() {
      return {
         VERSIONS: {
            LETSGOPIKACHU: {
               label: `Let's Go Pikachu`,
               key: 'letsgopikachu',
               generation: '7',
            },
            LETSGOEEVEE: { label: `Let's Go Eevee`, key: 'letsgoeevee', generation: '7' },
            RUBY: { label: `Ruby`, key: 'ruby', generation: '3' },
            SAPPHIRE: { label: `Sapphire`, key: 'sapphire', generation: '3' },
            EMERALD: { label: `Emerald`, key: 'emerald', generation: '3' },
         },
         PARTYSTATE: {
            PARTY: { id: 0, label: 'Party' },
            PC: { id: 1, label: 'PC' },
            GRAVEYARD: { id: 2, label: 'Graveyard' },
         },
      };
   },
   methods: {
      navigate(endpoint) {
         console.log(`navigating to ${endpoint}`);
         router.push(endpoint);
      },
      logout() {
         store.commit('exitGame');
         store.commit('logout');
         this.navigate({ name: 'home' });
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
      buildGame(label, version) {
         return {
            label: label,
            version: this.CONSTANTS.VERSIONS.find(x => x.label === version).key,
         };
      },
      toAPIResponse(object) {
         if (object.data.data) return object.data.data;
         if (object.data.error) return object.data.error;
      },
   },
};

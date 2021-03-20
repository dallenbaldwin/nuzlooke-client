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
         MDI_ICONS: {
            BRANDS: {
               GOOGLE: 'mdi-google',
               APPLE: 'mdi-apple',
               FACEBOOK: 'mdi-facebook',
            },
            CONTROLS: {
               SETTINGS: 'mdi-cog',
               EDIT: 'mdi-pencil',
               EXCLAIM: 'mdi-exclamation-thick',
               FILTER: 'mdi-filter',
               MENU: 'mdi-menu',
               CLOSE: 'mdi-close',
               DELETE: 'mdi-minus',
               CONFIRM: 'mdi-check',
               TOMBSTONE: 'mdi-grave-stone',
               STORAGE: 'mdi-archive',
               PLUS: 'mdi-plus',
            },
            PAGES: {
               POKEMON: 'mdi-pokeball',
               GYM: 'mdi-pokemon-go',
               ROUTES: 'mdi-routes',
               RULES: 'mdi-gavel',
               LOGOUT: 'mdi-logout',
               LOGIN: 'mdi-login',
               REGISTER: 'mdi-',
               HOME: 'mdi-home',
            },
            CONSOLES: {
               GAMEBOY: 'mdi-nintendo-game-boy',
               SWITCH: 'mdi-nintendo-switch',
               DESKTOP: 'mdi-monitor',
               DEFAULT: 'mdi-gamepad-square',
            },
         },
         PAGES: {
            HOME: 'home',
            LOGIN: 'login',
            REGISTER: 'register',
            GAMES: 'games',
            GAME: 'game',
            POKEMON: 'pokemon',
            RULES: 'rules',
            ROUTES: 'routes',
            GYMS: 'gyms',
         },
      };
   },
   methods: {
      navigate(endpoint) {
         router.replace(endpoint);
      },
      logout() {
         store.commit('exitGame');
         store.commit('logout');
         this.navigate({ name: this.PAGES.HOME });
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
               this.navigate({ name: this.PAGES.GAMES });
            })
            .catch(err => console.log);
      },
      exitGame() {
         store.commit('exitGame');
         this.navigate({ name: this.PAGES.GAMES });
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

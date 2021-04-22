<template>
   <div v-if="mobile()">
      <v-app-bar elevation="1" bottom app>
         <v-app-bar-nav-icon
            v-show="currentPage !== Pages.GAMES"
            @click.stop="drawer = !drawer"
         ></v-app-bar-nav-icon>
         <span class="text-h6"> {{ toTitleCase(currentPage) }} </span>
         <template v-slot:extension v-if="isLoggedIn">
            <c-btn
               v-show="btnSupport.ADD.includes(currentPage) && !gameFinished"
               class="ma-3"
               :icon="Icons.CONTROLS.PLUS"
               :isFab="true"
               @click="$emit('add')"
               color="success"
            ></c-btn>
            <c-btn
               v-show="btnSupport.FILTER.includes(currentPage)"
               class="ma-3"
               :icon="Icons.CONTROLS.FILTER"
               :isFab="true"
               @click="$emit('filter')"
               color="primary"
            ></c-btn>
            <c-btn
               v-show="btnSupport.APPSETTINGS.includes(currentPage)"
               class="ma-3"
               :icon="Icons.CONTROLS.SETTINGS"
               :color="Colors.grey.darken2"
               :isFab="true"
               @click="settings = !settings"
            ></c-btn>
            <c-btn
               v-show="btnSupport.LOGOUT.includes(currentPage)"
               class="ma-3"
               :icon="Icons.CONTROLS.LOGOUT"
               :isFab="true"
               @click="logout"
            ></c-btn>
         </template>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" app bottom temporary>
         <div class="ma-3 text-h6" v-if="game">{{ game.label }}</div>
         <div class="ma-3 text-text-title" v-if="username">{{ username }}</div>
         <v-divider></v-divider>
         <v-list>
            <v-list-item
               v-for="link of pageLinks"
               :key="link.label"
               link
               @click="clickLink(link)"
            >
               <v-list-item-icon>
                  <c-btn :isFab="true" :icon="link.icon"></c-btn>
               </v-list-item-icon>
               <v-list-item-content class="text-right">
                  {{ link.label }}
               </v-list-item-content>
            </v-list-item>
         </v-list>
      </v-navigation-drawer>
      <v-dialog v-model="settings" width="500">
         <c-app-settings v-on:close-dialog="settings = !settings"></c-app-settings>
      </v-dialog>
   </div>
</template>

<script>
import TextField from './form-controls/TextField.vue';
import ProgressSpinner from './ProgressSpinner.vue';
import AppSettings from './dialogs/AppSettings.vue';
import Combobox from './form-controls/Combobox.vue';
import Button from './Button.vue';
import Icons from '../constants/Icons';
import * as util from '../util/util';
import GameVersions from '../constants/GameVersions';
import Pages from '../constants/Pages';
import * as authController from '../controllers/auth';
import * as gameController from '../controllers/game';

export default {
   // TODO refactor the jank
   name: 'NavDrawer',
   components: {
      'c-text-field': TextField,
      'c-progress-spinner': ProgressSpinner,
      'c-combobox': Combobox,
      'c-btn': Button,
      'c-app-settings': AppSettings,
   },
   data() {
      return {
         settings: false,
         drawer: false,
         btnSupport: {
            FILTER: [Pages.GAMES, Pages.POKEMON, Pages.RULES, Pages.ROUTES, Pages.GYMS],
            ADD: [Pages.GAMES, Pages.RULES],
            APPSETTINGS: [
               Pages.GAMES,
               Pages.POKEMON,
               Pages.RULES,
               Pages.ROUTES,
               Pages.GYMS,
            ],
            LOGOUT: [Pages.GAMES, Pages.POKEMON, Pages.RULES, Pages.ROUTES, Pages.GYMS],
         },
         // this is janky
         inGameRoutes: ['Pokemon', 'Routes', 'Gyms', 'Rules'],
         inGameLinks: ['Pokemon', 'Routes', 'Gyms', 'Rules', 'Games', 'Sign Out'],
         outGameLinks: ['Sign Out', 'Create Game'],
         loggedOutLinks: ['Home', 'Sign In', 'Register'],
         links: [
            {
               label: 'Home',
               icon: Icons.PAGES.HOME,
               route: 'home',
            },
            {
               label: 'Sign In',
               icon: Icons.PAGES.LOGIN,
               route: 'login',
            },
            {
               label: 'Register',
               icon: Icons.PAGES.REGISTER,
               route: 'register',
            },
            {
               label: 'Pokemon',
               icon: Icons.PAGES.POKEMON,
               route: 'pokemon',
            },
            {
               label: 'Routes',
               icon: Icons.PAGES.ROUTES,
               route: 'routes',
            },
            {
               label: 'Gyms',
               icon: Icons.PAGES.GYMS,
               route: 'gyms',
            },
            {
               label: 'Rules',
               icon: Icons.PAGES.RULES,
               route: 'rules',
            },
            {
               label: 'Games',
               icon: Icons.PAGES.GAMES,
               route: 'games',
               action: 'exit-game',
            },
         ],
      };
   },
   methods: {
      // this is janky
      clickLink(link) {
         if (link.action) {
            this.reactToAction(link.action);
         } else if (this.inGameRoutes.includes(link.route)) {
            util.navigate({ name: link.route, params: { gameId: this.game.id } });
         } else {
            util.navigate({ name: link.route });
         }
      },
      // this is janky
      reactToAction(action) {
         if (action === 'logout') {
            this.logout();
         } else if (action === 'exit-game') {
            gameController.exitGame();
         }
      },
      logout() {
         authController.logout();
      },
   },
   computed: {
      currentPage() {
         return this.$route.name;
      },
      gameVersions() {
         return Object.values(GameVersions).map(v => v.label);
      },
      pageLinks() {
         return this.links
            .filter(link => link.route !== this.$route.name)
            .filter(link => {
               if (this.inGame) return this.inGameLinks.includes(link.label);
               else if (this.outGame) return this.outGameLinks.includes(link.label);
               else return this.loggedOutLinks.includes(link.label);
            });
      },
      inGame() {
         return this.$store.state.game !== null && this.$store.state.isLoggedIn;
      },
      outGame() {
         return this.$store.state.game === null && this.$store.state.isLoggedIn;
      },
      game() {
         return this.$store.state.game;
      },
      gameFinished() {
         return this.game ? this.game.is_finished : false;
      },
      isLoggedIn() {
         return this.$store.state.isLoggedIn;
      },
      username() {
         return this.$store.state.username;
      },
      userId() {
         return this.$store.state.userId;
      },
      games() {
         return this.$store.state.userGames;
      },
   },
};
</script>

<style></style>

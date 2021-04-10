<template>
   <div>
      <v-app-bar elevation="1" bottom app v-if="mobile()">
         <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
         <v-app-bar-title class="text-h6">{{ toTitleCase(currentPage) }}</v-app-bar-title>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" app bottom temporary>
         <v-list-item v-if="isLoggedIn">
            <v-list-item-icon>
               <c-btn
                  :icon="Icons.CONTROLS.SETTINGS"
                  :isFab="true"
                  @click="editUsername"
               ></c-btn>
            </v-list-item-icon>
         </v-list-item>
         <v-divider></v-divider>
         <v-list>
            <v-list-item
               v-for="link of pageLinks"
               :key="link.label"
               link
               @click="clickLink(link)"
            >
               <v-list-item-icon>
                  <v-btn fab small dark :color="link.color"
                     ><v-icon>{{ link.icon }}</v-icon></v-btn
                  >
               </v-list-item-icon>
               <v-list-item-content class="text-right">
                  {{ link.label }}
               </v-list-item-content>
            </v-list-item>
         </v-list>
      </v-navigation-drawer>
   </div>
</template>

<script>
import DialogCard from './DialogCard.vue';
import TextField from './form-controls/TextField.vue';
import ProgressSpinner from './ProgressSpinner.vue';
import Combobox from './form-controls/Combobox.vue';
import Button from './Button.vue';
import Icons from '../constants/Icons';
import * as gameController from '../controllers/game';
import * as util from '../util/util';
import GameVersions from '../constants/GameVersions';

export default {
   // TODO gonna have to rework most of this
   // TODO disable functions when game is finished
   name: 'NavDrawer',
   components: {
      'c-dialog-card': DialogCard,
      'c-text-field': TextField,
      'c-progress-spinner': ProgressSpinner,
      'c-combobox': Combobox,
      'c-btn': Button,
   },
   data() {
      return {
         drawer: false,
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
               label: 'Sign Out',
               icon: Icons.CONTROLS.LOGOUT,
               route: 'home',
               action: 'logout',
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
         newGame: {
            creatingGame: false,
            newGame: {
               label: null,
               version: null,
            },
            createGameDialog: false,
            createGameCard: {
               title: 'Start a new Game',
               text:
                  'Are you ready to set out on a new adventure? Give this playthrough a memorable name and pick a game version.',
               primaryBtn: {
                  text: 'Start',
                  action: 'start-game',
               },
            },
         },
      };
   },
   methods: {
      clickLink(link) {
         if (link.action) {
            this.reactToAction(link.action);
         } else if (this.inGameRoutes.includes(link.route)) {
            util.navigate({ name: link.route, params: { gameId: this.game.id } });
         } else {
            util.navigate({ name: link.route });
         }
      },
      reactToAction(action) {
         if (action === 'logout') {
            util.logout();
         } else if (action === 'exit-game') {
            util.exitGame();
         }
      },
      editUsername() {
         alert('i want to edit the username!');
      },
      closeDialog() {
         this.newGame.creatingGame = false;
         this.newGame.createGameDialog = false;
         this.newGame.newGame.label = null;
         this.newGame.newGame.version = null;
      },
      async startGame() {
         this.creatingGame = true;
         await gameController.createNewGame(
            this.newGame.newGame.label,
            this.newGame.newGame.version,
            undefined
         );
         this.closeDialog();
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

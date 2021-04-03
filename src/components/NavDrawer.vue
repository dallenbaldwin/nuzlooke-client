<template>
   <v-container>
      <v-app-bar elevation="1" bottom app v-if="mobile()">
         <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
         <v-spacer></v-spacer>
         <v-btn
            fab
            small
            color="green"
            dark
            v-if="outGame"
            @click="newGame.createGameDialog = !newGame.createGameDialog"
         >
            <v-icon>mdi-plus</v-icon>
         </v-btn>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" absolute bottom temporary>
         <v-list-item v-if="isLoggedIn">
            <v-list-item-icon>
               <v-btn fab x-small color="orange" dark @click="editUsername">
                  <v-icon>mdi-pencil</v-icon>
               </v-btn>
            </v-list-item-icon>
            <v-list-item-content>
               {{ username }}
            </v-list-item-content>
         </v-list-item>
         <v-divider></v-divider>
         <v-list nav>
            <v-list-item
               v-for="link of pageLinks"
               :key="link.label"
               link
               @click="clickLink(link)"
            >
               <v-list-item-icon>
                  <v-icon :color="link.color">{{ link.icon }}</v-icon>
               </v-list-item-icon>
               <v-list-item-content class="text-right">
                  {{ link.label }}
               </v-list-item-content>
            </v-list-item>
         </v-list>
      </v-navigation-drawer>
      <v-dialog v-model="newGame.createGameDialog" width="500">
         <c-dialog-card
            :props="newGame.createGameCard"
            v-on:start-game="startGame"
            v-on:close-dialog="closeDialog"
         >
            <div v-if="newGame.creatingGame" class="text-center mt-3">
               <c-progress-spinner></c-progress-spinner>
            </div>
            <div class="mt-3" v-if="!newGame.creatingGame">
               <c-text-field v-model="newGame.newGame.label" label="Name"></c-text-field>
               <c-combobox
                  label="Version"
                  v-model="newGame.newGame.version"
                  :items="Object.values(Versions).map(v => v.label)"
               >
               </c-combobox></div
         ></c-dialog-card>
      </v-dialog>
   </v-container>
</template>

<script>
import DialogCard from './DialogCard.vue';
import TextField from './form-controls/TextField.vue';
import ProgressSpinner from './ProgressSpinner.vue';
import Combobox from './form-controls/Combobox.vue';
import Icons from '../constants/Icons';
import * as gameController from '../controllers/game';
import * as util from '../util/util';

export default {
   // TODO gonna have to rework most of this
   name: 'NavDrawer',
   components: {
      'c-dialog-card': DialogCard,
      'c-text-field': TextField,
      'c-progress-spinner': ProgressSpinner,
      'c-combobox': Combobox,
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

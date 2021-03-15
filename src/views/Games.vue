<template>
   <v-container>
      <v-row>
         <v-col>
            <c-speed-dial
               :actions="actions"
               v-if="!mobile()"
               v-on:logout="logout"
               v-on:filter-games="filterGames"
               v-on:create-game="createGame"
            ></c-speed-dial
         ></v-col>
      </v-row>
      <v-row
         ><v-col>
            <div class="mt-6 text-h2">
               Games
            </div>
            <div class="mt-6 text-h4">Welcome back {{ username }}</div>
         </v-col>
      </v-row>
      <v-row>
         <v-col>
            <v-expansion-panels popout>
               <v-expansion-panel v-for="game of games" :key="game.id">
                  <v-expansion-panel-header
                     expand-icon="mdi-controller-classic"
                     disable-icon-rotate
                     class="text-h6"
                     >{{ game.name }}
                     <div class="ml-3">
                        <v-btn
                           fab
                           x-small
                           color="warning"
                           @click.stop="editGameName(game.id)"
                        >
                           <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                     </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                     <v-container>
                        <v-row>
                           <v-col
                              ><div>
                                 {{ game.version.name }}
                              </div>
                              <v-skeleton-loader type="image@1"></v-skeleton-loader>
                           </v-col>
                           <v-col
                              ><div class="text">Party</div>
                              <v-skeleton-loader type="avatar@6"></v-skeleton-loader>
                           </v-col>
                           <v-col
                              ><div class="text">Gym Badges</div>
                              <v-skeleton-loader type="avatar@8"></v-skeleton-loader>
                           </v-col>
                           <v-col>
                              <div class="text">Game Links</div>
                              <div v-for="btn of gameBtns" :key="btn.label">
                                 <div class="mt-2">
                                    <v-btn
                                       fab
                                       dark
                                       small
                                       @click="toGame(btn.route, game.id)"
                                       ><v-icon>{{ btn.icon }}</v-icon></v-btn
                                    >
                                    <span class="ml-3">{{ btn.label }}</span>
                                 </div>
                              </div>
                           </v-col>
                        </v-row>
                     </v-container>
                  </v-expansion-panel-content>
               </v-expansion-panel>
            </v-expansion-panels>
         </v-col>
      </v-row>
      <v-dialog v-model="createGameDialog" width="500">
         <c-dialog-card
            :props="createGameCard"
            v-on:close-dialog="closeDialog"
            v-on:start-game="startGame"
         >
            <div class="mt-3">
               <v-text-field
                  outlined
                  v-model="newGame.label"
                  :rules="[textFieldRules.required]"
                  label="Name"
               ></v-text-field>
               <v-combobox
                  label="Version"
                  outlined
                  v-model="newGame.version"
                  :items="CONSTANTS.VERSIONS.map(v => v.label)"
               >
               </v-combobox>
            </div>
         </c-dialog-card>
      </v-dialog>
   </v-container>
</template>

<script>
import NavDrawer from '../components/NavDrawer.vue';
import SpeedDial from '../components/SpeedDial.vue';
import DialogCard from '../components/DialogCard.vue';
import * as game from '../services/game.js';

export default {
   name: 'Games',
   components: {
      'c-nav-drawer': NavDrawer,
      'c-speed-dial': SpeedDial,
      'c-dialog-card': DialogCard,
   },
   data() {
      return {
         newGame: {
            label: null,
            version: null,
         },
         textFieldRules: { required: value => !!value || 'Required' },
         createGameDialog: false,
         createGameCard: {
            title: 'Start a new Game',
            text:
               'Are you ready to set out on a new adventure? Give this playthrough a memorable name and pick a game version.',
            confirmBtn: {
               action: 'start-game',
            },
            // deleteBtn: {
            //    action: 'delete-game',
            // },
         },
         actions: [
            {
               label: 'Filter',
               icon: 'mdi-filter',
               action: 'filter-games',
               color: 'primary',
            },
            {
               label: 'Create Game',
               icon: 'mdi-plus',
               action: 'create-game',
               color: 'green',
            },
         ],
         gameBtns: [
            { label: 'Pokemon', route: 'pokemon', icon: 'mdi-pokeball' },
            { label: 'Routes', route: 'routes', icon: 'mdi-routes' },
            { label: 'Gyms', route: 'gyms', icon: 'mdi-domain' },
            { label: 'Rules', route: 'rules', icon: 'mdi-book' },
         ],
      };
   },
   methods: {
      filterGames() {
         alert('i want to filter my games!');
      },
      createGame() {
         this.createGameDialog = true;
      },
      startGame() {
         const builtGame = this.buildGame(this.newGame.label, this.newGame.version);
         game
            .createGame(builtGame)
            .then(res => this.toNewGame(res.data.response.data.id))
            .catch(err => console.log(err.error));
         alert(`hey look! values : ${JSON.stringify(builtGame)}`);
      },
      editGameName(gameId) {
         alert(`i want to edit gameId: ${gameId}`);
         this.createGameDialog = false;
      },
      toGame(route, gameId) {
         this.$store.commit(
            'selectGame',
            this.games.find(game => game.id === gameId) ||
         );
         if (this.mobile()) {
            this.navigate({
               name: route,
               params: { gameId: gameId },
            });
         } else {
            this.navigate({ name: 'game', params: { gameId: gameId, tab: route } });
         }
      },
      closeDialog() {
         this.createGameDialog = false;
         this.newGame.label = null;
         this.newGame.version = null;
      },
   },
   computed: {
      username() {
         return this.$store.state.username;
      },
      games() {
         return this.$store.state.userGames;
      },
   },
};
</script>

<style></style>

<template>
   <v-container>
      <v-row>
         <v-col>
            <c-speed-dial
               :actions="actions"
               v-if="!mobile()"
               v-on:logout="logout"
               v-on:filter-games="filterDialog = !filterDialog"
               v-on:create-game="createGameDialog = !createGameDialog"
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
         <v-expansion-panels popout>
            <v-expansion-panel v-for="game of games" :key="game.id">
               <v-expansion-panel-header
                  expand-icon="mdi-controller-classic"
                  disable-icon-rotate
                  class="text-h6"
                  >{{ game.label }}
               </v-expansion-panel-header>
               <v-expansion-panel-content>
                  <v-dialog v-model="editGameDialog" width="500">
                     <c-dialog-card
                        :props="editGameCard"
                        v-on:close-dialog="closeDialog"
                        v-on:edit-game="confirmEdits(game.game_id)"
                     >
                        <div v-if="editingGame" class="text-center mt-3">
                           <v-progress-circular
                              indeterminate
                              size="100"
                              color="primary"
                           ></v-progress-circular>
                        </div>
                        <v-text-field
                           outlined
                           class="mt-3"
                           v-model="editGame.label"
                           :rules="[textFieldRules.required]"
                           label="Name"
                        ></v-text-field>
                     </c-dialog-card>
                  </v-dialog>
                  <v-dialog v-model="deleteGameDialog" width="500">
                     <c-dialog-card
                        :props="deleteGameCard"
                        v-on:close-dialog="closeDialog"
                        v-on:delete-game="confirmDeleteGame(game.game_id)"
                     >
                        <div v-if="deletingGame" class="text-center mt-3">
                           <v-progress-circular
                              indeterminate
                              size="100"
                              color="primary"
                           ></v-progress-circular>
                        </div>
                     </c-dialog-card>
                  </v-dialog>
                  <v-container>
                     <v-row class="d-flex justify-end mb-3">
                        <v-btn text @click="deleteGame(game.game_id)">
                           <v-icon dark color="red">mdi-minus-circle</v-icon>
                           Delete
                        </v-btn>
                        <v-btn text @click="editGameName(game.game_id)">
                           <v-icon dark color="warning">mdi-pencil-circle</v-icon>
                           Edit
                        </v-btn>
                     </v-row>
                     <v-row class="d-flex justify-space-around">
                        <div>
                           <div class="mb-3">
                              {{ game.version.label }}
                           </div>
                           <v-img
                              :alt="game.version.label"
                              :lazy-src="game.version.artwork_url"
                              :src="game.version.artwork_url"
                              max-height="150"
                              max-width="150"
                              position="center left"
                              contain
                           ></v-img>
                        </div>
                        <div v-if="game.party_icon_urls.length > 0">
                           <div class="text mb-3">Party</div>
                           <v-img
                              v-for="url of game.party_icon_urls"
                              :key="url"
                              :lazy-src="url"
                              :src="url"
                              contain
                           >
                           </v-img>
                        </div>
                        <div v-if="game.gym_badge_icon_urls.length > 0">
                           <div class="text mb-3">Gym Badges</div>
                           <v-img
                              v-for="url of game.gym_badge_icon_urls"
                              :key="url"
                              :lazy-src="url"
                              :src="url"
                              contain
                           >
                           </v-img>
                        </div>
                        <div>
                           <div class="text mb-3">Game Links</div>
                           <div v-for="btn of gameBtns" :key="btn.label">
                              <div class="mt-2">
                                 <v-btn
                                    fab
                                    dark
                                    small
                                    @click="
                                       toGame(
                                          mobile() ? btn.mobileRoute : btn.desktopRoute,
                                          game.game_id
                                       )
                                    "
                                    ><v-icon>{{ btn.icon }}</v-icon></v-btn
                                 >
                                 <span class="ml-3">{{ btn.label }}</span>
                              </div>
                           </div>
                        </div>
                     </v-row>
                  </v-container>
               </v-expansion-panel-content>
            </v-expansion-panel>
         </v-expansion-panels>
      </v-row>
      <v-dialog v-model="createGameDialog" width="500">
         <c-dialog-card
            :props="createGameCard"
            v-on:close-dialog="closeDialog"
            v-on:start-game="startGame"
         >
            <div v-if="creatingGame" class="text-center mt-3">
               <v-progress-circular
                  indeterminate
                  size="100"
                  color="primary"
               ></v-progress-circular>
            </div>
            <div class="mt-3" v-if="!creatingGame">
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
                  :items="Object.values(VERSIONS).map(v => v.label)"
               >
               </v-combobox>
            </div>
         </c-dialog-card>
      </v-dialog>
      <v-dialog v-model="filterDialog" width="500">
         <c-dialog-card
            :props="filterDialogCard"
            v-on:close-dialog="closeDialog"
            v-on:filter-games="confirmFilterOptions"
         >
            <!-- what can we filter on?
                  label
                  game version
                  is_finished
                  game family
                -->
            <v-text-field
               class="mt-3 mb-3"
               label="Name"
               outlined
               v-model="filterValues.label"
            ></v-text-field>
            <v-combobox
               label="Version"
               outlined
               :items="Object.values(VERSIONS).map(v => v.label)"
               clearable
               v-model="filterValues.version"
            ></v-combobox>
            <v-combobox
               class="mt-3"
               label="Generation"
               outlined
               :items="Object.values(VERSIONS).map(v => v.generation)"
               clearable
               v-model="filterValues.generation"
            ></v-combobox>
            <v-radio-group multiple v-model="filterValues.isFinished" row>
               <v-radio label="On Going" color="primary"></v-radio>
               <v-radio label="Finished" color="primary"></v-radio>
               <v-btn @click="filterValues.isFinished = []">reset</v-btn>
            </v-radio-group>
         </c-dialog-card>
      </v-dialog>
   </v-container>
</template>

<script>
import SpeedDial from '../components/SpeedDial.vue';
import DialogCard from '../components/DialogCard.vue';
import * as gameController from '../controllers/games.js';
import * as gameServices from '../services/game.js';
import * as userServices from '../services/user.js';

export default {
   name: 'Games',
   components: {
      'c-speed-dial': SpeedDial,
      'c-dialog-card': DialogCard,
   },
   data() {
      return {
         textFieldRules: { required: value => !!value || 'Required' },
         // create game
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
            successBtn: {
               text: 'Start',
               action: 'start-game',
            },
         },
         // edit game
         editingGame: false,
         editGame: {
            label: null,
         },
         editGameDialog: false,
         editGameCard: {
            title: `Edit Game`,
            successBtn: {
               action: 'edit-game',
            },
         },
         // delete game
         deletingGame: false,
         deleteGameDialog: false,
         deleteGameCard: {
            title: `Delete Game?`,
            text: 'This action cannot be undone. Are you sure you want to continue?',
            dangerBtn: {
               action: 'delete-game',
            },
         },
         // filter games
         filterDialog: false,
         filterDialogCard: {
            title: 'Filter Games',
            successBtn: {
               action: 'filter-games',
            },
         },
         filterValues: {
            label: null,
            version: null,
            generation: null,
            isFinished: [],
         },
         // other data values
         actions: [
            // {
            //    label: 'Filter',
            //    icon: 'mdi-filter',
            //    action: 'filter-games',
            //    color: 'primary',
            // },
            {
               label: 'Create Game',
               icon: 'mdi-plus',
               action: 'create-game',
               color: 'green',
            },
         ],
         gameBtns: [
            {
               label: 'Pokemon',
               mobileRoute: 'pokemon',
               desktopRoute: 0,
               icon: 'mdi-pokeball',
            },
            {
               label: 'Routes',
               mobileRoute: 'routes',
               desktopRoute: 1,
               icon: 'mdi-routes',
            },
            { label: 'Gyms', mobileRoute: 'gyms', desktopRoute: 2, icon: 'mdi-domain' },
            { label: 'Rules', mobileRoute: 'rules', desktopRoute: 3, icon: 'mdi-book' },
         ],
      };
   },
   methods: {
      async startGame() {
         this.creatingGame = true;
         try {
            const gameToCreate = gameController.build(this.newGame);
            let res = await gameServices.createGame(gameToCreate);
            const createdGame = this.toAPIResponse(res);
            const gameSnapshot = gameController.getSnapshot(createdGame);
            this.games.push(gameSnapshot);
            await userServices.updateUserById(this.userId, {
               games: this.games,
            });
            this.toNewGame(createdGame);
         } catch (err) {
            alert(err);
         }
         this.closeDialog();
      },
      editGameName(gameId) {
         const selectedGame = this.getSelectedGame(gameId);
         this.editGame.label = selectedGame.label;
         this.editGameCard.title = `Edit ${selectedGame.label}?`;
         this.editGameDialog = true;
      },
      async confirmEdits(gameId) {
         // TODO
         if (!this.isUndefined(this.editGame.label)) {
            this.editingGame = true;
            try {
               const userGamesId = this.games.findIndex(g => g.game_id === gameId);
               this.games[userGamesId].label = this.editGame.label;
               // update user
               await userServices.updateUserById(this.userId, { games: this.games });
               // update game object
               await gameServices.updateGameById(gameId, { label: this.editGame.label });
            } catch (err) {
               alert(err);
            }
         }
         this.closeDialog();
      },
      enterGame(route, gameId) {
         if (this.mobile()) {
            this.navigate({
               name: route,
               params: { gameId: gameId },
            });
         } else {
            route = 2;
            this.navigate({ name: 'game', params: { gameId: gameId, tab: route } });
         }
      },
      toNewGame(game) {
         this.$store.commit('selectGame', game);
         this.enterGame('routes', game.id);
      },
      toGame(route, gameId) {
         // TODO: awaitify
         gameServices.getGameById(gameId).then(res => {
            let data = this.toAPIResponse(res);
            this.$store.commit('selectGame', data);
            this.enterGame(route, gameId);
         });
      },
      async confirmDeleteGame(gameId) {
         this.deletingGame = true;
         // remove from userGames
         const userGamesId = this.games.findIndex(g => g.game_id === gameId);
         this.games.splice(userGamesId, 1);
         // remove from games in db
         // update games in user in db
         try {
            await userServices.updateUserById(this.userId, { games: this.games });
            await gameServices.deleteGameById(gameId);
         } catch (err) {
            console.log(err);
         }
         this.closeDialog();
      },
      deleteGame(gameId) {
         const selectedGame = this.getSelectedGame(gameId);
         this.editGame.label = selectedGame.label;
         this.deleteGameCard.title = `Delete ${selectedGame.label}?`; // ${this.editGame.label}
         this.deleteGameDialog = true;
      },
      closeDialog() {
         this.creatingGame = false;
         this.deletingGame = false;
         this.editingGame = false;
         this.createGameDialog = false;
         this.editGameDialog = false;
         this.deleteGameDialog = false;
         this.filterDialog = false;
         this.newGame.label = null;
         this.newGame.version = null;
         this.editGame.label = null;
         this.filterValues.label = null;
         this.filterValues.version = null;
         this.filterValues.generation = null;
         this.filterValues.isFinished = [];
         this.filterValues.games = null;
      },
      getSelectedGame(gameId) {
         return this.games.find(g => g.game_id === gameId);
      },
      // turning off filtering for now. really buggy
      confirmFilterOptions() {
         // on purpose
         this.filterDialog = false;
      },
      getGeneration(familyCode) {
         let gen;
         if (familyCode === 'letsgo') gen = 7;
         else if (familyCode === 'rubysapphire') gen = 3;
         else if (familyCode === 'emerald') gen = 3;
         return gen;
      },
      getFinishedStatus(boolean) {
         return boolean ? 1 : 0;
      },
   },
   computed: {
      username() {
         return this.$store.state.username;
      },
      games() {
         return this.$store.state.userGames;
      },
      userId() {
         return this.$store.state.userId;
      },
   },
};
</script>

<style>
.v-speed-dial {
   position: absolute;
   z-index: 1000;
}

.v-btn--floating {
   position: relative;
}
</style>

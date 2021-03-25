<template>
   <v-container>
      <v-row>
         <c-speed-dial
            class="c-speed-dial"
            :actions="actions"
            v-if="!mobile()"
            v-on:logout="logout"
            v-on:filter-games="filterDialog = !filterDialog"
            v-on:create-game="createGameDialog = !createGameDialog"
         ></c-speed-dial>
      </v-row>
      <v-row class="d-flex flex-column mb-1">
         <div class="mt-6 text-h2">
            Games
         </div>
         <div class="mt-6 text-h4">Welcome back {{ username }}</div>
      </v-row>
      <!-- TODO: add some text here inviting people to add games if the list is empty -->
      <v-row>
         <v-expansion-panels popout>
            <v-expansion-panel v-for="game of games" :key="game.id">
               <v-expansion-panel-header
                  :expand-icon="toConsoleIcon(game.version.family)"
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
                           label="Name"
                           clearable
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
                        <div id="box-art">
                           <div class="mb-1">
                              {{ game.version.label }}
                           </div>
                           <v-img
                              class="mt-2"
                              :alt="game.version.label"
                              :lazy-src="game.version.artwork_url"
                              :src="game.version.artwork_url"
                              max-height="150"
                              max-width="150"
                              position="center left"
                              contain
                           ></v-img>
                        </div>
                        <!-- FIXME this isn't actually getting current party icon urls... -->
                        <div id="party">
                           <div class="text mb-1">Party</div>
                           <div
                              v-for="(group, i) of ofSix(game.party_icon_urls)"
                              :key="`${group}-${i}`"
                              class="d-inline-flex flex-column mr-3"
                           >
                              <c-poke-spirte
                                 v-for="(url, i) of group"
                                 class="mt-2"
                                 :key="`${url}-${i}`"
                                 :src="url"
                                 outlineColor=""
                                 size="small"
                              ></c-poke-spirte>
                           </div>
                        </div>
                        <div id="gym-badges">
                           <div class="text mb-1">Gym Badges</div>
                           <div
                              v-for="(group, i) of ofEight(game.gym_badge_icon_urls)"
                              :key="`${group}-${i}`"
                              class="d-inline-flex flex-column mr-3"
                           >
                              <c-badge-sprite
                                 class="mt-2"
                                 v-for="(url, i) of group"
                                 :key="`${url}-${i}`"
                                 :src="url"
                              ></c-badge-sprite>
                           </div>
                        </div>
                        <div id="game-links">
                           <div class="text mb-1">Game Links</div>
                           <div v-for="btn of gameBtns" :key="btn.label">
                              <div v-if="mobile()">
                                 <v-btn
                                    class="mt-2"
                                    fab
                                    dark
                                    small
                                    @click="toGame(btn.mobileRoute, game.game_id)"
                                    ><v-icon>{{ btn.icon }}</v-icon></v-btn
                                 >
                                 <span class="ml-3">{{ btn.label }}</span>
                              </div>
                              <div v-if="!mobile()">
                                 <v-btn
                                    class="mt-2"
                                    fab
                                    dark
                                    small
                                    @click="toGame(btn.desktopRoute, game.game_id)"
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
                  clearable
                  outlined
                  v-model="newGame.label"
                  label="Name"
               ></v-text-field>
               <v-combobox
                  label="Version"
                  outlined
                  v-model="newGame.version"
                  :items="Object.values(Versions).map(v => v.label)"
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
            <v-text-field
               class="mt-3 mb-3"
               label="Name"
               outlined
               v-model="filterValues.label"
               clearable
            ></v-text-field>
            <v-combobox
               label="Version"
               outlined
               :items="Object.values(Versions).map(v => v.label)"
               clearable
               v-model="filterValues.version"
            ></v-combobox>
            <v-combobox
               class="mt-3"
               label="Generation"
               outlined
               :items="Object.values(Versions).map(v => v.generation)"
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
import PokeSprite from '../components/PokeSprite.vue';
import BadgeSprite from '../components/BadgeSprite.vue';
import * as gameController from '../controllers/game.js';
import * as gameServices from '../services/game.js';
import * as userServices from '../services/user.js';
import TabMap from '../constants/TabMap.js';
import Pages from '../constants/Pages.js';
import Icons from '../constants/Icons.js';
import * as util from '../util/util.js';
import APIResponse from '../models/APIResponse.js';
import NewGame from '../models/NewGame.js';

export default {
   // TODO: clean up this big boy
   name: 'Games',
   components: {
      'c-poke-spirte': PokeSprite,
      'c-badge-sprite': BadgeSprite,
      'c-speed-dial': SpeedDial,
      'c-dialog-card': DialogCard,
   },
   data() {
      return {
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
            primaryBtn: {
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
            primaryBtn: {
               action: 'edit-game',
            },
         },
         // delete game
         deletingGame: false,
         deleteGameDialog: false,
         deleteGameCard: {
            title: `Delete Game?`,
            text: 'This action cannot be undone. Are you sure you want to continue?',
            secondaryBtn: {
               action: 'delete-game',
            },
         },
         // filter games
         filterDialog: false,
         filterDialogCard: {
            title: 'Filter Games',
            primaryBtn: {
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
               icon: Icons.CONTROLS.PLUS,
               action: 'create-game',
               color: 'green',
            },
         ],
         gameBtns: [
            {
               label: 'Pokemon',
               mobileRoute: Pages.POKEMON,
               desktopRoute: TabMap.POKEMON,
               icon: Icons.PAGES.POKEMON,
            },
            {
               label: 'Routes',
               mobileRoute: Pages.ROUTES,
               desktopRoute: TabMap.ROUTES,
               icon: Icons.PAGES.ROUTES,
            },
            {
               label: 'Gyms',
               mobileRoute: Pages.GYMS,
               desktopRoute: TabMap.GYMS,
               icon: Icons.PAGES.GYM,
            },
            {
               label: 'Rules',
               mobileRoute: Pages.RULES,
               desktopRoute: TabMap.RULES,
               icon: Icons.PAGES.RULES,
            },
         ],
      };
   },
   methods: {
      toConsoleIcon(family) {
         return gameController.getConsoleIcon(family);
      },
      ofSix(array) {
         const twoD = [];
         twoD.push(array.filter((e, i) => i / 6 < 0.5));
         twoD.push(array.filter((e, i) => i / 6 >= 0.5));
         return twoD;
      },
      ofEight(array) {
         const twoD = [];
         twoD.push(array.filter((e, i) => i / 9 < 0.44));
         twoD.push(array.filter((e, i) => i / 9 > 0.44));
         return twoD;
      },
      async startGame() {
         this.creatingGame = true;
         try {
            const gameToCreate = NewGame.builder()
               .withLabel(this.newGame.label)
               .withVersion(this.newGame.version)
               .build();
            let res = await gameServices.createGame(gameToCreate);
            const apiResponse = new APIResponse(res);
            const gameSnapshot = gameController.getSnapshot(apiResponse.data);
            this.games.push(gameSnapshot);
            await userServices.updateUserById(this.userId, {
               games: this.games,
            });
            this.toNewGame(apiResponse.data);
         } catch (err) {
            alert(err.stack);
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
         if (!util.isUndefined(this.editGame.label)) {
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
         if (util.mobile()) {
            util.navigate({ name: route, params: { gameId: gameId } });
         } else {
            util.navigate({ name: 'game', params: { gameId: gameId, tab: route } });
         }
      },
      toNewGame(game) {
         this.$store.commit('selectGame', game);
         this.enterGame('routes', game.id);
      },
      async toGame(route, gameId) {
         try {
            let res = await gameServices.getGameById(gameId);
            let data = new APIResponse(res).data;
            this.$store.commit('selectGame', data);
            this.enterGame(route, gameId);
         } catch (err) {
            alert(err);
         }
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
   /* z-index: 1; */
}

.v-btn--floating {
   position: relative;
}
</style>

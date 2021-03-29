<template>
   <v-container>
      <v-row>
         <c-speed-dial
            class="c-speed-dial"
            :actions="actions"
            v-if="!mobile()"
            v-on:logout="logout"
            v-on:filter-games="filter.flag = !filter.flag"
            v-on:create-game="createGame.flag = !createGame.flag"
         ></c-speed-dial>
      </v-row>
      <v-row class="d-flex flex-column mb-1">
         <div class="mt-6 text-h2">
            Games
         </div>
         <div class="mt-6 text-h4">Welcome back {{ username }}</div>
      </v-row>
      <v-row v-if="games.length === 0">
         <div class="mt-6 text-body">
            It looks like you don't have any games... You should create a new game from
            the menu!
         </div>
      </v-row>
      <v-row>
         <v-expansion-panels popout>
            <c-gamecordian
               v-show="filtered"
               v-for="game of games"
               :key="game.id"
               :game="game"
            ></c-gamecordian>
         </v-expansion-panels>
      </v-row>
      <v-dialog v-model="createGame.flag" width="500">
         <c-dialog-card
            :props="createGame.dialogCard"
            v-on:close-dialog="closeDialog"
            v-on:start-game="startGame"
         >
            <v-fade-transition>
               <c-progress-spinner v-show="processingGame"></c-progress-spinner>
            </v-fade-transition>
            <v-fade-transition>
               <div class="mt-3" v-show="!processingGame">
                  <v-text-field
                     clearable
                     outlined
                     v-model="createGame.values.label"
                     label="Name"
                  ></v-text-field>
                  <v-combobox
                     clearable
                     label="Version"
                     outlined
                     v-model="createGame.values.version"
                     :items="gameVersions"
                  >
                  </v-combobox>
                  <c-error
                     v-for="(error, i) of createGame.errors.errors"
                     :key="i"
                     :error="error"
                  >
                  </c-error>
               </div>
            </v-fade-transition>
         </c-dialog-card>
      </v-dialog>
      <v-dialog v-model="filter.flag" width="500">
         <c-dialog-card
            :props="filter.dialogCard"
            v-on:close-dialog="closeDialog"
            v-on:filter-games="confirmFilterOptions"
         >
            <v-text-field
               class="mt-3 mb-3"
               label="Name"
               outlined
               v-model="filter.values.label"
               clearable
            ></v-text-field>
            <v-combobox
               label="Version"
               outlined
               :items="Object.values(Versions).map(v => v.label)"
               clearable
               v-model="filter.values.version"
            ></v-combobox>
            <v-combobox
               class="mt-3"
               label="Generation"
               outlined
               :items="Object.values(Versions).map(v => v.generation)"
               clearable
               v-model="filter.values.generation"
            ></v-combobox>
            <v-radio-group multiple v-model="filter.values.finished" row>
               <v-radio label="On Going" color="primary"></v-radio>
               <v-radio label="Finished" color="primary"></v-radio>
               <v-btn @click="filter.values.finished = []">reset</v-btn>
            </v-radio-group>
         </c-dialog-card>
      </v-dialog>
   </v-container>
</template>

<script>
import SpeedDial from '../components/SpeedDial.vue';
import DialogCard from '../components/DialogCard.vue';
import Gamecordian from '../components/Gamecordian.vue';
import Errors from '../components/Errors.vue';
import ProgressSpinner from '../components/ProgressSpinner.vue';
import * as gameController from '../controllers/game.js';
import * as util from '../util/util.js';
import Icons from '../constants/Icons.js';
import Versions from '../constants/Versions';

export default {
   name: 'Games',
   components: {
      'c-speed-dial': SpeedDial,
      'c-dialog-card': DialogCard,
      'c-gamecordian': Gamecordian,
      'c-error': Errors,
      'c-progress-spinner': ProgressSpinner,
   },
   data() {
      return {
         // create game
         processingGame: false,
         createGame: {
            flag: false,
            values: {
               label: null,
               version: null,
            },
            dialogCard: {
               title: 'Start a new Game',
               text:
                  'Are you ready to set out on a new adventure? Give this playthrough a memorable name and pick a game version.',
               primaryBtn: {
                  text: 'Start',
                  action: 'start-game',
               },
            },
            errors: {
               errors: [],
               hasErrors: false,
            },
         },
         // filter games
         filter: {
            flag: false,
            dialogCard: {
               title: 'Filter Games',
               primaryBtn: {
                  action: 'filter-games',
               },
            },
            values: {
               label: null,
               version: null,
               generation: null,
               finished: [],
            },
         },
         actions: [
            {
               label: 'Filter',
               icon: Icons.CONTROLS.FILTER,
               action: 'filter-games',
               color: 'primary',
            },
            {
               label: 'Create Game',
               icon: Icons.CONTROLS.PLUS,
               action: 'create-game',
               color: 'success',
            },
         ],
      };
   },
   methods: {
      async startGame() {
         if (!confirm(util.prettySON(this.createGame.values))) return;
         // validate
         this.createGame.errors = gameController.getValidationErrors(
            this.createGame.values
         );
         if (this.createGame.errors.hasErrors) return;
         this.processingGame = true;
         await gameController.createNewGame(
            this.createGame.values.label,
            this.createGame.values.version.value,
            undefined
         );
         this.closeDialog();
      },
      closeDialog() {
         this.processingGame = false;
         this.createGame.flag = false;
         this.filter.flag = false;
         this.createGame.values.label = null;
         this.createGame.values.version = null;
         this.filter.values.label = null;
         this.filter.values.version = null;
         this.filter.values.generation = null;
         this.filter.values.isFinished = [];
         this.filter.values.games = null;
      },
      confirmFilterOptions() {
         // TODO implement filtering. USE V-SHOW!
         this.filter.flag = false;
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
      filtered() {
         return true;
      },
      gameVersions() {
         return Object.values(Versions).map(v =>
            Object({
               value: v.key,
               text: v.label,
            })
         );
      },
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

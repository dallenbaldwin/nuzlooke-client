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
               v-show="getFilter(game)"
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
                  <c-text-field
                     label="Name"
                     v-model="createGame.values.label"
                  ></c-text-field>
                  <c-combobox
                     label="Version"
                     v-model="createGame.values.version"
                     :items="gameVersions"
                  ></c-combobox>
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
         <c-dialog-card :props="filter.dialogCard" v-on:close-dialog="closeDialog">
            <c-text-field label="Name" v-model="filter.values.label"></c-text-field>
            <c-combobox
               label="Version"
               :items="Object.values(Versions).map(v => v.label)"
               v-model="filter.values.version"
               :multiple="true"
            ></c-combobox>
            <c-combobox
               label="Generation"
               :items="Object.values(Versions).map(v => v.generation)"
               v-model="filter.values.generation"
               :multiple="true"
            ></c-combobox>
            <c-combobox
               label="Status"
               v-model="filter.values.finished"
               :items="filter.finishedStatuses"
               :multiple="true"
            >
            </c-combobox>
         </c-dialog-card>
      </v-dialog>
   </v-container>
</template>

<script>
import SpeedDial from '../components/SpeedDial.vue';
import DialogCard from '../components/DialogCard.vue';
import Gamecordian from '../components/games/Gamecordian.vue';
import Errors from '../components/Errors.vue';
import ProgressSpinner from '../components/ProgressSpinner.vue';
import TextField from '../components/form-controls/TextField.vue';
import Combobox from '../components/form-controls/Combobox.vue';
import * as gameController from '../controllers/game';
import * as util from '../util/util';
import Icons from '../constants/Icons';
import Versions from '../constants/Versions';

export default {
   name: 'Games',
   components: {
      'c-speed-dial': SpeedDial,
      'c-dialog-card': DialogCard,
      'c-gamecordian': Gamecordian,
      'c-error': Errors,
      'c-progress-spinner': ProgressSpinner,
      'c-text-field': TextField,
      'c-combobox': Combobox,
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
               cancelBtn: {
                  text: 'close',
               },
            },
            values: {
               label: null,
               version: null,
               generation: null,
               finished: [],
            },
            finishedStatuses: [
               { value: false, text: 'On Going' },
               { value: true, text: 'Finished' },
            ],
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
         // if (!confirm(util.prettySON(this.createGame.values))) return;
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
      getGeneration(versionObj) {
         let familyCode = versionObj.family;
         let gen;
         if (familyCode === 'lets-go') gen = 7;
         else if (familyCode === 'ruby-sapphire') gen = 3;
         else if (familyCode === 'emerald') gen = 3;
         return `${gen}`;
      },
      getFinishedStatus(boolean) {
         return boolean ? 1 : 0;
      },
      getFilter(game) {
         const isLabel = util.likeOrUndefined(game.label, this.filter.values.label);
         const isGeneration = util.includesOrEmptyArray(
            this.getGeneration(game.version),
            this.filter.values.generation
         );
         const isVersion = util.includesOrEmptyArray(
            game.version.label,
            this.filter.values.version
         );
         const isFinished = util.includesOrEmptyArray(
            this.getFinishedStatus(game.is_finished),
            this.filter.values.finished.map(v => this.getFinishedStatus(v.value))
         );
         return isLabel && isGeneration && isVersion && isFinished;
      },
   },
   computed: {
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

<template>
   <v-container fill-height>
      <div v-if="!mobile()">
         <v-row>
            <c-speed-dial
               class="c-speed-dial"
               :actions="actions"
               v-on:logout="logout"
               v-on:filter-games="filter.flag = !filter.flag"
               v-on:create-game="createGame.flag = !createGame.flag"
            ></c-speed-dial>
         </v-row>
         <v-row>
            <div class="ma-3 text-h2">Games</div>
         </v-row>
      </div>
      <v-row>
         <div class="ma-3 text-h4">Welcome back {{ username }}</div>
      </v-row>
      <v-row v-if="games.length === 0">
         <div class="ma-3 text-body">
            It looks like you don't have any games... You should create a new game from
            the menu!
         </div>
      </v-row>
      <v-row>
         <c-toobar
            :add="true"
            :filter="true"
            add-label="Create Game"
            v-on:add="createGame.flag = !createGame.flag"
            v-on:filter="filter.flag = !filter.flag"
         ></c-toobar>
      </v-row>
      <v-row>
         <v-expansion-panels popout class="mt-1">
            <c-gamecordian
               v-show="getFilter(game)"
               v-for="game of games"
               :key="game.id"
               :game="game"
            ></c-gamecordian>
         </v-expansion-panels>
      </v-row>
      <v-dialog v-model="createGame.flag" width="500" scrollable>
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
                  <div
                     v-for="(rule, i) of createGame.values.rules"
                     :key="`${i}-rule`"
                     class="d-flex flex-row"
                  >
                     <c-combobox
                        :items="rule.items"
                        v-model="rule.values"
                        label="Pre-defined Rule"
                     ></c-combobox>
                     <c-btn
                        class="align-self-center"
                        @click="removeRule(i)"
                        color="red"
                        :icon="Icons.CONTROLS.DELETE"
                        :isIcon="true"
                     ></c-btn>
                  </div>
                  <div class="mb-3">
                     <v-spacer></v-spacer>
                     <c-btn @click="addRule" color="success" :icon="Icons.CONTROLS.ADD"
                        >Add Default Rule</c-btn
                     >
                  </div>
                  <c-error
                     v-for="(error, i) of createGame.errors.errors"
                     :key="`${i}-error`"
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
               :items="gameVersions"
               v-model="filter.values.version"
               :multiple="true"
            ></c-combobox>
            <c-combobox
               label="Generation"
               :items="generations"
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
import Button from '../components/Button.vue';
import Toolbar from '../components/Toolbar.vue';
import * as gameController from '../controllers/game';
import * as util from '../util/util';
import Icons from '../constants/Icons';
import GameVersions from '../constants/GameVersions';
import GameRules from '../constants/GameRules';

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
      'c-btn': Button,
      'c-toobar': Toolbar,
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
               rules: [],
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
               version: [],
               generation: [],
               finished: [],
            },
            finishedStatuses: [
               { value: false, text: 'On Going' },
               { value: true, text: 'Finished' },
            ],
         },
         // speed dial buttons
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
      clickAdd() {
         // inherited from App.vue
         this.createGame.flag = true;
      },
      clickFilter() {
         // inherited from App.vue
         this.filter.flag = true;
      },
      addRule() {
         if (this.createGame.values.rules.some(r => util.isUndefined(r.values))) return;
         this.createGame.values.rules.push({
            items: this.defaultGameRules,
            values: null,
         });
      },
      removeRule(index) {
         this.createGame.values.rules.splice(index, 1);
      },
      async startGame() {
         // validate
         this.createGame.errors = gameController.getValidationErrors(
            this.createGame.values
         );
         if (this.createGame.errors.hasErrors) return;
         this.processingGame = true;
         await gameController.createNewGame(
            this.createGame.values.label,
            this.createGame.values.version.value,
            this.createGame.values.rules.map(rule => rule.values.value)
         );
         this.closeDialog();
      },
      closeDialog() {
         this.processingGame = false;
         this.createGame.flag = false;
         this.filter.flag = false;
         this.createGame.values.label = null;
         this.createGame.values.version = null;
         this.createGame.errors.errors = [];
         this.createGame.errors.hasErrors = false;
         this.filter.values.label = null;
         this.filter.values.version = [];
         this.filter.values.generation = [];
         this.filter.values.isFinished = [];
      },
      getFinishedStatus(boolean) {
         return boolean ? 1 : 0;
      },
      getFilter(game) {
         const isLabel = util.likeOrUndefined(game.label, this.filter.values.label);
         const isGeneration = util.includesOrEmptyArray(
            game.version.generation,
            this.filter.values.generation.map(v => v.value)
         );
         const isVersion = util.includesOrEmptyArray(
            game.version.version,
            this.filter.values.version.map(v => v.value)
         );
         const isFinished = util.includesOrEmptyArray(
            this.getFinishedStatus(game.is_finished),
            this.filter.values.finished.map(v => this.getFinishedStatus(v.value))
         );
         return isLabel && isGeneration && isVersion && isFinished;
      },
   },
   computed: {
      defaultGameRules() {
         return Object.values(GameRules).map(gr =>
            Object({ value: gr.id, text: gr.label })
         );
      },
      generations() {
         return Object.values(GameVersions).map(v =>
            Object({ value: v.generation, text: v.generation_label })
         );
      },
      gameVersions() {
         return Object.values(GameVersions).map(v =>
            Object({
               value: v.version,
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
   mounted() {
      this.createGame.values.rules = [
         {
            items: this.defaultGameRules,
            values: {
               text: GameRules.USE_NICKNAMES.label,
               value: GameRules.USE_NICKNAMES.id,
            },
         },
         {
            items: this.defaultGameRules,
            values: {
               text: GameRules.FAINTING_KILLS.label,
               value: GameRules.FAINTING_KILLS.id,
            },
         },
         {
            items: this.defaultGameRules,
            values: {
               text: GameRules.ONE_MON_ONE_AREA.label,
               value: GameRules.ONE_MON_ONE_AREA.id,
            },
         },
      ];
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

<template>
   <v-container fill-height>
      <div v-if="!mobile()">
         <v-row>
            <c-speed-dial
               class="c-speed-dial"
               v-on:logout="logout"
               v-on:filter="filter.flag = !filter.flag"
               v-on:add="createGame = !createGame"
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
            v-on:add="createGame = !createGame"
            v-on:filter="filter.flag = !filter.flag"
         >
            <c-sort :items="sort.items" v-on:set-sort="setSort"></c-sort>
         </c-toobar>
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
      <v-dialog v-model="createGame" width="500" scrollable>
         <c-create-game v-on:close-dialog="createGame = !createGame"></c-create-game>
      </v-dialog>
      <v-dialog v-model="filter.flag" width="500">
         <c-dialog-card :props="filter.dialogCard" v-on:close-dialog="closeDialog">
            <c-sort v-if="mobile()" :items="sort.items" v-on:set-sort="setSort"></c-sort>
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
import SpeedDial from '../components/speed-dial/SpeedDial.vue';
import DialogCard from '../components/dialogs/DialogCard.vue';
import Gamecordian from '../components/games/Gamecordian.vue';
import CreateGame from '../components/games/CreateGame.vue';
import TextField from '../components/form-controls/TextField.vue';
import Combobox from '../components/form-controls/Combobox.vue';
import Toolbar from '../components/Toolbar.vue';
import * as util from '../util/util';
import Icons from '../constants/Icons';
import GameVersions from '../constants/GameVersions';
import Sort from '../components/form-controls/Sort.vue';
import * as authController from '../controllers/auth';

export default {
   name: 'Games',
   components: {
      'c-speed-dial': SpeedDial,
      'c-dialog-card': DialogCard,
      'c-gamecordian': Gamecordian,
      'c-text-field': TextField,
      'c-combobox': Combobox,
      'c-toobar': Toolbar,
      'c-create-game': CreateGame,
      'c-sort': Sort,
   },
   data() {
      return {
         unsortedGames: this.games,
         createGame: false,
         sort: {
            items: ['None', 'Name', 'Version', 'Generation', 'Status'],
            map: {
               null: 'game_id',
               Name: 'label',
               Version: 'version',
               Generation: 'generation',
               Status: 'is_finished',
            },
         },
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
      };
   },
   methods: {
      logout() {
         authController.logout();
      },
      setSort(payload) {
         let asc = payload.dir === 'asc';
         if (['Version', 'Generation'].includes(payload.value)) {
            this.games.sort((a, b) => {
               let aVal = a.version[this.sort.map[payload.value]].toLowerCase();
               let bVal = b.version[this.sort.map[payload.value]].toLowerCase();
               if (aVal > bVal) return asc ? 1 : -1;
               if (aVal < bVal) return asc ? -1 : 1;
               return 0;
            });
         } else {
            this.games.sort((a, b) => {
               let aVal = a[this.sort.map[payload.value]].toString().toLowerCase();
               let bVal = b[this.sort.map[payload.value]].toString().toLowerCase();
               if (aVal > bVal) return asc ? 1 : -1;
               if (aVal < bVal) return asc ? -1 : 1;
               return 0;
            });
         }
      },
      clickAdd() {
         // inherited from App.vue
         this.createGame = true;
      },
      clickFilter() {
         // inherited from App.vue
         this.filter.flag = true;
      },
      closeDialog() {
         this.createGame = false;
         this.filter.flag = false;
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
      this.setSort({ value: null, dir: 'asc' });
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

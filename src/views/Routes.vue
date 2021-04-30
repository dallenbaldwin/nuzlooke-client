<template>
   <div>
      <v-row>
         <c-toolbar :filter="true" v-on:filter="filter.flag = !filter.flag">
            <c-sort :items="sort.items" v-on:set-sort="setSort"></c-sort>
         </c-toolbar>
      </v-row>
      <v-row class="d-flex justify-center align-content-start flex-row overflow-y-auto">
         <c-route-card
            v-for="(encounter, i) of game.encounters"
            :key="i"
            :encounter="encounter"
            v-show="getFilter(encounter)"
         ></c-route-card>
      </v-row>
      <c-dialog-wrapper v-model="filter.flag">
         <c-dialog-card :props="filter.dialogCard" v-on:close-dialog="closeDialog">
            <c-sort v-if="mobile()" :items="sort.items" v-on:set-sort="setSort"></c-sort>
            <c-combobox
               label="Status"
               v-model="filter.values.status"
               :items="Object.values(EncounterResultConst)"
               :multiple="true"
            ></c-combobox>
            <c-text-field label="Name" v-model="filter.values.label"></c-text-field>
            <c-combobox
               label="Species"
               v-model="filter.values.species"
               :items="encountersSpecies"
               :multiple="true"
            ></c-combobox>
            <c-text-field
               label="Nickname"
               v-model="filter.values.nickname"
            ></c-text-field>
            <c-combobox
               label="Type"
               v-model="filter.values.types"
               :items="pokemonTypes"
               :types="true"
               :multiple="true"
            ></c-combobox>
         </c-dialog-card>
      </c-dialog-wrapper>
   </div>
</template>

<script>
import DialogCard from '../components/dialogs/DialogCard.vue';
import Combobox from '../components/form-controls/Combobox.vue';
import TextField from '../components/form-controls/TextField.vue';
import RouteCard from '../components/routes/RouteCard.vue';
import Toolbar from '../components/Toolbar.vue';
import Sort from '../components/form-controls/Sort.vue';
import Button from '../components/Button.vue';
import * as util from '../util/util';
import PokemonTypes from '../constants/PokemonTypes';
import DialogWrapperVue from '../components/dialogs/DialogWrapper.vue';

export default {
   name: 'Routes',
   components: {
      'c-route-card': RouteCard,
      'c-dialog-card': DialogCard,
      'c-text-field': TextField,
      'c-combobox': Combobox,
      'c-btn': Button,
      'c-toolbar': Toolbar,
      'c-sort': Sort,
      'c-dialog-wrapper': DialogWrapperVue,
   },
   data() {
      return {
         sort: {
            items: ['None', 'Status', 'Name', 'Nickname'],
            map: {
               null: 'sort_id',
               Status: 'constant',
               Name: 'label',
               Nickname: 'nickname',
            },
         },
         filter: {
            flag: false,
            dialogCard: {
               title: 'Filter Routes',
               cancelBtn: { text: 'close' },
            },
            values: {
               status: null,
               label: null,
               species: null,
               nickname: null,
               types: null,
            },
         },
      };
   },
   computed: {
      encounters() {
         return this.game.encounters;
      },
      pokemonTypes() {
         return Object.values(PokemonTypes).map(t => t.label);
      },
      game() {
         return this.$store.state.game;
      },
      userId() {
         return this.$store.state.userId;
      },
      encountersSpecies() {
         const set = new Set();
         this.game.encounters.forEach(encounter => {
            encounter.pokemons.forEach(pokemon => {
               set.add(pokemon.species);
            });
         });
         const array = [...set];
         array.sort();
         return array;
      },
   },
   methods: {
      setSort(payload) {
         let asc = payload.dir === 'asc';
         if (['Status', 'Nickname'].includes(payload.value)) {
            this.encounters.sort((a, b) => {
               let aVal = a.result[this.sort.map[payload.value]].toLowerCase();
               let bVal = b.result[this.sort.map[payload.value]].toLowerCase();
               if (aVal > bVal) return asc ? 1 : -1;
               if (aVal < bVal) return asc ? -1 : 1;
               return 0;
            });
         } else {
            this.encounters.sort((a, b) => {
               let aVal = a[this.sort.map[payload.value]].toString().toLowerCase();
               let bVal = b[this.sort.map[payload.value]].toString().toLowerCase();
               if (aVal > bVal) return asc ? 1 : -1;
               if (aVal < bVal) return asc ? -1 : 1;
               return 0;
            });
         }
         this.$forceUpdate();
      },
      getFilter(encounter) {
         const isStatus = util.includesOrEmptyArray(
            encounter.result.constant,
            this.filter.values.status
         );
         const isLabel = util.likeOrUndefined(encounter.label, this.filter.values.label);
         const isSpecies = util.includesOrEmptyArray(
            encounter.pokemons.map(p => p.species),
            this.filter.values.species
         );
         const isNickname = util.likeOrUndefined(
            encounter.result.nickname,
            this.filter.values.nickname
         );
         const isTypes = util.includesOrEmptyArray(
            encounter.pokemons.flatMap(p => p.types),
            this.filter.values.types
         );
         return isStatus && isLabel && isSpecies && isNickname && isTypes;
      },
      clickFilter() {
         // this is inherited from Game.vue and App.vue
         this.filter.flag = true;
      },
      closeDialog() {
         this.filter.flag = false;
      },
      mounted() {
         this.setSort({ value: null, dir: 'asc' });
      },
   },
};
</script>

<style>
.c-sticky {
   top: 0;
}
</style>

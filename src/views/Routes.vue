<template>
   <div>
      <v-row>
         <v-toolbar>
            <v-spacer></v-spacer>
            <v-toolbar-items>
               <v-icon>{{ Icons.CONTROLS.SEARCH }}</v-icon>
               <v-icon>{{ Icons.CONTROLS.FILTER }}</v-icon>
               <v-spacer></v-spacer>
            </v-toolbar-items>
         </v-toolbar>
      </v-row>
      <v-row class="d-flex justify-center align-content-start flex-row">
         <c-route-card
            v-for="(encounter, i) of game.encounters"
            :key="i"
            :encounter="encounter"
            v-show="getFilter(encounter)"
         ></c-route-card>
      </v-row>
      <v-dialog v-model="filter.flag" width="500">
         <c-dialog-card :props="filter.dialogCard" v-on:close-dialog="closeDialog">
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
      </v-dialog>
   </div>
</template>

<script>
import DialogCard from '../components/DialogCard.vue';
import Combobox from '../components/form-controls/Combobox.vue';
import TextField from '../components/form-controls/TextField.vue';
import RouteCard from '../components/routes/RouteCard.vue';
import Button from '../components/Button.vue';
import * as util from '../util/util';
import PokemonTypes from '../constants/PokemonTypes';

export default {
   name: 'Routes',
   components: {
      'c-route-card': RouteCard,
      'c-dialog-card': DialogCard,
      'c-text-field': TextField,
      'c-combobox': Combobox,
      'c-btn': Button,
   },
   // TODO move speed dial actions into toolbar
   data() {
      return {
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
      openFilter() {
         this.filter.flag = true;
      },
      closeDialog() {
         this.filter.flag = false;
      },
   },
};
</script>

<style></style>

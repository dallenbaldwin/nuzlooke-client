<template>
   <v-row>
      <v-expansion-panels popout multiple>
         <c-gymcordian
            v-show="getFilter(gym)"
            v-for="gym of gyms"
            :key="gym.sort_id"
            :gym="gym"
         ></c-gymcordian>
      </v-expansion-panels>
      <v-dialog v-model="filter.flag" width="500">
         <c-dialog-card :props="filter.dialogCard" v-on:close-dialog="closeDialog">
            <v-checkbox
               v-model="filter.values.priority"
               label="Has Priority Move"
               :false-value="null"
               :true-value="true"
            >
            </v-checkbox>
            <c-combobox
               label="Species"
               :items="gymPokemons"
               :multiple="true"
               v-model="filter.values.species"
            ></c-combobox>
            <c-combobox
               label="Type"
               :multiple="true"
               :types="true"
               :items="Object.values(PokemonType).map(t => t.label)"
               v-model="filter.values.types"
            >
            </c-combobox>
         </c-dialog-card>
      </v-dialog>
   </v-row>
</template>

<script>
import Gymcordian from '../components/gyms/Gymcordian.vue';
import DialogCard from '../components/DialogCard.vue';
import TextField from '../components/form-controls/TextField.vue';
import Combobox from '../components/form-controls/Combobox.vue';
import * as util from '../util/util';

export default {
   name: 'Gyms',
   components: {
      'c-dialog-card': DialogCard,
      'c-gymcordian': Gymcordian,
      'c-text-field': TextField,
      'c-combobox': Combobox,
   },
   data() {
      return {
         filter: {
            flag: false,
            dialogCard: {
               title: 'Filter Gyms',
               cancelBtn: { text: 'close' },
            },
            values: {
               types: null,
               species: null,
               priority: null,
            },
         },
      };
   },
   computed: {
      gyms() {
         return this.$store.state.game.gyms;
      },
      gymPokemons() {
         const pokemons = [
            ...new Set(this.gyms.flatMap(g => g.pokemons).map(p => p.species)),
         ];
         pokemons.sort();
         return pokemons;
      },
   },
   methods: {
      getFilter(gym) {
         const isTypes = util.includesOrEmptyArray(
            gym.pokemons.flatMap(p => p.types),
            this.filter.values.types
         );
         const isSpecies = util.includesOrEmptyArray(
            gym.pokemons.map(p => p.species),
            this.filter.values.species
         );
         const isPriority = util.isOrUndefined(
            gym.pokemons.flatMap(p => p.moves).some(m => m.priority),
            this.filter.values.priority
         );
         return isTypes && isSpecies && isPriority;
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

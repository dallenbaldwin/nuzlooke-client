<template>
   <div>
      <v-card-text class="d-inline-flex">
         <c-poke-sprite
            class="mx-2"
            :src="encounter.result.sprite_url"
            :outlineColor="outLineColor"
            size=""
         ></c-poke-sprite>
         <span>
            <v-card-title class="pt-0 pb-0 mt-2">{{ encounter.label }}</v-card-title>
            <v-card-subtitle class="pb-0 mt-2">{{
               encounter.result.result
            }}</v-card-subtitle>
         </span>
      </v-card-text>
      <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn text @click="emitEditEncounter">
            <v-icon color="orange" dark>{{ Icons.CONTROLS.EDIT + '-circle' }}</v-icon>
            Edit Encounter
         </v-btn>
      </v-card-actions>
   </div>
</template>

<script>
import EncounterResult from '../constants/EncounterResult.js';
import PokeSprite from '../components/PokeSprite.vue';

export default {
   name: 'ResultRoute',
   props: ['encounter'],
   components: {
      'c-poke-sprite': PokeSprite,
   },
   data() {
      return {};
   },
   methods: {
      emitEditEncounter() {
         this.$emit('edit-encounter', this.encounter);
      },
   },
   computed: {
      outLineColor() {
         if (this.encounter.result.result === EncounterResult.CAUGHT) return 'green';
         if (this.encounter.result.result === EncounterResult.FAINTED) return 'red';
         if (this.encounter.result.result === EncounterResult.FLED) return 'orange';
      },
   },
};
</script>

<style>
.c-outer {
   position: relative !important;
}
.c-inner {
   position: absolute !important;
   bottom: 0 !important;
   right: 0 !important;
}
</style>

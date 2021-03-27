<template>
   <v-scale-transition>
      <v-card
         min-width="325"
         max-width="325"
         elevation="1"
         outlined
         class="align-self-start mt-3 mx-3"
      >
         <v-card-title class="pb-0">{{ pokemon.nickname }}</v-card-title>
         <v-card-text class="d-inline-flex justify-space-around">
            <c-poke-sprite
               class="align-self-start mx-3 mt-3"
               :src="pokemon.sprite_url"
               size="large"
            ></c-poke-sprite>
            <div>
               <v-card-text class="pb-1 pt-0">{{ pokemon.species }}</v-card-text>
               <v-card-text class="pb-1 pt-0 pr-0">
                  <!-- TODO make this into a component -->
                  <v-chip
                     outlined
                     :ripple="false"
                     small
                     class="mx-1"
                     v-for="(type, i) of pokemon.types"
                     :key="i"
                     >{{ type }}
                  </v-chip>
               </v-card-text>
               <v-card-text class="pb-1 pt-0">From: {{ route.label }}</v-card-text>
               <v-card-text
                  class="pb-1 pt-0"
                  v-if="pokemon.part_state === PartyState.GRAVEYARD"
                  >{{ pokemon.fainted_message }}</v-card-text
               >
               <!-- TODO make button components -->
               <v-btn
                  text
                  v-if="pokemon.party_state === PartyState.PARTY"
                  @click="clickEvolve"
               >
                  <v-icon color="primary" dark>{{ Icons.CONTROLS.EVOLVE }}</v-icon
                  >Evolve</v-btn
               >
               <v-btn
                  text
                  v-if="pokemon.party_state === PartyState.PARTY"
                  @click="clickStorage"
               >
                  <v-icon dark>{{ Icons.CONTROLS.STORAGE }}</v-icon
                  >To Storage</v-btn
               >
               <v-btn
                  text
                  v-if="pokemon.party_state === PartyState.PARTY"
                  @click="clickGraveyard"
               >
                  <v-icon dark>{{ Icons.CONTROLS.TOMBSTONE }}</v-icon>
                  To Graveyard</v-btn
               >
               <v-btn
                  text
                  v-if="pokemon.party_state === PartyState.PC"
                  @click="clickParty"
               >
                  <v-icon dark>{{ Icons.PAGES.POKEMON }}</v-icon
                  >To Party</v-btn
               >
            </div>
         </v-card-text>
      </v-card>
   </v-scale-transition>
</template>

<script>
import * as routeController from '../controllers/route';
import * as pokemonController from '../controllers/pokemon';
import PokeSprite from './PokeSprite.vue';

export default {
   name: 'PokemonCard',
   components: {
      'c-poke-sprite': PokeSprite,
   },
   props: {
      pokemon: { required: true },
   },
   methods: {
      clickEvolve() {
         alert(`i want to evolve ${this.pokemon.nickname}!`);
      },
      clickStorage() {
         pokemonController.sendToStorage(this.pokemon);
      },
      clickGraveyard() {
         alert(`i want to kill ${this.pokemon.nickname}`);
      },
      clickParty() {
         pokemonController.sendToParty(this.pokemon);
      },
   },
   computed: {
      route() {
         return routeController.getRouteByPokemonId(this.pokemon.id);
      },
   },
};
</script>

<style></style>

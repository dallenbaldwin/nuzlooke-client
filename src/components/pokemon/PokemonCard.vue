<template>
   <v-scale-transition>
      <v-card
         min-width="350"
         max-width="350"
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
               <v-card-text class="pb-1 pt-0">
                  <c-pokemon-type
                     v-for="(type, i) of pokemon.types"
                     :key="i"
                     :type="type"
                  ></c-pokemon-type>
               </v-card-text>
               <v-card-text class="pb-1 pt-0">From: {{ route.label }}</v-card-text>
               <v-card-text
                  class="pb-1 pt-0"
                  v-if="pokemon.party_state === PartyState.GRAVEYARD"
                  >{{ pokemon.fainted_message }}</v-card-text
               >
               <c-btn
                  v-for="button of currentButtons"
                  :key="button.label"
                  :color="button.color"
                  :icon="button.icon"
                  :click="button.action"
                  >{{ button.label }}</c-btn
               >
            </div>
         </v-card-text>
      </v-card>
   </v-scale-transition>
</template>

<script>
import * as routeController from '../../controllers/route';
import * as pokemonController from '../../controllers/pokemon';
import PokeSprite from './PokeSprite';
import PokemonType from './PokemonType';
import Button from '../Button';
import Icons from '../../constants/Icons';
import PartyState from '../../constants/PartyState';

export default {
   name: 'PokemonCard',
   components: {
      'c-poke-sprite': PokeSprite,
      'c-pokemon-type': PokemonType,
      'c-btn': Button,
   },
   props: {
      pokemon: { required: true },
   },
   data() {
      return {
         buttons: [
            {
               label: 'Evolve',
               color: 'primary',
               icon: Icons.CONTROLS.EVOLVE,
               action: this.clickEvolve,
               state: PartyState.PARTY,
            },
            {
               label: 'To Storage',
               icon: Icons.CONTROLS.STORAGE,
               action: this.clickStorage,
               state: PartyState.PARTY,
            },
            {
               label: 'To Graveyard',
               icon: Icons.CONTROLS.TOMBSTONE,
               action: this.clickGraveyard,
               state: PartyState.PARTY,
            },
            {
               label: 'To Party',
               icon: Icons.PAGES.POKEMON,
               action: this.clickParty,
               state: PartyState.PC,
            },
         ],
      };
   },
   methods: {
      // TODO can I keep these emits inside the card???
      clickEvolve() {
         this.$emit('click-evolve', this.pokemon);
      },
      clickStorage() {
         pokemonController.sendToStorage(this.pokemon);
      },
      clickGraveyard() {
         this.$emit('click-graveyard', this.pokemon);
      },
      clickParty() {
         pokemonController.sendToParty(this.pokemon);
      },
      canEvolve() {
         return this.pokemon.evolves_to.filter(e => e).length > 0;
      },
      canSendToPC() {
         return pokemonController.getPartyLength() !== 1;
      },
   },
   computed: {
      route() {
         return routeController.getRouteByPokemonId(this.pokemon.id);
      },
      currentButtons() {
         return this.buttons
            .filter(b => b.state === this.pokemon.party_state)
            .filter(b => (this.canSendToPC() ? true : b.label !== 'To Storage'))
            .filter(b => (this.canEvolve() ? true : b.label !== 'Evolve'));
      },
   },
};
</script>

<style></style>

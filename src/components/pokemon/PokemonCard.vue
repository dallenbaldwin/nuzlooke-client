<template>
   <v-scale-transition>
      <v-card
         min-width="350"
         max-width="350"
         elevation="1"
         outlined
         class="align-self-start ma-1"
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
                  @click="button.action"
                  :disabled="gameFinished"
                  >{{ button.label }}</c-btn
               >
            </div>
         </v-card-text>
         <c-dialog-wrapper v-model="graveyard">
            <c-graveyard-pokemon
               :pokemon="pokemon"
               v-on:close-dialog="closeDialog"
            ></c-graveyard-pokemon>
         </c-dialog-wrapper>
         <c-dialog-wrapper v-model="evolve">
            <c-evolve-pokemon
               :pokemon="pokemon"
               v-on:close-dialog="closeDialog"
            ></c-evolve-pokemon>
         </c-dialog-wrapper>
         <c-dialog-wrapper v-model="hasErrors" v-on:close-dialog="closeDialog">
            <c-error-card :errors="errors" v-on:close-dialog="closeDialog"></c-error-card>
         </c-dialog-wrapper>
      </v-card>
   </v-scale-transition>
</template>

<script>
import PokeSprite from './PokeSprite.vue';
import PokemonType from './PokemonType.vue';
import Button from '../Button.vue';
import Icons from '../../constants/Icons';
import PartyState from '../../constants/PartyState';
import { getRouteByPokemonId } from '../../controllers/route';
import {
   sendToStorage,
   sendToParty,
   getPartyLength,
   PARTY_MAX_SIZE,
} from '../../controllers/pokemon';
import GraveyardPokemonVue from './GraveyardPokemon.vue';
import EvolvePokemonVue from './EvolvePokemon.vue';
import ErrorCardVue from '../dialogs/ErrorCard.vue';
import DialogWrapperVue from '../dialogs/DialogWrapper.vue';

export default {
   name: 'PokemonCard',
   components: {
      'c-poke-sprite': PokeSprite,
      'c-pokemon-type': PokemonType,
      'c-btn': Button,
      'c-graveyard-pokemon': GraveyardPokemonVue,
      'c-evolve-pokemon': EvolvePokemonVue,
      'c-error-card': ErrorCardVue,
      'c-dialog-wrapper': DialogWrapperVue,
   },
   props: {
      pokemon: { required: true },
   },
   data() {
      return {
         errors: null,
         hasErrors: false,
         evolve: false,
         graveyard: false,
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
      closeDialog() {
         this.graveyard = false;
         this.evolve = false;
         this.hasErrors = false;
         this.errors = false;
      },
      clickEvolve() {
         this.evolve = true;
      },
      clickGraveyard() {
         this.graveyard = true;
      },
      async clickStorage() {
         let errors = await sendToStorage(this.pokemon);
         if (errors) {
            this.errors = errors;
            this.hasErrors = true;
         }
      },
      async clickParty() {
         let errors = await sendToParty(this.pokemon);
         if (errors) {
            this.errors = errors;
            this.hasErrors = true;
         }
      },
      canEvolve() {
         return this.pokemon.evolves_to.filter(e => e).length > 0;
      },
      canSendToPC() {
         return getPartyLength() !== 1;
      },
      canSendToParty() {
         return getPartyLength() !== PARTY_MAX_SIZE;
      },
   },
   computed: {
      gameFinished() {
         return this.$store.state.game.is_finished;
      },
      route() {
         return getRouteByPokemonId(this.pokemon.id);
      },
      currentButtons() {
         return this.buttons
            .filter(b => b.state === this.pokemon.party_state)
            .filter(b => (this.canSendToPC() ? true : b.label !== 'To Storage'))
            .filter(b => (this.canEvolve() ? true : b.label !== 'Evolve'))
            .filter(b => (this.canSendToParty() ? true : b.label !== 'To Party'));
      },
   },
};
</script>

<style></style>

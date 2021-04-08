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
         <v-dialog v-model="graveyardData.flag" width="500">
            <c-dialog-card
               :props="graveyardData.dialogCard"
               v-on:close-dialog="closeDialog"
               v-on:confirm-graveyard="confirmSendToGraveyard"
            >
               <v-slide-y-transition>
                  <c-progress-spinner v-show="processingPokemon"></c-progress-spinner>
               </v-slide-y-transition>
               <v-slide-y-transition>
                  <div v-show="!processingPokemon">
                     <c-text-field
                        v-model="graveyardData.faintedMessage"
                        :label="
                           `What happened to
               ${graveyardData.pokemon ? graveyardData.pokemon.nickname : ''}?`
                        "
                     ></c-text-field>
                  </div>
               </v-slide-y-transition>
            </c-dialog-card>
         </v-dialog>
         <v-dialog v-model="evolveData.flag" width="500">
            <c-dialog-card
               :props="evolveData.dialogCard"
               v-on:close-dialog="closeDialog"
               v-on:confirm-evolve="confirmEvolve"
            >
               <v-slide-y-transition>
                  <c-progress-spinner v-show="processingPokemon"></c-progress-spinner>
               </v-slide-y-transition>
               <v-slide-y-transition>
                  <div v-show="!processingPokemon">
                     <div class="text-body mb-3">
                        {{ evolveData.pokemon ? evolveData.pokemon.nickname : undefined }}
                        can evolve into one of the following Pokemon. Which one is it
                        evolving into?
                     </div>
                     <c-combobox
                        label="Evolution"
                        :items="evolutionPokemon"
                        v-model="evolveData.evolvesTo"
                     >
                     </c-combobox>
                  </div>
               </v-slide-y-transition>
            </c-dialog-card>
         </v-dialog>
      </v-card>
   </v-scale-transition>
</template>

<script>
import DialogCard from '../../components/DialogCard.vue';
import PokeSprite from './PokeSprite.vue';
import PokemonType from './PokemonType.vue';
import ProgressSpinner from '../../components/ProgressSpinner.vue';
import TextField from '../form-controls/TextField.vue';
import Button from '../Button.vue';
import Combobox from '../form-controls/Combobox.vue';
import Icons from '../../constants/Icons';
import PartyState from '../../constants/PartyState';
import * as routeController from '../../controllers/route';
import * as pokemonController from '../../controllers/pokemon';

export default {
   name: 'PokemonCard',
   components: {
      'c-poke-sprite': PokeSprite,
      'c-pokemon-type': PokemonType,
      'c-btn': Button,
      'c-dialog-card': DialogCard,
      'c-progress-spinner': ProgressSpinner,
      'c-text-field': TextField,
      'c-combobox': Combobox,
   },
   props: {
      pokemon: { required: true },
   },
   data() {
      return {
         processingPokemon: false,
         evolveData: {
            flag: false,
            pokemon: null,
            evolvesTo: null,
            dialogCard: {
               title: `Evolve ${this.pokemon.nickname}?`,
               text: `Are you sure you want to evolve ${this.pokemon.nickname}? This action cannot be undone!`,
               primaryBtn: {
                  color: 'primary',
                  icon: Icons.CONTROLS.EVOLVE,
                  text: 'Evolve',
                  action: 'confirm-evolve',
               },
            },
         },
         graveyardData: {
            flag: false,
            pokemon: null,
            faintedMessage: null,
            dialogCard: {
               title: `Send ${this.pokemon.nickname} to the Graveyard?`,
               text: `Are you sure you want to send ${this.pokemon.nickname} to the Graveyard? This action cannot be undone!`,
               primaryBtn: {
                  color: 'black',
                  icon: Icons.CONTROLS.TOMBSTONE,
                  text: 'Send to Graveyard',
                  action: 'confirm-graveyard',
               },
            },
         },
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
         this.graveyardData.pokemon = null;
         this.graveyardData.flag = false;
         this.evolveData.pokemon = null;
         this.evolveData.flag = false;
         this.processingPokemon = false;
      },
      clickEvolve() {
         this.evolveData.evolvesTo = null;
         this.evolveData.pokemon = this.pokemon;
         this.evolveData.flag = true;
      },
      async confirmEvolve() {
         this.processingPokemon = true;
         await pokemonController.evolvePokemon(
            this.evolveData.pokemon,
            this.evolveData.evolvesTo
         );
         this.closeDialog();
      },
      clickGraveyard() {
         this.graveyardData.pokemon = this.pokemon;
         this.graveyardData.flag = true;
      },
      async confirmSendToGraveyard() {
         this.processingPokemon = true;
         this.graveyardData.pokemon.fainted_message = this.graveyardData.faintedMessage;
         await pokemonController.sendToGraveyard(this.graveyardData.pokemon);
         this.closeDialog();
      },
      clickStorage() {
         pokemonController.sendToStorage(this.pokemon);
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
      canSendToParty() {
         return pokemonController.getPartyLength() !== pokemonController.PARTY_MAX_SIZE;
      },
   },
   computed: {
      gameFinished() {
         return this.$store.state.game.is_finished;
      },
      evolutionPokemon() {
         return this.evolveData.pokemon ? this.evolveData.pokemon.evolves_to : [];
      },
      route() {
         return routeController.getRouteByPokemonId(this.pokemon.id);
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

<template>
   <v-row>
      <v-expansion-panels multiple popout>
         <v-expansion-panel v-for="(state, i) of Object.values(PartyState)" :key="i">
            <v-expansion-panel-header disable-icon-rotate class="text-h6">
               {{ state }}
               <template v-slot:actions>
                  <v-badge
                     overlap
                     v-if="state !== PartyState.PARTY && getPanelCount(state)"
                     dark
                     color="grey"
                     :content="getPanelCount(state)"
                  >
                     <v-icon large dark>
                        {{ toPartyStateIcon(state) }}
                     </v-icon>
                  </v-badge>
                  <v-icon dark v-if="state !== PartyState.PARTY && !getPanelCount(state)">
                     {{ toPartyStateIcon(state) }}
                  </v-icon>
                  <div class="d-inline-flex flex-row" v-if="state === PartyState.PARTY">
                     <c-poke-sprite
                        v-for="(url, i) of partyIcons"
                        class="ml-1"
                        :key="i"
                        :src="url"
                        size="small"
                     ></c-poke-sprite>
                  </div>
               </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
               <v-container>
                  <v-row class="d-flex justify-center align-content flex-row mt-3">
                     <c-pokemon-card
                        v-for="pokemon of getPanelPokemon(state)"
                        :key="pokemon.id"
                        :pokemon="pokemon"
                        v-show="getFilter(pokemon)"
                     >
                     </c-pokemon-card>
                  </v-row>
               </v-container>
            </v-expansion-panel-content>
         </v-expansion-panel>
      </v-expansion-panels>
      <v-dialog v-model="filter.flag" width="500">
         <c-dialog-card :props="filter.dialogCard" v-on:close-dialog="closeDialog">
            <c-text-field
               label="Nickname"
               v-model="filter.values.nickname"
            ></c-text-field>
            <c-combobox
               label="Species"
               v-model="filter.values.species"
               :items="speciess"
               :multiple="true"
            ></c-combobox>
            <c-combobox
               label="Types"
               v-model="filter.values.types"
               :items="pokemonTypes"
               :multiple="true"
               :types="true"
            >
            </c-combobox>
         </c-dialog-card>
      </v-dialog>
   </v-row>
</template>

<script>
import DialogCard from '../components/DialogCard.vue';
import Combobox from '../components/form-controls/Combobox.vue';
import TextField from '../components/form-controls/TextField.vue';
import PokemonCard from '../components/pokemon/PokemonCard.vue';
import PokemonType from '../components/pokemon/PokemonType.vue';
import PokeSprite from '../components/pokemon/PokeSprite.vue';
import PokemonTypes from '../constants/PokemonTypes';
import * as gameController from '../controllers/game';
import * as pokemonController from '../controllers/pokemon';
import * as util from '../util/util';

export default {
   name: 'Pokemon',
   components: {
      'c-poke-sprite': PokeSprite,
      'c-pokemon-card': PokemonCard,
      'c-dialog-card': DialogCard,
      'c-text-field': TextField,
      'c-combobox': Combobox,
      'c-pokemon-type': PokemonType,
   },
   // TODO move speed dial actions into toolbar
   data() {
      return {
         filter: {
            flag: false,
            dialogCard: {
               title: 'Filter Pokemon',
               cancelBtn: { text: 'close' },
            },
            values: {
               nickname: null,
               types: null,
               species: null,
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
      partyIcons() {
         return gameController.getPartyIconUrls(this.game);
      },
      party() {
         return this.$store.state.game.pokemons.filter(p =>
            pokemonController.isParty(p.party_state)
         );
      },
      pc() {
         return this.$store.state.game.pokemons.filter(p =>
            pokemonController.isPC(p.party_state)
         );
      },
      graveyard() {
         return this.$store.state.game.pokemons.filter(p =>
            pokemonController.isGraveyard(p.party_state)
         );
      },
      speciess() {
         return this.game.pokemons.map(p => p.species);
      },
   },
   methods: {
      getPanelCount(partyState) {
         if (pokemonController.isPC(partyState)) return this.pc.length;
         else if (pokemonController.isGraveyard(partyState)) return this.graveyard.length;
      },
      toPartyStateIcon(partyState) {
         return pokemonController.getPartyStateIcon(partyState);
      },
      getPanelPokemon(partyState) {
         if (pokemonController.isParty(partyState)) return this.party;
         else if (pokemonController.isPC(partyState)) return this.pc;
         else if (pokemonController.isGraveyard(partyState)) return this.graveyard;
      },
      getFilter(pokemon) {
         const isNickname = util.likeOrUndefined(
            pokemon.nickname,
            this.filter.values.nickname
         );
         const isSpecies = util.includesOrEmptyArray(
            pokemon.species,
            this.filter.values.species
         );
         const isType = util.includesOrEmptyArray(
            pokemon.types,
            this.filter.values.types
         );
         return isNickname && isSpecies && isType;
      },
      openFilter() {
         // this is inherited from Game.vue
         this.filter.flag = true;
      },
      closeDialog() {
         this.filter.flag = false;
      },
   },
};
</script>

<style></style>

<template>
   <div>
      <v-row>
         <c-toolbar :filter="true" v-on:filter="filter.flag = !filter.flag">
            <c-sort :items="sort.items" v-on:set-sort="setSort"></c-sort>
         </c-toolbar>
      </v-row>
      <v-row>
         <v-expansion-panels multiple popout class="mt-1">
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
                     <v-icon
                        dark
                        v-else-if="state !== PartyState.PARTY && !getPanelCount(state)"
                     >
                        {{ toPartyStateIcon(state) }}
                     </v-icon>
                     <div
                        class="d-inline-flex flex-row"
                        v-else-if="state === PartyState.PARTY"
                     >
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
      </v-row>
      <c-dialog-wrapper v-model="filter.flag">
         <c-dialog-card :props="filter.dialogCard" v-on:close-dialog="closeDialog">
            <c-sort v-if="mobile()" :items="sort.items" v-on:set-sort="setSort"></c-sort>
            <c-checkbox
               :false-value="null"
               v-model="filter.values.canEvolve"
               label="Can Evolve"
            ></c-checkbox>
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
      </c-dialog-wrapper>
   </div>
</template>

<script>
import Button from '../components/Button.vue';
import DialogCard from '../components/dialogs/DialogCard.vue';
import DialogWrapperVue from '../components/dialogs/DialogWrapper.vue';
import Checkbox from '../components/form-controls/Checkbox.vue';
import Combobox from '../components/form-controls/Combobox.vue';
import Sort from '../components/form-controls/Sort.vue';
import TextField from '../components/form-controls/TextField.vue';
import PokemonCard from '../components/pokemon/PokemonCard.vue';
import PokemonType from '../components/pokemon/PokemonType.vue';
import PokeSprite from '../components/pokemon/PokeSprite.vue';
import Toolbar from '../components/Toolbar.vue';
import Icons from '../constants/Icons';
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
      'c-btn': Button,
      'c-toolbar': Toolbar,
      'c-sort': Sort,
      'c-checkbox': Checkbox,
      'c-dialog-wrapper': DialogWrapperVue,
   },
   data() {
      return {
         sort: {
            items: ['None', 'Nickname', 'Species'],
            map: {
               null: 'id',
               Nickname: 'nickname',
               Species: 'species',
            },
            values: {
               value: null,
               dir: null,
            },
         },
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
               canEvolve: null,
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
      setSort(payload) {
         let asc = payload.dir === 'asc';
         this.party.sort((a, b) => {
            let aVal = a[this.sort.map[payload.value]].toString().toLowerCase();
            let bVal = b[this.sort.map[payload.value]].toString().toLowerCase();
            if (aVal > bVal) return asc ? 1 : -1;
            if (aVal < bVal) return asc ? -1 : 1;
            return 0;
         });
         this.pc.sort((a, b) => {
            let aVal = a[this.sort.map[payload.value]].toString().toLowerCase();
            let bVal = b[this.sort.map[payload.value]].toString().toLowerCase();
            if (aVal > bVal) return asc ? 1 : -1;
            if (aVal < bVal) return asc ? -1 : 1;
            return 0;
         });
         this.graveyard.sort((a, b) => {
            let aVal = a[this.sort.map[payload.value]].toString().toLowerCase();
            let bVal = b[this.sort.map[payload.value]].toString().toLowerCase();
            if (aVal > bVal) return asc ? 1 : -1;
            if (aVal < bVal) return asc ? -1 : 1;
            return 0;
         });
         this.$forceUpdate();
      },
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
      canEvolve(pokemon) {
         return pokemon.evolves_to.filter(e => e).length > 0;
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
         const canEvolve = util.isOrUndefined(
            this.canEvolve(pokemon),
            this.filter.values.canEvolve
         );
         return isNickname && isSpecies && isType && canEvolve;
      },
      clickFilter() {
         // this is inherited from Game.vue and App.vue
         this.filter.flag = true;
      },
      closeDialog() {
         this.filter.flag = false;
      },
   },
   mounted() {
      this.setSort({ value: null, dir: 'asc' });
   },
};
</script>

<style></style>

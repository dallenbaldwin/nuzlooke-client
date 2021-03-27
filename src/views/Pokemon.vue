<template>
   <v-row>
      <v-expansion-panels popout class="mt-3">
         <v-expansion-panel v-for="(state, i) of Object.values(PartyState)" :key="i">
            <v-expansion-panel-header disable-icon-rotate class="text-h6">
               {{ state }}
               <template v-slot:actions>
                  <v-icon v-if="state !== PartyState.PARTY" dark>
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
               <v-container class="d-flex justify-center align-content flex-row">
                  <c-pokemon-card
                     v-for="pokemon of getPanelPokemon(state)"
                     :key="pokemon.id"
                     :pokemon="pokemon"
                  >
                  </c-pokemon-card>
               </v-container>
            </v-expansion-panel-content>
         </v-expansion-panel>
      </v-expansion-panels>
   </v-row>
</template>

<script>
import PokemonCard from '../components/PokemonCard.vue';
import PokeSprite from '../components/PokeSprite.vue';
import * as gameController from '../controllers/game.js';
import * as pokemonController from '../controllers/pokemon';

export default {
   name: 'Pokemon',
   components: {
      'c-poke-sprite': PokeSprite,
      'c-pokemon-card': PokemonCard,
   },
   data() {
      return {};
   },
   computed: {
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
   },
   methods: {
      // filterPokemon() {
      //    alert('i want to filter my pokemon!');
      // },
      toPartyStateIcon(partyState) {
         return pokemonController.getPartyStateIcon(partyState);
      },
      getPanelPokemon(partyState) {
         if (pokemonController.isParty(partyState)) return this.party;
         else if (pokemonController.isPC(partyState)) return this.pc;
         else if (pokemonController.isGraveyard(partyState)) return this.graveyard;
      },
   },
};
</script>

<style></style>

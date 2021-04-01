<template>
   <v-row>
      <v-expansion-panels popout>
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
               <v-container>
                  <v-row class="d-flex justify-center align-content flex-row mt-3">
                     <c-pokemon-card
                        v-for="pokemon of getPanelPokemon(state)"
                        :key="pokemon.id"
                        :pokemon="pokemon"
                        v-on:click-graveyard="clickGraveyard"
                        v-on:click-evolve="clickEvolve"
                     >
                     </c-pokemon-card>
                  </v-row>
               </v-container>
            </v-expansion-panel-content>
         </v-expansion-panel>
      </v-expansion-panels>
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
                  <v-text-field
                     :label="
                        `What happened to
               ${graveyardData.pokemon ? graveyardData.pokemon.nickname : ''}?`
                     "
                     clearable
                     outlined
                     v-model="graveyardData.faintedMessage"
                  >
                  </v-text-field>
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
                  <v-combobox
                     outlined
                     label="Evolution"
                     :items="evolutionPokemon"
                     v-model="evolveData.evolvesTo"
                  >
                  </v-combobox>
               </div>
            </v-slide-y-transition>
         </c-dialog-card>
      </v-dialog>
   </v-row>
</template>

<script>
import DialogCard from '../components/DialogCard.vue';
import PokemonCard from '../components/pokemon/PokemonCard.vue';
import PokeSprite from '../components/PokeSprite.vue';
import ProgressSpinner from '../components/ProgressSpinner.vue';
import Icons from '../constants/Icons';
import * as gameController from '../controllers/game.js';
import * as pokemonController from '../controllers/pokemon';

export default {
   name: 'Pokemon',
   components: {
      'c-poke-sprite': PokeSprite,
      'c-pokemon-card': PokemonCard,
      'c-dialog-card': DialogCard,
      'c-progress-spinner': ProgressSpinner,
   },
   data() {
      return {
         processingPokemon: false,
         evolveData: {
            flag: false,
            pokemon: null,
            evolvesTo: null,
            dialogCard: {
               title: 'Evolve?',
               text:
                  'Are you sure you want to evolve this Pokemon? This action cannot be undone!',
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
               title: 'Send to the Graveyard?',
               text:
                  'Are you sure you want to send your pokemon to the graveyard? This action cannot be undone!',
               primaryBtn: {
                  color: 'black',
                  icon: Icons.CONTROLS.TOMBSTONE,
                  text: 'Send to Graveyard',
                  action: 'confirm-graveyard',
               },
            },
         },
      };
   },
   computed: {
      evolutionPokemon() {
         return this.evolveData.pokemon ? this.evolveData.pokemon.evolves_to : [];
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
   },
   methods: {
      // filterPokemon() {
      //    alert('i want to filter my pokemon!');
      // },
      closeDialog() {
         this.graveyardData.pokemon = null;
         this.graveyardData.flag = false;
         this.evolveData.pokemon = null;
         this.evolveData.flag = false;
         this.processingPokemon = false;
      },
      toPartyStateIcon(partyState) {
         return pokemonController.getPartyStateIcon(partyState);
      },
      getPanelPokemon(partyState) {
         if (pokemonController.isParty(partyState)) return this.party;
         else if (pokemonController.isPC(partyState)) return this.pc;
         else if (pokemonController.isGraveyard(partyState)) return this.graveyard;
      },
      clickEvolve(pokemon) {
         this.evolveData.evolvesTo = null;
         this.evolveData.pokemon = pokemon;
         this.evolveData.dialogCard.title = `Evolve ${pokemon.nickname}?`;
         this.evolveData.dialogCard.text = `Are you sure you want to evolve ${pokemon.nickname}? This action cannot be undone!`;
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
      clickGraveyard(pokemon) {
         this.graveyardData.pokemon = pokemon;
         this.graveyardData.dialogCard.title = `Send ${pokemon.nickname} to the Graveyard?`;
         this.graveyardData.dialogCard.text = `Are you sure you want to send ${pokemon.nickname} to the Graveyard? This action cannot be undone!`;
         this.graveyardData.flag = true;
      },
      async confirmSendToGraveyard() {
         this.processingPokemon = true;
         this.graveyardData.pokemon.fainted_message = this.graveyardData.faintedMessage;
         await pokemonController.sendToGraveyard(this.graveyardData.pokemon);
         this.closeDialog();
      },
   },
};
</script>

<style></style>

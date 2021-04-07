<template>
   <v-lazy
      v-model="isActive"
      :options="{
         threshold: 0.5,
      }"
      transition="fade-transition"
   >
      <v-card min-width="300" max-width="300" elevation="1" outlined class="mt-1 mx-1">
         <div v-if="isAvailable">
            <v-card-title>{{ encounter.label }}</v-card-title>
            <v-card-subtitle>Available Pokemon</v-card-subtitle>
            <v-card-text v-if="isAvailable" class="d-inline-flex justify-end flex-wrap">
               <c-poke-sprite
                  class="mx-1 mt-1"
                  v-for="(pokemon, i) of encounter.pokemons"
                  :key="i"
                  :src="pokemon.icon_url"
                  size="small"
               ></c-poke-sprite>
            </v-card-text>
         </div>
         <div v-if="!isAvailable" class="d-inline-flex justify-start">
            <c-poke-sprite
               class="align-self-start mx-3 mt-3"
               :src="encounter.result.sprite_url"
               :outline-color="outLineColor"
            ></c-poke-sprite>
            <span>
               <v-card-title>{{ encounter.label }}</v-card-title>
               <v-card-subtitle
                  >{{ encounter.result.constant
                  }}{{
                     encounter.result.nickname ? `: ${encounter.result.nickname}` : ''
                  }}</v-card-subtitle
               >
            </span>
         </div>
         <v-card-actions class="pt-0 pb-0 mb-2">
            <v-spacer></v-spacer>
            <c-btn
               v-if="isAvailable"
               color="green"
               :icon="Icons.CONTROLS.EXCLAIM"
               :click="clickNewEncounter"
               :disabled="game.is_finished"
            >
               Encounter
            </c-btn>
            <c-btn
               v-if="!isAvailable"
               :click="clickResetEncounter"
               color="orange"
               :icon="Icons.CONTROLS.EXCLAIM"
               :disabled="game.is_finished"
            >
               Reset
            </c-btn>
         </v-card-actions>
         <v-dialog v-model="newEncounterDialog" width="500">
            <c-dialog-card
               :props="newEncounterDialogCard"
               v-on:close-dialog="closeDialog"
               v-on:new-encounter="confirmNewEncounter"
            >
               <v-slide-y-transition>
                  <div v-show="processingEncounter">
                     <c-progress-spinner></c-progress-spinner>
                  </div>
               </v-slide-y-transition>
               <v-slide-y-transition>
                  <div v-show="!processingEncounter">
                     <v-radio-group column v-model="newEncounter.result.constant">
                        <v-radio
                           v-for="(result, i) of Object.values(EncounterResultConst)"
                           :key="`${result}-${i}`"
                           :label="result"
                           :value="result"
                        ></v-radio>
                     </v-radio-group>
                     <c-combobox
                        v-model="newEncounter.result.species"
                        :items="newEncounter.pokemons"
                        label="Pokemon"
                        :disabled="
                           newEncounter.result.constant === EncounterResultConst.AVAILABLE
                        "
                     >
                     </c-combobox>
                     <c-text-field
                        v-model="newEncounter.result.nickname"
                        label="Nickname"
                        :disabled="
                           newEncounter.result.constant !== EncounterResultConst.CAUGHT
                        "
                     ></c-text-field>
                     <v-slide-y-transition>
                        <v-card elevation="0" v-show="showPartyManagerOptions">
                           <v-card-title>You have 6 Pokemon in your Party!</v-card-title>
                           <v-card-subtitle
                              >You can only keep up to 6 Pokemon in your Party. Would you
                              like to switch a current party member for
                              {{ newEncounter.result.nickname }}?</v-card-subtitle
                           >
                           <v-card-text>
                              <v-radio-group
                                 v-model="newEncounter.result.destination"
                                 row
                                 mandatory
                              >
                                 <v-radio
                                    :value="PartyState.PC"
                                    label="Send to Storage"
                                 ></v-radio>
                                 <v-radio
                                    :value="PartyState.PARTY"
                                    label="Send to Party"
                                 ></v-radio>
                              </v-radio-group>
                              <c-combobox
                                 label="Party Member"
                                 :items="partyPokemons"
                                 v-model="newEncounter.result.replacement"
                                 :disabled="
                                    newEncounter.result.destination === PartyState.PC
                                 "
                              >
                              </c-combobox>
                           </v-card-text>
                        </v-card>
                     </v-slide-y-transition>
                     <c-errors
                        v-for="(error, i) of newEncounter.errors"
                        :key="i"
                        :error="error"
                     >
                     </c-errors>
                  </div>
               </v-slide-y-transition>
            </c-dialog-card>
         </v-dialog>
         <v-dialog v-model="resetEncounterDialog" width="500">
            <c-dialog-card
               :props="resetEncounterDialogCard"
               v-on:close-dialog="closeDialog"
               v-on:reset-encounter="confirmResetEncounter"
            >
               <v-slide-y-transition>
                  <div v-show="processingEncounter">
                     <c-progress-spinner></c-progress-spinner>
                  </div>
               </v-slide-y-transition>
            </c-dialog-card>
         </v-dialog>
      </v-card>
   </v-lazy>
</template>

<script>
import PokeSprite from '../pokemon/PokeSprite.vue';
import Button from '../Button.vue';
import ProgressSpinner from '../../components/ProgressSpinner.vue';
import DialogCard from '../../components/DialogCard.vue';
import Errors from '../../components/Errors.vue';
import TextField from '../form-controls/TextField.vue';
import Combobox from '../form-controls/Combobox.vue';
import EncounterResultConst from '../../constants/EncounterResultConst';
import EncounterResult from '../../models/EncounterResult';
import PartyState from '../../constants/PartyState';
import * as pokemonController from '../../controllers/pokemon';
import * as routeController from '../../controllers/route';
import * as pokeapiController from '../../controllers/pokeapi';
import * as userController from '../../controllers/user';
import * as gameController from '../../controllers/game';
import * as util from '../../util/util';

export default {
   name: 'RouteCard',
   props: ['encounter'],
   components: {
      'c-poke-sprite': PokeSprite,
      'c-btn': Button,
      'c-dialog-card': DialogCard,
      'c-progress-spinner': ProgressSpinner,
      'c-errors': Errors,
      'c-text-field': TextField,
      'c-combobox': Combobox,
   },
   data() {
      return {
         isActive: false,
         processingEncounter: false,
         // new encounter
         newEncounter: {
            result: {
               constant: null,
               species: null,
               nickname: null,
               destination: null,
               replacement: null,
            },
            id: null,
            pokemons: null,
            label: null,
            errors: null,
         },
         newEncounterDialog: false,
         newEncounterDialogCard: {
            title: 'New Encounter',
            primaryBtn: { action: 'new-encounter' },
         },
         // reset encounter
         resetEncounterDialog: false,
         resetEncounter: null,
         resetEncounterDialogCard: {
            title: `Reset ${this.encounter.label}?`,
            text: `Are you sure you want to reset ${this.encounter.label}? Any associated Pokemon will be removed from your list. This action cannot be undone.`,
            primaryBtn: { action: 'reset-encounter', color: 'orange', text: 'Reset' },
         },
      };
   },
   watch: {
      newEncounter: {
         handler(newVal) {
            if (routeController.isFledFainted(newVal.result.constant)) {
               this.newEncounter.result.nickname = null;
            } else if (routeController.isAvailable(newVal.result.constant)) {
               this.newEncounter.result.nickname = null;
               this.newEncounter.result.species = null;
            }
            if (pokemonController.isPC(newVal.result.destination)) {
               this.newEncounter.result.replacement = null;
            }
         },
         deep: true,
      },
      showPartyManagerOptions(newVal) {
         if (newVal === false) {
            this.newEncounter.result.destination = null;
            this.newEncounter.result.replacement = null;
         }
      },
   },
   methods: {
      clickResetEncounter() {
         this.resetEncounter = this.encounter;
         this.resetEncounterDialog = true;
      },
      async confirmResetEncounter() {
         this.processingEncounter = true;
         let pokemon = pokemonController.getPokemonById(
            this.resetEncounter.result.pokemon_id
         );
         if (pokemon) pokemonController.removeFromList(pokemon);
         this.encounter.result.pokemon_id = null;
         this.encounter.result.species = null;
         this.encounter.result.constant = EncounterResultConst.AVAILABLE;
         this.encounter.result.sprite_url = null;
         this.encounter.result.nickname = null;
         routeController.updateEncounterInStore(this.encounter);
         await gameController.updateEncountersAndPokemonsInDB();
         userController.updateSnapshotPartyUrls(this.game.id);
         await userController.updateUserGames();
         this.closeDialog();
      },
      clickNewEncounter() {
         this.newEncounterDialogCard.title = this.encounter.label;
         this.newEncounter.label = this.encounter.label;
         this.newEncounter.pokemons = this.encounter.pokemons.map(p =>
            Object({ value: p.sprite_url, text: p.species })
         );
         this.newEncounter.id = this.encounter.id;
         this.newEncounter.result.constant = EncounterResultConst.AVAILABLE;
         this.newEncounter.result.species = null;
         this.newEncounter.result.destination = null;
         this.newEncounter.result.replacement = null;
         this.newEncounterDialog = true;
         this.newEncounter.errors = [];
      },
      async confirmNewEncounter() {
         // validate for data errors
         this.newEncounter.errors = routeController.getEncounterErrors(
            this.newEncounter.result
         );
         if (!util.isEmptyArray(this.newEncounter.errors)) return;
         // ignore when they confirm on available
         if (routeController.isAvailable(this.newEncounter.result.constant)) {
            this.closeDialog();
            return;
         }
         // start process
         this.processingEncounter = true;
         // set result
         this.encounter.result = EncounterResult.builder()
            .withNickname(this.newEncounter.result.nickname)
            .withSpecies(this.newEncounter.result.species.text)
            .withConstant(this.newEncounter.result.constant)
            .build();
         // pokeapi and set new user pokemon
         const newPokemon = await pokeapiController.buildUserPokemon(
            this.newEncounter.result.species.text,
            this.newEncounter.result.nickname,
            undefined
         );
         this.encounter.result.sprite_url = newPokemon.sprite_url;
         // handle capture situations
         if (routeController.isCaught(this.newEncounter.result.constant)) {
            this.encounter.result.pokemon_id = newPokemon.id;
            if (pokemonController.isParty(this.newEncounter.result.destination)) {
               newPokemon.party_state = PartyState.PARTY;
               const replacement = pokemonController.getPokemonById(
                  this.newEncounter.result.replacement.value
               );
               replacement.party_state = PartyState.PC;
               pokemonController.updatePokemonInStore(replacement);
            } else if (!this.showPartyManagerOptions) {
               newPokemon.party_state = PartyState.PARTY;
            } else {
               newPokemon.party_state = PartyState.PC;
            }
            pokemonController.pushNewPokemon(newPokemon);
         }
         routeController.updateEncounterInStore(this.encounter);
         await gameController.updateEncountersAndPokemonsInDB();
         userController.updateSnapshotPartyUrls(this.game.id);
         await userController.updateUserGames();
         this.closeDialog();
      },
      closeDialog() {
         this.newEncounterDialog = false;
         this.resetEncounterDialog = false;
         this.processingEncounter = false;
      },
   },
   computed: {
      game() {
         return this.$store.state.game;
      },
      partyPokemons() {
         return this.game.pokemons
            .filter(p => p.party_state === PartyState.PARTY)
            .map(p =>
               Object({
                  value: p.id,
                  text: p.species,
                  disabled: false,
               })
            );
      },
      partyIsFull() {
         return pokemonController.getPartyLength() === pokemonController.PARTY_MAX_SIZE;
      },
      showPartyManagerOptions() {
         const caught = routeController.isCaught(this.newEncounter.result.constant);
         return this.partyIsFull && caught;
      },
      isAvailable() {
         return this.encounter.result.constant === EncounterResultConst.AVAILABLE;
      },
      outLineColor() {
         if (this.encounter.result.constant === EncounterResultConst.CAUGHT)
            return 'green';
         if (this.encounter.result.constant === EncounterResultConst.FAINTED)
            return 'red';
         if (this.encounter.result.constant === EncounterResultConst.FLED)
            return 'orange';
      },
   },
};
</script>

<style></style>

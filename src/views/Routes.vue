<template>
   <v-row class="d-flex justify-center align-content flex-row">
      <c-route-card
         v-for="encounter of game.encounters"
         :key="encounter.label"
         :encounter="encounter"
         v-on:new-encounter="clickNewEncounter"
         v-on:edit-encounter="clickEditEncounter"
      ></c-route-card>
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
                  <v-combobox
                     v-model="newEncounter.result.species"
                     :items="newEncounter.pokemons"
                     label="Pokemon"
                     outlined
                     clearable
                     :disabled="
                        newEncounter.result.constant === EncounterResultConst.AVAILABLE
                     "
                  >
                  </v-combobox>
                  <v-text-field
                     label="Nickname"
                     v-model="newEncounter.result.nickname"
                     outlined
                     clearable
                     :disabled="
                        newEncounter.result.constant !== EncounterResultConst.CAUGHT
                     "
                  >
                  </v-text-field>
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
                           <v-combobox
                              label="Party Member"
                              outlined
                              clearable
                              :items="partyPokemons"
                              v-model="newEncounter.result.replacement"
                              :disabled="
                                 newEncounter.result.destination === PartyState.PC
                              "
                           >
                           </v-combobox>
                        </v-card-text>
                     </v-card>
                  </v-slide-y-transition>
                  <p v-for="error of newEncounter.errors" :key="error" class="red--text">
                     <strong>{{ error }}</strong>
                  </p>
               </div>
            </v-slide-y-transition>
         </c-dialog-card>
      </v-dialog>
      <!-- TODO this needs the party manager. might need to templatize?? -->
      <v-dialog v-model="editEncounterDialog" width="500">
         <c-dialog-card
            :props="editEncounterDialogCard"
            v-on:close-dialog="closeDialog"
            v-on:edit-encounter="confirmEditEncounter"
         >
            <v-slide-y-transition>
               <div v-show="processingEncounter">
                  <c-progress-spinner></c-progress-spinner>
               </div>
            </v-slide-y-transition>
            <v-slide-y-transition>
               <div v-if="!processingEncounter">
                  <v-radio-group column v-model="editEncounter.changes.constant">
                     <v-radio
                        v-for="(result, i) of Object.values(EncounterResultConst)"
                        :key="`${result}-${i}`"
                        :label="result"
                        :value="result"
                     ></v-radio>
                  </v-radio-group>
                  <v-combobox
                     v-model="editEncounter.changes.species"
                     :items="editEncounter.pokemons"
                     label="Pokemon"
                     outlined
                     clearable
                     :disabled="
                        editEncounter.changes.constant === EncounterResultConst.AVAILABLE
                     "
                  >
                  </v-combobox>
                  <v-text-field
                     label="Nickname"
                     v-model="editEncounter.changes.nickname"
                     outlined
                     clearable
                     :disabled="
                        editEncounter.changes.constant !== EncounterResultConst.CAUGHT
                     "
                  >
                  </v-text-field>
                  <v-slide-y-transition>
                     <v-card elevation="0" v-show="showEditWarning">
                        <v-card-title>Warning!</v-card-title>
                        <v-card-subtitle
                           >These changes <i>cannot</i> be undone. Disabled fields will be
                           reset for {{ this.editEncounter.label }}</v-card-subtitle
                        >
                        <v-card-text>
                           <v-switch
                              label="I understand"
                              v-model="editEncounter.changes.confirm"
                              color="warning"
                              inset
                           ></v-switch>
                        </v-card-text>
                     </v-card>
                  </v-slide-y-transition>
                  <p v-for="error of editEncounter.errors" :key="error" class="red--text">
                     <strong>{{ error }}</strong>
                  </p>
               </div>
            </v-slide-y-transition>
         </c-dialog-card>
      </v-dialog>
      <!-- <pre>{{ prettySON(game.encounters) }}</pre> -->
   </v-row>
</template>

<script>
import ProgressSpinner from '../components/ProgressSpinner.vue';
import RouteCard from '../components/RouteCard.vue';
import DialogCard from '../components/DialogCard.vue';
import EncounterResult from '../models/EncounterResult.js';
import EncounterResultConst from '../constants/EncounterResultConst.js';
import RuleCodes from '../constants/RuleCodes.js';
import PartyState from '../constants/PartyState.js';
import * as rulesController from '../controllers/rules.js';
import * as pokemonController from '../controllers/pokemon.js';
import * as routeController from '../controllers/route.js';
import * as pokeapiController from '../controllers/pokeapi.js';
import * as userController from '../controllers/user.js';
import * as gameController from '../controllers/game';
import * as util from '../util/util.js';

export default {
   name: 'Routes',
   components: {
      'c-dialog-card': DialogCard,
      'c-route-card': RouteCard,
      'c-progress-spinner': ProgressSpinner,
   },
   data() {
      return {
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
         // edit encounter
         editEncounter: {
            changes: {
               constant: null,
               species: null,
               nickname: null,
               confirm: null,
               destination: null,
               replacement: null,
            },
            originalValues: {
               pokemon_id: null,
               constant: null,
               species: null,
               nickname: null,
            },
            message: null,
            id: null,
            pokemons: null,
            label: null,
            errors: null,
         },
         editEncounterDialog: false,
         editEncounterDialogCard: {
            title: 'Edit Encounter',
            primaryBtn: { action: 'edit-encounter' },
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
   },
   computed: {
      game() {
         return this.$store.state.game;
      },
      userId() {
         return this.$store.state.userId;
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
      editConstantIsDifferent() {
         return (
            this.editEncounter.changes.constant !==
            this.editEncounter.originalValues.constant
         );
      },
      editSpeciesIsDifferent() {
         return (
            this.editEncounter.changes.species !==
            this.editEncounter.originalValues.species
         );
      },
      editNicknameIsDifferent() {
         return (
            this.editEncounter.changes.nickname !==
            this.editEncounter.originalValues.nickname
         );
      },
      showEditWarning() {
         return (
            this.editConstantIsDifferent ||
            this.editSpeciesIsDifferent ||
            this.editNicknameIsDifferent
         );
      },
      partyIsFull() {
         return pokemonController.getPartyLength() === PartyState.MAXSIZE;
      },
      showPartyManagerOptions() {
         const nickname =
            !util.isUndefined(this.newEncounter.result.nickname) ||
            !rulesController.isActive(RuleCodes.USE_NICKNAMES.code);
         const caught = routeController.isCaught(this.newEncounter.result.constant);
         const species = !util.isUndefined(this.newEncounter.result.species);
         return this.partyIsFull && nickname && caught && species;
      },
   },
   methods: {
      // filterRoutes() {
      //    alert('i want to filter my routes!');
      // },
      clickEditEncounter(payload) {
         this.editEncounterDialogCard.title = `Edit ${payload.label}?`;
         this.editEncounter.id = payload.id;
         this.editEncounter.label = payload.label;
         this.editEncounter.pokemons = payload.pokemons.map(p => p.species);
         this.editEncounter.changes.constant = payload.result.constant;
         this.editEncounter.changes.species = payload.result.species;
         this.editEncounter.changes.nickname = payload.result.nickname;
         this.editEncounter.originalValues.pokemon_id = payload.result.pokemon_id;
         this.editEncounter.originalValues.constant = payload.result.constant;
         this.editEncounter.originalValues.species = payload.result.species;
         this.editEncounter.originalValues.nickname = payload.result.nickname;
         this.editEncounter.changes.confirm = false;
         this.editEncounterDialog = true;
         this.editEncounter.errors = [];
      },
      async confirmEditEncounter() {
         // if (!confirm(util.prettySON(this.editEncounter))) return;
         if (this.showEditWarning) {
            if (!this.editEncounter.changes.confirm) return;
            // errors
            this.editEncounter.errors = routeController.getEncounterErrors(
               this.editEncounter.changes,
               true
            );
            if (!util.isEmptyArray(this.editEncounter.errors)) return;
            this.processingEncounter = true;
            // check for if it was originally caught
            let pokemon =
               pokemonController.getPokemonById(
                  this.editEncounter.originalValues.pokemon_id
               ) || {}; // TODO: remove this when the logic is fixed for changing to caught
            // was it originally caught and is no longer caught?
            if (
               routeController.isCaught(this.editEncounter.originalValues.constant) &&
               this.editConstantIsDifferent
            ) {
               pokemonController.removeFromList(pokemon);
            }
            // is it now caught and wasn't before or did we change the species?
            if (
               (routeController.isCaught(this.editEncounter.changes.constant) &&
                  this.editConstantIsDifferent) ||
               this.editSpeciesIsDifferent
            ) {
               // convert species string to object for buildUserPokemon
               this.editEncounter.changes.species = {
                  text: this.editEncounter.changes.species,
               };
               pokemon = await pokeapiController.buildUserPokemon(
                  this.editEncounter.changes
               );
            }
            // did the nickname change?
            if (this.editNicknameIsDifferent) {
               pokemon.nickname = this.editEncounter.changes.nickname;
            }
            if (
               routeController.isFledFainted(this.editEncounter.changes.constant) ||
               routeController.isAvailable(this.editEncounter.changes.constant)
            ) {
               pokemon.nickname = null;
            }
            const encounter = routeController.getEncounterById(this.editEncounter.id);
            encounter.result.species = pokemon.species;
            encounter.result.constant = this.editEncounter.changes.constant;
            encounter.result.sprite_url = pokemon.sprite_url;
            encounter.result.nickname = pokemon.nickname;
            routeController.updateEncounterById(encounter);
            await gameController.updateEncountersAndPokemons();
            userController.updateSnapshotPartyUrls(this.game.id);
            await userController.updateUserGames();
         }
         this.closeDialog();
      },
      clickNewEncounter(payload) {
         this.newEncounterDialogCard.title = payload.label;
         this.newEncounter.label = payload.label;
         this.newEncounter.pokemons = payload.pokemons.map(p =>
            Object({ value: p.sprite_url, text: p.species })
         );
         this.newEncounter.id = payload.id;
         this.newEncounter.result.constant = EncounterResultConst.AVAILABLE;
         this.newEncounter.result.species = null;
         this.newEncounter.result.destination = null;
         this.newEncounter.result.replacement = null;
         this.newEncounterDialog = true;
         this.newEncounter.errors = [];
      },
      async confirmNewEncounter() {
         // if (!confirm(this.prettySON(this.newEncounter))) return;
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
         const selectedEncounter = routeController.getEncounterById(this.newEncounter.id);
         // set result
         selectedEncounter.result = EncounterResult.builder()
            .withNickname(this.newEncounter.result.nickname)
            .withSpecies(this.newEncounter.result.species.text)
            .withConstant(this.newEncounter.result.constant)
            .build();
         // pokeapi and set new user pokemon
         const newPokemon = await pokeapiController.buildUserPokemon(
            this.newEncounter.result
         );
         selectedEncounter.result.sprite_url = newPokemon.sprite_url;
         // handle capture situations
         if (routeController.isCaught(this.newEncounter.result.constant)) {
            selectedEncounter.result.pokemon_id = newPokemon.id;
            if (pokemonController.isParty(this.newEncounter.result.destination)) {
               newPokemon.party_state = PartyState.PARTY;
               const replacement = pokemonController.getPokemonById(
                  this.newEncounter.result.replacement.value
               );
               replacement.party_state = PartyState.PC;
               pokemonController.updatePokemonById(replacement);
            } else {
               newPokemon.party_state = PartyState.PARTY;
            }
            pokemonController.pushNewPokemon(newPokemon);
         }
         routeController.updateEncounterById(selectedEncounter);
         await gameController.updateEncountersAndPokemons();
         userController.updateSnapshotPartyUrls(this.game.id);
         await userController.updateUserGames();
         this.closeDialog();
      },
      closeDialog() {
         this.newEncounterDialog = false;
         this.editEncounterDialog = false;
         this.processingEncounter = false;
      },
   },
};
</script>

<style></style>

<template>
   <v-row class="d-flex justify-center align-content flex-row">
      <c-route-card
         v-for="encounter of game.encounters"
         :key="encounter.label"
         :encounter="encounter"
         v-on:new-encounter="newEncounter"
         v-on:edit-encounter="editEncounter"
      ></c-route-card>
      <!-- FIXME: remove this when it's fully implemented -->
      <v-btn @click="() => (partyManagerDialog = true)">test party manager</v-btn>
      <v-dialog v-model="newEncounterDialog" width="500">
         <c-dialog-card
            :props="newEncounterDialogCard"
            v-on:close-dialog="closeDialog"
            v-on:new-encounter="confirmNewEncounter"
         >
            <v-radio-group column v-model="encounterData.result.constant">
               <v-radio
                  v-for="(result, i) of Object.values(EncounterResult)"
                  :key="`${result}-${i}`"
                  :label="result"
                  :value="result"
               ></v-radio>
            </v-radio-group>
            <v-combobox
               v-model="encounterData.result.species"
               :items="encounterData.pokemons"
               label="Pokemon"
               outlined
               clearable
               :disabled="encounterData.result.constant === EncounterResult.AVAILABLE"
            >
            </v-combobox>
            <v-text-field
               label="Nickname"
               v-model="encounterData.result.nickname"
               outlined
               clearable
               :disabled="encounterData.result.constant !== EncounterResult.CAUGHT"
            >
            </v-text-field>
            <p v-for="error of encounterData.errors" :key="error" class="red--text">
               <strong>{{ error }}</strong>
            </p>
         </c-dialog-card>
      </v-dialog>
      <v-dialog v-model="editEncounterDialog" width="500">
         <c-dialog-card
            :props="editEncounterDialogCard"
            v-on:close-dialog="closeDialog"
            v-on:edit-encounter="confirmEditEncounter"
         >
            <v-radio-group column v-model="encounterData.result.constant">
               <v-radio
                  v-for="(result, i) of Object.values(EncounterResult)"
                  :key="`${result}-${i}`"
                  :label="result"
                  :value="result"
               ></v-radio>
            </v-radio-group>
            <v-combobox
               v-model="encounterData.result.species"
               :items="encounterData.pokemons"
               label="Pokemon"
               outlined
               clearable
               :disabled="encounterData.result.constant === EncounterResult.AVAILABLE"
            >
            </v-combobox>
            <v-text-field
               label="Nickname"
               v-model="encounterData.result.nickname"
               outlined
               clearable
               :disabled="encounterData.result.constant !== EncounterResult.CAUGHT"
            >
            </v-text-field>
         </c-dialog-card>
      </v-dialog>
      <v-dialog v-model="partyManagerDialog" width="500" persistent>
         <c-dialog-card
            :props="partyManagerDialogCard"
            v-on:close-dialog="closeDialog"
            v-on:confirm-party-options="confirmPartyOptions"
         >
            <v-radio-group v-model="partyManagerData.decision" row mandatory>
               <v-radio value="storage" label="Send to Storage"></v-radio>
               <v-radio value="party" label="Send to Party"></v-radio>
            </v-radio-group>
            <v-combobox
               label="Party Member"
               outlined
               clearable
               :items="partyPokemons"
               v-model="partyManagerData.pokemon"
               :disabled="partyManagerData.decision === 'storage'"
            >
            </v-combobox>
         </c-dialog-card>
      </v-dialog>
      <pre>{{ prettySON(game.encounters) }}</pre>
   </v-row>
</template>

<script>
import DialogCard from '../components/DialogCard.vue';
import EncounterResult from '../constants/EncounterResult.js';
import RouteCard from '../components/RouteCard.vue';
import Icons from '../constants/Icons';
import RuleCodes from '../constants/RuleCodes.js';
import PartyState from '../constants/PartyState.js';
import * as rulesController from '../controllers/rules.js';
import * as pokemonController from '../controllers/pokemon.js';
import UserPokemon from '../models/UserPokemon.js';
import * as pokeapi from '../services/pokeapi.js';
import * as util from '../util/util.js';

export default {
   name: 'Routes',
   components: {
      'c-dialog-card': DialogCard,
      'c-route-card': RouteCard,
   },
   data() {
      return {
         // both encounter dialogs
         encounterData: {
            result: {
               constant: null,
               species: 'test',
               nickname: null,
            },
            pokemons: null,
            label: null,
            errors: [],
         },
         // new encounter
         newEncounterDialog: false,
         newEncounterDialogCard: {
            title: 'New Encounter',
            primaryBtn: { action: 'new-encounter' },
         },
         // edit encounter
         editEncounterDialog: false,
         editEncounterDialogCard: {
            title: 'Edit Encounter',
            primaryBtn: { action: 'edit-encounter' },
         },
         // party manager
         partyManagerDialog: false,
         partyManagerDialogCard: {
            title: 'You have 6 Pokemon in your Party!',
            text: `You can only keep up to 6 Pokemon in your Party. Would you like to switch a current party member for <insert nickname>?`,
            noCancel: true,
            primaryBtn: { action: 'confirm-party-options' },
            // cancelBtn: {
            //    icon: Icons.CONTROLS.STORAGE,
            //    action: 'to-storage',
            //    text: 'Send to Storage',
            // },
         },
         partyManagerData: {
            decision: null,
            pokemon: null,
            errors: null,
         },
      };
   },
   watch: {
      encounterData: {
         handler(newVal, oldVal) {
            if (
               newVal.result.constant === EncounterResult.FLED ||
               newVal.result.constant === EncounterResult.FAINTED
            ) {
               this.encounterData.result.nickname = null;
            } else if (newVal.result.constant === EncounterResult.AVAILABLE) {
               this.encounterData.result.nickname = null;
               this.encounterData.result.species = null;
            }
         },
         deep: true,
      },
      partyManagerData: {
         handler(newVal, oldVal) {
            if (newVal.decision === 'storage') {
               this.partyManagerData.pokemon = null;
            }
         },
         deep: true,
      },
   },
   computed: {
      game() {
         return this.$store.state.game;
      },
      partyPokemons() {
         return this.game.pokemons
            .filter(p => p.party_state === PartyState.PARTY)
            .map(p => Object({ value: p.id, text: p.species }));
      },
   },
   methods: {
      // filterRoutes() {
      //    alert('i want to filter my routes!');
      // },
      editEncounter(payload) {
         this.encounterData.label = payload.label;
         this.editEncounterDialogCard.title = `Edit ${payload.label}?`;
         this.encounterData.pokemons = payload.pokemons.map(p => p.species);
         this.encounterData.result.constant = payload.result.constant;
         this.encounterData.result.species = payload.result.species;
         this.encounterData.result.nickname = payload.result.nickname;
         this.editEncounterDialog = true;
      },
      confirmEditEncounter() {
         if (!confirm(this.prettySON(this.encounterData))) {
            return;
         }
         this.closeDialog();
      },
      newEncounter(payload) {
         this.newEncounterDialogCard.title = payload.label;
         this.encounterData.pokemons = payload.pokemons.map(p => p.species);
         this.encounterData.result.constant = EncounterResult.AVAILABLE;
         this.encounterData.result.species = 'test';
         this.newEncounterDialog = true;
         this.encounterData.errors = [];
      },
      manageParty(payload) {
         this.partyManagerDialog = true;
      },
      async confirmNewEncounter() {
         if (!confirm(util.prettySON(this.encounterData))) {
            return;
         }
         this.setEncounterErrors(this.encounterData.result);
         if (this.encounterData.errors.length > 0) {
            return;
         }
         if (this.encounterData.result.constant === EncounterResult.CAUGHT) {
            const pokeData = await pokeapi.getPokemonBySpecies(
               this.encounterData.result.species
            );
            const speciesData = await pokeapi.get(pokeData.species.url);
            const evoData = await pokeapi.get(speciesData.evolution_chain.url);
            const newPokemon = UserPokemon.builder()
               .withSpecies(pokeapi.normalizeKabob(pokeData.species.name))
               .withNickname(this.encounterData.result.nickname)
               .withSpritUrl(pokeData.sprites.front_default)
               .withIconUrl(
                  pokeData.sprites.versions['generation-vii'].icons.front_default
               )
               .withTypes(pokeData.types.map(t => pokeapi.normalizeKabob(t.type.name)))
               .withEvolvesTo(
                  evoData.chain.evolves_to.map(e =>
                     pokeapi.normalizeKabob(e.species.name)
                  )
               )
               .build();
            if (pokemonController.getPartyLength() < 6) {
               newPokemon.party_state = PartyState.PARTY;
            } else {
            }
         }
         /*

            if caught
               start loading spinner
               new UserPokemon(options)
               if pokemons.party.length < 6
                  UserPokemon.setParty()
               else
                  closeDialog
                  open Party Manager Dialog
                  if send to party
                     choose pokemon to go to storage
                     search pokemons for pokemon by id
                     ThatPokemon.setStorage()
                     update game.pokemons in store
                     UserPokemon.setParty()
                  else
                     UserPokemon.setStorage()
               push UserPokemon to game.pokemons in store
               search game.encounters by label
               update found encounter in store
               update game.pokemons in db with store
               update game.encounters in db with store
               stop spinner
            closeDialog
         */
         this.closeDialog();
      },
      confirmPartyOptions() {
         if (!confirm(util.prettySON(this.partyManagerData))) {
            return;
         }
         this.closeDialog();
      },
      closeDialog() {
         // encounter data
         this.newEncounterDialog = false;
         this.editEncounterDialog = false;
         this.partyManagerDialog = false;
      },
      setEncounterErrors(encounterResults) {
         this.encounterData.errors = [];
         if (encounterResults.constant === EncounterResult.CAUGHT) {
            if (
               rulesController.isActive(RuleCodes.USE_NICKNAMES.code) &&
               util.isUndefined(encounterResults.nickname)
            ) {
               this.encounterData.errors.push(
                  'You must give this captured Pokemon a nickname!'
               );
            }
            if (util.isUndefined(encounterResults.species)) {
               this.encounterData.errors.push(`You must select a Pokemon!`);
            }
         } else if (encounterResults.constant === EncounterResult.AVAILABLE) {
            if (!util.isUndefined(encounterResults.species)) {
               this.encounterData.errors.push(
                  `Something went wrong. Must be Fainted, Fled, or Caught, to have a Pokemon.`
               );
            }
            if (!util.isUndefined(encounterResults.nickname)) {
               this.encounterData.errors.push(
                  `Something went wrong. Must be Caught to have a nickname.`
               );
            }
         } else if (
            [EncounterResult.FAINTED, EncounterResult.FLED].includes(
               encounterResults.constant
            )
         ) {
            console.log('fainted or fled');
            if (!util.isUndefined(encounterResults.nickname)) {
               this.encounterData.errors.push(
                  `Something went wrong. Must be Caught to have a nickname.`
               );
            }
            if (util.isUndefined(encounterResults.species)) {
               console.log(encounterResults);
               this.encounterData.errors.push(`You must select a Pokemon!`);
            }
         }
      },
      getPartyManagerErrors(partyManagerData) {
         return true;
      },
   },
};
</script>

<style></style>

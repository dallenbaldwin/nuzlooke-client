<template>
   <v-row class="d-flex justify-center align-content flex-row">
      <c-route-card
         v-for="encounter of game.encounters"
         :key="encounter.label"
         :encounter="encounter"
         v-on:new-encounter="newEncounter"
         v-on:edit-encounter="editEncounter"
      ></c-route-card>
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
      <v-dialog v-model="partyManagerDialog" width="500"></v-dialog>
      <pre>{{ prettySON(game.encounters) }}</pre>
   </v-row>
</template>

<script>
import DialogCard from '../components/DialogCard.vue';
import EncounterResult from '../constants/EncounterResult.js';
import RouteCard from '../components/RouteCard.vue';
import Icons from '../constants/Icons';

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
               species: null,
               nickname: null,
            },
            pokemons: null,
            label: null,
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
            primaryBtn: { icon: Icons.PAGES.POKEMON, action: 'to-party' },
            cancelBtn: { icon: Icons.CONTROLS.STORAGE, action: 'to-storage' },
         },
      };
   },
   watch: {
      'encounterData.result.constant'(newVal, oldVal) {
         console.log(newVal);
         if (this.editEncounterDialog && newVal !== EncounterResult.CAUGHT) {
            this.encounterData.result.species = null;
            this.encounterData.result.nickname = null;
         }
      },
   },
   computed: {
      game() {
         return this.$store.state.game;
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
         this.encounterData.result.species = null;
         this.newEncounterDialog = true;
      },
      confirmNewEncounter() {
         if (!confirm(this.prettySON(this.encounterData))) {
            return;
         }
         /* 
            if !validate
               display some error text in dialog
               return
            if caught
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
               start loading spinner
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
      closeDialog() {
         this.newEncounterDialogCard.title = 'New Encounter';
         this.editEncounterDialogCard.title = 'Edit an Encounter?';
         // encounter data
         this.encounterData.label = null;
         this.encounterData.pokemons = [];
         this.encounterData.result = {};
         // encounter dialogs
         this.newEncounterDialog = false;
         this.editEncounterDialog = false;
      },
   },
};
</script>

<style></style>

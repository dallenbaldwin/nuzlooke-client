<template>
   <c-dialog-card
      :props="dialogCard"
      v-on:close-dialog="closeDialog"
      v-on:reset-encounter="resetEncounter"
   >
      <v-slide-y-transition>
         <div v-show="processing">
            <c-progress-spinner></c-progress-spinner>
         </div>
      </v-slide-y-transition>
      <v-dialog v-model="errors.hasErrors" width="500" @click:outside="closeError">
         <c-error-card
            :errors="errors.errors"
            :status="errors.status"
            v-on:close-dialog="closeError"
         ></c-error-card>
      </v-dialog>
   </c-dialog-card>
</template>

<script>
import ProgressSpinner from '../ProgressSpinner.vue';
import DialogCard from '../dialogs/DialogCard.vue';
import ErrorCard from '../dialogs/ErrorCard.vue';
import * as pokemonController from '../../controllers/pokemon';
import EncounterResultConst from '../../constants/EncounterResultConst';
import * as userController from '../../controllers/user';
import * as gameController from '../../controllers/game';
import * as routeController from '../../controllers/route';

export default {
   name: 'ResetEncounter',
   props: {
      encounter: { required: true },
   },
   components: {
      'c-dialog-card': DialogCard,
      'c-progress-spinner': ProgressSpinner,
      'c-error-card': ErrorCard,
   },
   data() {
      return {
         processing: false,
         errors: {
            errors: [],
            hasErrors: false,
         },
         dialogCard: {
            title: `Reset ${this.encounter.label}?`,
            text: `Are you sure you want to reset ${this.encounter.label}? Any associated Pokemon will be removed from your list. This action cannot be undone.`,
            primaryBtn: { action: 'reset-encounter', color: 'orange', text: 'Reset' },
         },
      };
   },
   methods: {
      closeDialog() {
         this.$emit('close-dialog');
      },
      async resetEncounter() {
         this.processing = true;
         // TODO can i put this into a controller?
         let pokemon = pokemonController.getPokemonById(this.encounter.result.pokemon_id);
         if (pokemon) pokemonController.removeFromList(pokemon);
         this.encounter.result.pokemon_id = null;
         this.encounter.result.species = null;
         this.encounter.result.constant = EncounterResultConst.AVAILABLE;
         this.encounter.result.sprite_url = null;
         this.encounter.result.nickname = null;
         routeController.updateEncounterInStore(this.encounter);
         const updatePERequest = await gameController.updateEncountersAndPokemonsInDB();
         if (updatePERequest) {
            this.errors.hasErrors = true;
            this.errors.errors.push(...updatePERequest.error);
            this.errors.status = updatePERequest.status;
            return;
         }
         userController.updateSnapshotPartyUrls(this.game.id);
         const updateUGResponse = await userController.updateUserGames();
         if (updateUGResponse) {
            this.errors.hasErrors = true;
            this.errors.errors.push(...updateUGResponse.error);
            this.errors.status = updateUGResponse.status;
            return;
         }
         this.closeDialog();
      },
      closeError() {
         this.processing = false;
         this.errors.errors = [];
         this.errors.hasErrors = false;
         this.errors.status = null;
      },
   },
   computed: {
      game() {
         return this.$store.state.game;
      },
   },
};
</script>

<style></style>

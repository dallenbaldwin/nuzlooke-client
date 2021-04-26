<template>
   <c-dialog-card
      :props="dialogCard"
      v-on:close-dialog="closeDialog"
      v-on:delete-game="confirmDelete"
   >
      <v-fade-transition>
         <c-progress-spinner v-show="processingGame"></c-progress-spinner>
      </v-fade-transition>
      <c-error-messages
         :errors="errors"
         :full-width="true"
         v-if="hasErrors"
      ></c-error-messages>
   </c-dialog-card>
</template>

<script>
import { deleteExistingGame } from '../../controllers/game';
import DialogCardVue from '../dialogs/DialogCard.vue';
import ErrorsMessagesVue from '../ErrorMessages.vue';
import ProgressSpinnerVue from '../ProgressSpinner.vue';

export default {
   name: 'DeleteGame',
   components: {
      'c-dialog-card': DialogCardVue,
      'c-progress-spinner': ProgressSpinnerVue,
      'c-error-messages': ErrorsMessagesVue,
   },
   props: { game: { required: true } },
   data() {
      return {
         processingGame: false,
         dialogCard: {
            title: `Delete ${this.game.label}?`,
            text: 'This action cannot be undone. Are you sure you want to continue?',
            secondaryBtn: {
               action: 'delete-game',
            },
         },
         errors: null,
         hasErrors: false,
      };
   },
   computed: {},
   methods: {
      closeDialog() {
         this.errors = null;
         this.hasErrors = false;
         this.processingGame = false;
         this.$emit('close-dialog');
      },
      async confirmDelete() {
         this.processingGame = true;
         const errors = await deleteExistingGame(this.game.game_id);
         if (errors) {
            this.processingGame = false;
            this.hasErrors = true;
            this.errors = errors;
            return;
         }
         this.closeDialog();
      },
   },
};
</script>

<style></style>

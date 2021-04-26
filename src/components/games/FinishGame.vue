<template>
   <c-dialog-card
      :props="dialogCard"
      v-on:close-dialog="closeDialog"
      v-on:finish-game="confirmFinish"
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
import { finishGame } from '../../controllers/game';
import DialogCardVue from '../dialogs/DialogCard.vue';
import ErrorMessagesVue from '../ErrorMessages.vue';
import ProgressSpinnerVue from '../ProgressSpinner.vue';

export default {
   name: 'FinishGame',
   components: {
      'c-progress-spinner': ProgressSpinnerVue,
      'c-dialog-card': DialogCardVue,
      'c-error-messages': ErrorMessagesVue,
   },
   props: { game: { required: true } },
   data() {
      return {
         processingGame: false,
         dialogCard: {
            title: `Finish ${this.game.label}?`,
            text: `This action cannot be undone. The game will enter a Read-Only state, where most functions will be disabled. Are you sure you want to continue?`,
            primaryBtn: {
               text: 'Finish Game',
               action: 'finish-game',
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
         this.processingGame = false;
         this.$emit('close-dialog');
      },
      async confirmFinish() {
         this.processingGame = true;
         const errors = await finishGame(this.game.game_id);
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

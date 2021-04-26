<template>
   <c-dialog-card
      :props="dialogCard"
      v-on:close-dialog="closeDialog"
      v-on:finish-game="confirmFinish"
   >
      <v-fade-transition>
         <c-progress-spinner v-show="processingGame"></c-progress-spinner>
      </v-fade-transition>
      <c-errors :errors="errors" :full-width="true" v-if="errors"></c-errors>
   </c-dialog-card>
</template>

<script>
import { finishGame } from '../../controllers/game';
import DialogCardVue from '../dialogs/DialogCard.vue';
import ErrorsVue from '../Errors.vue';
import ProgressSpinnerVue from '../ProgressSpinner.vue';

export default {
   name: 'FinishGame',
   components: {
      'c-progress-spinner': ProgressSpinnerVue,
      'c-dialog-card': DialogCardVue,
      'c-errors': ErrorsVue,
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
      };
   },
   computed: {},
   methods: {
      closeDialog() {
         this.processingGame = false;
         this.$emit('close-dialog');
      },
      async confirmFinish() {
         this.processingGame = true;
         const errors = await finishGame(this.game.game_id);
         if (errors) {
            this.processingGame = false;
            this.errors = errors;
            return;
         }
         this.closeDialog();
      },
   },
};
</script>

<style></style>

<template>
   <c-dialog-card
      :finished="gameFinished"
      :props="dialogCard"
      v-on:confirm-delete="confirmDelete"
      v-on:close-dialog="closeDialog"
   >
      <v-slide-y-transition>
         <c-progress-spinner v-show="processing"></c-progress-spinner>
      </v-slide-y-transition>
      <c-error-messages
         v-if="hasErrors"
         :full-width="true"
         :errors="errors"
      ></c-error-messages>
   </c-dialog-card>
</template>

<script>
import DialogCardVue from '../dialogs/DialogCard.vue';
import ProgressSpinnerVue from '../ProgressSpinner.vue';
import { deleteRule } from '../../controllers/rules';
import Icons from '../../constants/Icons';
import ErrorMessagesVue from '../ErrorMessages.vue';

export default {
   name: 'DeleteRule',
   components: {
      'c-dialog-card': DialogCardVue,
      'c-progress-spinner': ProgressSpinnerVue,
      'c-error-messages': ErrorMessagesVue,
   },
   props: {
      rule: { required: true },
   },
   data() {
      return {
         errors: null,
         hasErrors: false,
         processing: false,
         dialogCard: {
            title: `Delete ${this.rule.label}?`,
            text: `This action cannot be undone. Are you sure you want to continue?`,
            primaryBtn: {
               color: 'red',
               icon: Icons.CONTROLS.DELETE,
               text: 'delete',
               action: 'confirm-delete',
            },
         },
      };
   },
   computed: {
      gameFinished() {
         return this.$store.state.game.is_finished;
      },
   },
   methods: {
      closeDialog() {
         this.errors = null;
         this.hasErrors = false;
         this.processing = false;
         this.$emit('close-dialog');
      },
      async confirmDelete() {
         this.processing = true;
         let errors = await deleteRule(this.rule);
         if (errors) {
            this.processing = false;
            this.errors = errors;
            this.hasErrors = true;
            return;
         }
         this.closeDialog();
      },
   },
};
</script>

<style></style>

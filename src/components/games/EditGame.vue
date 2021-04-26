<template>
   <c-dialog-card
      :props="dialogCard"
      v-on:close-dialog="closeDialog"
      v-on:edit-game="confirmEdit"
   >
      <v-fade-transition>
         <c-progress-spinner v-show="processingGame"></c-progress-spinner>
      </v-fade-transition>
      <v-fade-transition>
         <div v-show="!processingGame">
            <c-text-field label="Name" v-model="values.label"></c-text-field>
            <c-error-messages
               :full-width="true"
               v-if="hasErrors"
               :errors="errors"
            ></c-error-messages>
         </div>
      </v-fade-transition>
   </c-dialog-card>
</template>

<script>
import { getValidationErrors, updateGameLabel } from '../../controllers/game';
import { isUndefined } from '../../util/util';
import DialogCardVue from '../dialogs/DialogCard.vue';
import ErrorMessagesVue from '../ErrorMessages.vue';
import TextFieldVue from '../form-controls/TextField.vue';
import ProgressSpinnerVue from '../ProgressSpinner.vue';

export default {
   name: 'EditGame',
   components: {
      'c-error-messages': ErrorMessagesVue,
      'c-progress-spinner': ProgressSpinnerVue,
      'c-text-field': TextFieldVue,
      'c-dialog-card': DialogCardVue,
   },
   props: { game: { required: true } },
   data() {
      return {
         processingGame: false,
         values: {
            label: null,
         },
         dialogCard: {
            title: `Edit ${this.game.label}?`,
            text: `Edit settings for ${this.game.label}`,
            primaryBtn: {
               action: 'edit-game',
            },
         },
         errors: null,
         hasErrors: false,
      };
   },
   computed: {},
   methods: {
      closeDialog() {
         this.processingGame = false;
         this.errors = null;
         this.hasErrors = false;
         if (isUndefined(this.values.label)) this.values.label = this.game.label;
         this.$emit('close-dialog');
      },
      async confirmEdit() {
         let errors = getValidationErrors(this.values, true);
         if (this.errors) {
            this.hasErrors = true;
            this.errors = errors;
            return;
         }
         this.processingGame = true;
         errors = await updateGameLabel(this.game.game_id, this.values.label);
         if (errors) {
            this.hasErrors = true;
            this.errors = errors;
            this.processingGame = false;
            return;
         }
         this.closeDialog();
      },
   },
   mounted() {
      this.values.label = this.game.label;
   },
};
</script>

<style></style>

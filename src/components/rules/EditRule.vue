<template>
   <c-dialog-card
      :finished="gameFinished"
      :props="dialogCard"
      v-on:confirm-edit="confirmEdit"
      v-on:close-dialog="closeDialog"
   >
      <v-slide-y-transition>
         <c-progress-spinner v-show="processing"></c-progress-spinner>
      </v-slide-y-transition>
      <v-slide-y-transition>
         <div v-show="!processing">
            <div class="d-flex align-center justify-center">
               <v-chip
                  @click="values.useStock = !values.useStock"
                  label
                  outlined
                  :color="values.useStock ? 'primary' : null"
                  class="mx-3 mb-6"
                  >Use Pre-defined Rule</v-chip
               >
               <v-chip
                  @click="values.useStock = !values.useStock"
                  label
                  outlined
                  :color="values.useStock ? null : 'primary'"
                  class="mx-3 mb-6"
                  >Use Custom Rule</v-chip
               >
            </div>
            <c-combobox
               :disabled="!values.useStock"
               :items="defaultRules"
               label="Pre-defined Rules"
               v-model="values.stock"
            ></c-combobox>
            <c-text-field
               :disabled="values.useStock"
               label="Name"
               v-model="values.label"
            ></c-text-field>
            <c-text-area
               :disabled="values.useStock"
               label="Description"
               v-model="values.description"
            ></c-text-area>
            <c-error-messages
               v-if="hasErrors"
               :full-width="true"
               :errors="errors"
            ></c-error-messages>
         </div>
      </v-slide-y-transition>
   </c-dialog-card>
</template>

<script>
import DialogCardVue from '../dialogs/DialogCard.vue';
import TextAreaVue from '../form-controls/TextArea.vue';
import TextFieldVue from '../form-controls/TextField.vue';
import ProgressSpinnerVue from '../ProgressSpinner.vue';
import ComboboxVue from '../form-controls/Combobox.vue';
import { getValidationErrors, updateRule } from '../../controllers/rules';
import GameRules from '../../constants/GameRules';
import ErrorMessagesVue from '../ErrorMessages.vue';

export default {
   name: 'EditRule',
   components: {
      'c-error-messages': ErrorMessagesVue,
      'c-text-area': TextAreaVue,
      'c-text-field': TextFieldVue,
      'c-dialog-card': DialogCardVue,
      'c-progress-spinner': ProgressSpinnerVue,
      'c-combobox': ComboboxVue,
   },
   props: {
      rule: { required: true },
   },
   data() {
      return {
         processing: false,
         dialogCard: {
            title: `Edit ${this.rule.label}?`,
            primaryBtn: {
               text: 'save',
               action: 'confirm-edit',
            },
         },
         errors: null,
         hasErrors: false,
         values: {
            isUpdate: true,
            useStock: false,
            label: null,
            description: null,
            stock: {},
         },
      };
   },
   computed: {
      defaultRules() {
         return Object.values(GameRules).map(gr =>
            Object({ text: gr.label, value: gr.id })
         );
      },
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
      async confirmEdit() {
         let errors = getValidationErrors(this.values);
         if (errors) {
            this.errors = errors;
            this.hasErrors = true;
            return;
         }
         this.processing = true;
         this.values.oldId = this.rule.id;
         this.values.oldLabel = this.rule.label;
         errors = await updateRule(this.values);
         if (errors) {
            this.processing = false;
            this.errors = errors;
            this.hasErrors = true;
            return;
         }
         this.closeDialog();
      },
   },
   mounted() {
      if (this.rule.id === 0) {
         this.values.useStock = false;
         this.values.label = this.rule.label;
         this.values.description = this.rule.description;
         this.values.stock = null;
      } else {
         this.values.useStock = true;
         this.values.stock = {
            text: this.rule.label,
            value: this.rule.id,
         };
      }
   },
};
</script>

<style></style>

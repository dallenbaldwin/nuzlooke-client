<template>
   <c-dialog-card
      :props="dialogCard"
      v-on:create-rule="confirmCreateRule"
      v-on:close-dialog="closeDialog"
   >
      <v-slide-y-transition>
         <c-progress-spinner v-show="processingRule"></c-progress-spinner>
      </v-slide-y-transition>
      <v-slide-y-transition>
         <div v-show="!processingRule">
            <div class="d-flex align-center justify-center">
               <v-chip
                  @click="values.useStock = !values.useStock"
                  label
                  outlined
                  :color="values.useStock ? 'primary' : null"
                  class="ma-1"
                  :class="mobile() ? 'text-caption' : ''"
                  >Use Pre-defined</v-chip
               >
               <v-chip
                  @click="values.useStock = !values.useStock"
                  label
                  outlined
                  :color="values.useStock ? null : 'primary'"
                  class="ma-1"
                  :class="mobile() ? 'text-caption' : ''"
                  >Use Custom</v-chip
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
         </div>
      </v-slide-y-transition>
      <v-dialog width="500" v-model="errors.hasErrors" @click:outside="closeError">
         <c-error-card
            v-on:close-dialog="closeError"
            :errors="errors.errors"
            :status="errors.status"
         ></c-error-card>
      </v-dialog>
   </c-dialog-card>
</template>

<script>
import DialogCard from '../dialogs/DialogCard.vue';
import Combobox from '../form-controls/Combobox.vue';
import TextField from '../form-controls/TextField.vue';
import TextArea from '../form-controls/TextArea.vue';
import ProgressSpinner from '../ProgressSpinner.vue';
import Errors from '../Errors.vue';
import ErrorCard from '../dialogs/ErrorCard.vue';
import Button from '../Button.vue';
import * as rulesController from '../../controllers/rules';
import GameRules from '../../constants/GameRules';

export default {
   name: 'CreateRule',
   props: {},
   components: {
      'c-combobox': Combobox,
      'c-progress-spinner': ProgressSpinner,
      'c-text-area': TextArea,
      'c-error': Errors,
      'c-btn': Button,
      'c-text-field': TextField,
      'c-dialog-card': DialogCard,
      'c-error-card': ErrorCard,
   },
   data() {
      return {
         processingRule: false,
         dialogCard: {
            title: 'Create a Rule',
            text: `Rules are the most important part of any Nuzlocke. Pick a pre-defined rule or make your own rule with a memorable name and description.`,
            primaryBtn: {
               action: 'create-rule',
            },
         },
         errors: {
            status: null,
            errors: [],
            hasErrors: false,
         },
         values: {
            label: null,
            description: null,
            stock: null,
            useStock: true,
         },
      };
   },
   computed: {
      defaultRules() {
         return Object.values(GameRules).map(gr =>
            Object({ text: gr.label, value: gr.id })
         );
      },
   },
   methods: {
      closeDialog() {
         this.processingRule = false;
         this.values.label = null;
         this.values.description = null;
         this.values.stock = null;
         this.closeError();
         this.$emit('close-dialog');
      },
      async confirmCreateRule() {
         this.errors = rulesController.getValidationErrors(this.values);
         if (this.errors.hasErrors) return;
         this.processingRule = true;
         const response = await rulesController.createNewRule(this.values);
         if (response) {
            this.errors.errors.push(...response.error);
            this.errors.status = response.status;
            this.errors.hasErrors = true;
            return;
         }
         this.closeDialog();
      },
      closeError() {
         this.processingRule = false;
         this.errors.errors = [];
         this.errors.status = null;
         this.errors.hasErrors = false;
      },
   },
};
</script>

<style></style>

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
      <c-errors :errors="errors" v-if="hasErrors" :full-width="true"></c-errors>
   </c-dialog-card>
</template>

<script>
import DialogCard from '../dialogs/DialogCard.vue';
import Combobox from '../form-controls/Combobox.vue';
import TextField from '../form-controls/TextField.vue';
import TextArea from '../form-controls/TextArea.vue';
import ProgressSpinner from '../ProgressSpinner.vue';
import Errors from '../Errors.vue';
import Button from '../Button.vue';
import { createNewRule, getValidationErrors } from '../../controllers/rules';
import GameRules from '../../constants/GameRules';

export default {
   name: 'CreateRule',
   props: {},
   components: {
      'c-combobox': Combobox,
      'c-progress-spinner': ProgressSpinner,
      'c-text-area': TextArea,
      'c-errors': Errors,
      'c-btn': Button,
      'c-text-field': TextField,
      'c-dialog-card': DialogCard,
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
         errors: null,
         hasErrors: false,
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
         this.errors = null;
         this.hasErrors = false;
         this.processingRule = false;
         this.values.label = null;
         this.values.description = null;
         this.values.stock = null;
         this.$emit('close-dialog');
      },
      async confirmCreateRule() {
         let errors = getValidationErrors(this.values);
         if (errors) {
            this.errors = errors;
            this.hasErrors = true;
            return;
         }
         this.processingRule = true;
         errors = await createNewRule(this.values);
         if (errors) {
            this.processingRule = false;
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

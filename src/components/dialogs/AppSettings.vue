<template>
   <c-dialog-card
      :props="dialogCard"
      v-on:save-settings="saveSettings"
      v-on:close-dialog="closeDialog"
   >
      <v-fade-transition>
         <c-progress-spinner v-show="processing"></c-progress-spinner>
      </v-fade-transition>
      <v-fade-transition>
         <div v-show="!processing">
            <c-text-field label="Username" v-model="values.username"></c-text-field>
            <!-- I'm not going to implement this until i can get to work in a not hacky way -->
            <!-- <v-checkbox
               label="Save Filters"
               v-model="saveFilters"
               class="ma-3"
            ></v-checkbox> -->
            <c-errors v-if="hasErrors" :full-width="true" :errors="errors"></c-errors>
         </div>
      </v-fade-transition>
   </c-dialog-card>
</template>

<script>
import DialogCard from './DialogCard.vue';
import Errors from '../Errors.vue';
import TextField from '../form-controls/TextField.vue';
import ProgressSpinner from '../ProgressSpinner.vue';
import { getValidationErrors, saveSettings } from '../../controllers/application';

export default {
   name: 'AppSettings',
   components: {
      'c-dialog-card': DialogCard,
      'c-text-field': TextField,
      'c-errors': Errors,
      'c-progress-spinner': ProgressSpinner,
   },
   props: {},
   data() {
      return {
         processing: false,
         hasErrors: false,
         errors: null,
         dialogCard: {
            title: 'Application Settings',
            text: 'Edit application settings',
            primaryBtn: {
               action: 'save-settings',
            },
         },
         values: {
            username: null,
         },
      };
   },
   methods: {
      closeDialog() {
         this.errors = null;
         this.hasErrors = false;
         this.processing = false;
         this.$emit('close-dialog');
      },
      async saveSettings() {
         // validate settings
         let errors = getValidationErrors(this.values);
         if (errors) {
            this.errors = errors;
            this.hasErrors = true;
            return;
         }
         // save settings
         this.processing = true;
         errors = await saveSettings(this.values);
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
      this.values.username = this.$store.state.username;
   },
};
</script>

<style></style>

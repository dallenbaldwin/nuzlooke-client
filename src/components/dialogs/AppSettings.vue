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
            <c-error
               v-for="(error, i) of errors.errors"
               :key="i"
               :error="error"
            ></c-error>
         </div>
      </v-fade-transition>
   </c-dialog-card>
</template>

<script>
import DialogCard from './DialogCard.vue';
import Errors from '../Errors.vue';
import TextField from '../form-controls/TextField.vue';
import ProgressSpinner from '../ProgressSpinner.vue';
import * as appController from '../../controllers/application';

export default {
   name: 'AppSettings',
   components: {
      'c-dialog-card': DialogCard,
      'c-text-field': TextField,
      'c-error': Errors,
      'c-progress-spinner': ProgressSpinner,
   },
   props: {},
   data() {
      return {
         processing: false,
         errors: {
            errors: [],
            hasErrors: null,
         },
         dialogCard: {
            title: 'Application Settings',
            text: 'Edit application settings',
            primaryBtn: {
               action: 'save-settings',
            },
         },
      };
   },
   computed: {
      username() {
         return this.$store.state.username;
      },
      values() {
         return Object({
            username: this.username,
         });
      },
   },
   methods: {
      closeDialog() {
         this.errors = {};
         this.processing = false;
         this.$emit('close-dialog');
      },
      async saveSettings() {
         // validate settings
         this.errors = appController.getValidationErrors(this.values);
         if (this.errors.hasErrors) return;
         // save settings
         this.processing = true;
         await appController.saveSettings(this.values);
         this.closeDialog();
      },
   },
};
</script>

<style></style>

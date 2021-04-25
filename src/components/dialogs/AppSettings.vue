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
            <c-text-field label="Username" v-model="username"></c-text-field>
            <!-- I'm not going to implement this until i can get to work in a not hacky way -->
            <!-- <v-checkbox
               label="Save Filters"
               v-model="saveFilters"
               class="ma-3"
            ></v-checkbox> -->
            <c-errors :errors="errors"></c-errors>
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
      'c-errors': Errors,
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
      username: {
         get() {
            return this.$store.state.username;
         },
         set(newVal) {
            this.$store.commit('setUsername', newVal);
         },
      },
      saveFilters: {
         get() {
            return this.$store.state.app_settings.save_filters;
         },
         set(newVal) {
            this.$store.commit('setSaveFilters', newVal);
         },
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
         this.errors = appController.getValidationErrors({
            username: this.username,
         });
         if (this.errors.hasErrors) return;
         // save settings
         this.processing = true;
         await appController.saveSettings();
         this.closeDialog();
      },
   },
};
</script>

<style></style>

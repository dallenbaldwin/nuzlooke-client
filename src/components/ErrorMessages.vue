<template>
   <div class="ma-3">
      <v-alert
         v-for="(error, i) of errorMessages"
         :key="i"
         :max-width="width"
         text
         dense
         type="error"
         class="text-wrap"
      >
         {{ status ? `Status ${status}: ${error}` : error }}
      </v-alert>
   </div>
</template>

<script>
import { mobile } from '../util/util';

export default {
   name: 'ErrorsMessages',
   props: {
      errors: { required: true },
      'full-width': { required: false, default: false },
   },
   data() {
      return {};
   },
   computed: {
      width() {
         if (mobile()) return null;
         else if (this.fullWidth) return null;
         else return 262;
      },
      status() {
         if (this.errors && this.errors.status) return this.errors.status;
      },
      errorMessages() {
         if (this.errors && this.errors.errors) return this.errors.errors;
      },
   },
};
</script>

<style></style>

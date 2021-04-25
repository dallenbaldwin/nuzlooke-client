<template>
   <div class="ma-3">
      <v-fade-transition group key="i">
         <v-alert
            v-for="(error, i) of errorMessages"
            :key="i"
            :max-width="width"
            text
            dense
            type="error"
            class="text-wrap"
         >
            {{ error }}
         </v-alert>
      </v-fade-transition>
   </div>
</template>

<script>
import { mobile } from '../util/util';

export default {
   name: 'Errors',
   props: {
      errors: { required: true },
      'max-width': { required: false, default: 900 },
   },
   computed: {
      errorMessages() {
         if (this.errors && this.errors.errors) return this.errors.errors;
      },
      width() {
         if (this['max-width']) return this['max-width'];
         else if (mobile()) return null;
         else return 262;
      },
   },
};
</script>

<style></style>

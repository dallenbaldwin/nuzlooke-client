<template>
   <c-dialog-card :props="dialogCard" v-on:close-dialog="closeDialog">
      <div class="ma-3">
         This is awkward... Try again.
      </div>
      <div class="ma-3">
         If the error(s) persists, note the error(s) and what you were doing when they
         happened. Then contact our support team so we can look into the issue
      </div>
      <c-errors :full-width="true" :errors="errorsErrors"></c-errors>
   </c-dialog-card>
</template>

<script>
import ErrorsVue from '../Errors.vue';
import DialogCard from './DialogCard.vue';

export default {
   name: 'ErrorCard',
   components: {
      'c-dialog-card': DialogCard,
      'c-errors': ErrorsVue,
   },
   props: {
      errors: { required: true },
   },
   data() {
      return {
         dialogCard: {
            title: `Error`,
            cancelBtn: {
               text: 'close',
            },
         },
         errorsErrors: null,
      };
   },
   methods: {
      closeDialog() {
         this.errorsErrors = null;
         this.$emit('close-dialog');
      },
      async setErrorsErrors() {
         return new Promise(resolve => {
            this.errorsErrors = this.errors;
            resolve(true);
         });
      },
   },
   async mounted() {
      // I have to do this to get Vue to slow down enough to pass the prop value down...
      await this.setErrorsErrors();
   },
};
</script>

<style></style>

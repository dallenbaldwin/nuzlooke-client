<template>
   <c-dialog-card :props="dialogCard" v-on:close-dialog="closeDialog">
      <div class="ma-3">
         This is awkward... Try again.
      </div>
      <div class="ma-3">
         If the error(s) persists, note the error(s) and what you were doing when they
         happened. Then contact our support team so we can look into the issue
      </div>
      <c-error-messages :full-width="true" :errors="errors"></c-error-messages>
   </c-dialog-card>
</template>

<script>
import ErrorsMessagesVue from '../ErrorMessages.vue';
import DialogCard from './DialogCard.vue';

export default {
   name: 'ErrorCard',
   components: {
      'c-dialog-card': DialogCard,
      'c-error-messages': ErrorsMessagesVue,
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
      };
   },
   methods: {
      closeDialog() {
         this.$emit('close-dialog');
      },
   },
};
</script>

<style></style>

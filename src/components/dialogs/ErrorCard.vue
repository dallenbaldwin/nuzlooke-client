<template>
   <c-dialog-card :props="dialogCard" v-on:close-dialog="$emit('close-dialog')">
      <div class="ma-3">
         This is awkward... Try again.
      </div>
      <div class="ma-3">
         If the error(s) persists, note the error(s) and what you were doing when they
         happened. Then contact our support team so we can look into the issue',
      </div>
      <c-error v-for="(error, i) of errors" :key="i" :error="error"></c-error>
   </c-dialog-card>
</template>

<script>
import Errors from '../Errors.vue';
import DialogCard from './DialogCard.vue';

export default {
   name: 'ErrorCard',
   components: {
      'c-dialog-card': DialogCard,
      'c-error': Errors,
   },
   props: {
      errors: { required: true },
      status: { required: false, default: null },
   },
   data() {
      return {};
   },
   computed: {
      dialogCard() {
         return {
            title: `Error${this.status ? ' ' + this.status : ''}`,
            cancelBtn: {
               text: 'close',
            },
         };
      },
   },
};
</script>

<style></style>

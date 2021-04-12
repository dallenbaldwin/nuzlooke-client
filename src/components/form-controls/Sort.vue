<template>
   <div class="d-flex align-center">
      <c-combobox
         :clearable="false"
         :items="items"
         label="Sort"
         v-model="currentValue"
         @input="sendSort"
      ></c-combobox>
      <c-btn
         :disabled="currentValue === 'None'"
         :isIcon="true"
         :icon="sortDir ? Icons.CONTROLS.SORTDOWN : Icons.CONTROLS.SORTUP"
         color="primary"
         @click="clickSort"
      ></c-btn>
   </div>
</template>

<script>
import Button from '../Button.vue';
import Combobox from './Combobox.vue';

export default {
   name: 'Sort',
   props: {
      items: { required: true },
   },
   components: {
      'c-btn': Button,
      'c-combobox': Combobox,
   },
   computed: {},
   data() {
      return {
         sortDir: null,
         currentValue: this.items[0],
      };
   },
   methods: {
      clickSort() {
         this.sortDir = !this.sortDir;
         this.sendSort();
      },
      sendSort() {
         this.$emit('set-sort', {
            value: this.currentValue === 'None' ? null : this.currentValue,
            dir: this.sortDir ? 'desc' : 'asc',
         });
      },
   },
};
</script>

<style></style>

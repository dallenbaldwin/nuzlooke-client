<template>
   <v-toolbar v-if="!mobile()">
      <c-btn
         v-if="add"
         @click="$emit('add')"
         :icon="Icons.CONTROLS.ADD"
         color="success"
         >{{ addLabel }}</c-btn
      >
      <c-btn
         v-if="filter"
         @click="$emit('filter')"
         :icon="Icons.CONTROLS.FILTER"
         color="primary"
         >filter</c-btn
      >
      <v-spacer></v-spacer>
      <v-toolbar-items class="d-flex align-center">
         <slot></slot>
      </v-toolbar-items>
      <c-btn
         v-if="sort"
         :disabled="sortValue === 'None'"
         :isIcon="true"
         :icon="sortDir ? Icons.CONTROLS.SORTDOWN : Icons.CONTROLS.SORTUP"
         color="primary"
         @click="clickSort"
      ></c-btn>
   </v-toolbar>
</template>

<script>
import Button from './Button.vue';
import Combobox from './form-controls/Combobox.vue';

export default {
   name: 'Toolbar',
   components: {
      'c-btn': Button,
      'c-combobox': Combobox,
   },
   props: {
      add: { required: false, default: false },
      'add-label': { required: false, default: '' },
      'sort-value': { requird: false, default: 'None' },
      sort: { required: false, default: true },
      filter: { required: false, default: false },
   },
   data() {
      return {
         sortDir: null,
      };
   },
   methods: {
      clickSort() {
         this.sortDir = !this.sortDir;
         this.$emit('click-sort-dir', {
            dir: this.sortDir ? 'desc' : 'asc',
         });
      },
   },
};
</script>

<style></style>

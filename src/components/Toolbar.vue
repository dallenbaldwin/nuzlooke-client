<template>
   <v-toolbar v-if="!mobile()">
      <slot></slot>
      <v-spacer></v-spacer>
      <c-btn
         v-if="add"
         @click="$emit('add')"
         :icon="Icons.CONTROLS.PLUS"
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
   </v-toolbar>
</template>

<script>
import Button from './Button.vue';

export default {
   name: 'Toolbar',
   components: {
      'c-btn': Button,
   },
   props: {
      'add-label': { required: false, default: '' },
      'filter-label': { required: false, default: '' },
      filter: { required: false, default: false },
      add: { required: false, default: false },
   },
   data() {
      return {};
   },
};
</script>

<style></style>

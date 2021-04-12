<template>
   <v-toolbar v-if="!mobile()">
      <c-btn
         :disabled="gameFinished"
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
      add: { required: false, default: false },
      'add-label': { required: false, default: '' },
      filter: { required: false, default: false },
   },
   data() {
      return {};
   },
   computed: {
      game() {
         return this.$store.state.game;
      },
      gameFinished() {
         return this.game ? this.game.is_finished : false;
      },
   },
   methods: {},
};
</script>

<style></style>

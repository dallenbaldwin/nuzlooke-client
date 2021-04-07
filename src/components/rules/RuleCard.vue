<template>
   <v-card max-width="300">
      <v-card-title>{{ label }}</v-card-title>
      <v-card-text>{{ description }}</v-card-text>
      <v-card-actions>
         <v-spacer></v-spacer>
         <c-btn :click="clickEditRule" color="orange" :icon="Icons.CONTROLS.EDIT"
            >Edit</c-btn
         >
      </v-card-actions>
   </v-card>
</template>

<script>
import { prettySON } from '../../util/util';
import Button from '../Button.vue';

export default {
   name: 'RuleCard',
   components: {
      'c-btn': Button,
   },
   props: {
      gameRule: { required: true },
   },
   data() {
      return {
         label: this.gameRule.label,
         description: this.gameRule.description,
      };
   },
   methods: {
      clickEditRule() {
         alert(`I want to edit this rule! \n${prettySON(this.gameRule)}`);
      },
   },
};
</script>

<style></style>

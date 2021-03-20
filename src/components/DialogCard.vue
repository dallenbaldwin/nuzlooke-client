<template>
   <v-card>
      <v-card-title class="headline grey lighten-2">
         {{ props.title }}
         <v-spacer></v-spacer>
         <v-btn v-if="props.deleteBtn" text @click="action(props.deleteBtn.action)">
            <v-icon color="red">mdi-minus-circle</v-icon>Delete Game
         </v-btn>
      </v-card-title>

      <v-card-text>
         <div v-if="props.text" class="mt-3 mb-3">{{ props.text }}</div>
         <slot></slot>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn v-if="props.successBtn" text @click="action(props.successBtn.action)">
            <v-icon color="success">{{
               props.successBtn.icon || 'mdi-check-circle'
            }}</v-icon>
            {{ props.successBtn.text || 'Confirm' }}
         </v-btn>
         <v-btn v-if="props.dangerBtn" text @click="action(props.dangerBtn.action)">
            <v-icon color="red">{{ props.dangerBtn.icon || 'mdi-minus-circle' }}</v-icon>
            {{ props.dangerBtn.text || 'Delete' }}
         </v-btn>
         <v-btn text @click="close">
            <v-icon dark>mdi-close-circle</v-icon>
            {{ props.cancelBtn ? props.cancelBtn.text : 'Cancel' }}
         </v-btn>
      </v-card-actions>
   </v-card>
</template>

<script>
// TODO: use icon constants
export default {
   name: 'DialogCard',
   props: ['props'],
   data() {
      return {};
   },
   methods: {
      action(action) {
         this.$emit(action);
      },
      close() {
         this.$emit('close-dialog');
      },
   },
};
</script>

<style></style>

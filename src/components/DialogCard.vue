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
         <div class="mt-3">{{ props.text }}</div>
         <slot></slot>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn text @click="action(props.confirmBtn.action)">
            <v-icon color="success">{{
               props.confirmBtn.icon || 'mdi-check-circle'
            }}</v-icon>
            Start
         </v-btn>
         <v-btn text @click="close">
            <v-icon dark>mdi-close-circle</v-icon>
            Cancel
         </v-btn>
      </v-card-actions>
   </v-card>
</template>

<script>
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

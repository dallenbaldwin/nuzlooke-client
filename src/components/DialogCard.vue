<template>
   <v-card>
      <v-card-title class="headline grey lighten-2">
         {{ props.title }}
      </v-card-title>

      <v-card-text>
         {{ props.details }}
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn text @click="action(props.btn.action)">
            <v-icon color="success">{{ props.btn.icon || 'mdi-check-circle' }}</v-icon>
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
         if (action === 'startGame') this.startGame();
      },
      close() {
         this.$emit('close-dialog');
      },
      startGame() {
         alert('starting a game with...');
         this.$emit('close-dialog');
      },
   },
};
</script>

<style></style>

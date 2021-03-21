<template>
   <v-card>
      <v-card-title class="headline grey lighten-2"> {{ props.title }}</v-card-title>

      <v-card-text>
         <div v-if="props.text" class="mt-3 mb-3">{{ props.text }}</div>
         <slot></slot>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn v-if="props.primaryBtn" text @click="action(primaryBtn.action)">
            <v-icon
               :dark="primaryBtn.color === 'dark'"
               :color="primaryBtn.color || 'success'"
            >
               {{ primaryBtn.icon || Icons.CONTROLS.CONFIRM }}
            </v-icon>
            {{ primaryBtn.text || 'Confirm' }}
         </v-btn>
         <v-btn v-if="props.secondaryBtn" text @click="action(secondaryBtn.action)">
            <v-icon
               :dark="secondaryBtn.color === 'dark'"
               :color="secondaryBtn.color || 'red'"
            >
               {{ secondaryBtn.icon || Icons.CONTROLS.DELETE }}
            </v-icon>
            {{ secondaryBtn.text || 'Delete' }}
         </v-btn>
         <v-btn v-if="!props.noCancel" text @click="close">
            <v-icon :dark="!props.cancelBtn" :color="cancelBtn.color || undefined">
               {{ cancelBtn.icon || Icons.CONTROLS.CLOSE }}
            </v-icon>
            {{ cancelBtn.text || 'Cancel' }}
         </v-btn>
      </v-card-actions>
   </v-card>
</template>

<script>
export default {
   name: 'DialogCard',
   props: ['props'],
   data() {
      return {
         primaryBtn: this.props.primaryBtn ? this.props.primaryBtn : {},
         secondaryBtn: this.props.secondaryBtn ? this.props.secondaryBtn : {},
         cancelBtn: this.props.cancelBtn ? this.props.cancelBtn : {},
      };
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

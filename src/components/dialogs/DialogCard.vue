<template>
   <v-card outlined>
      <v-card-title v-if="!finished" class="headline grey lighten-2 mb-3">
         {{ props.title }}</v-card-title
      >
      <v-card-title v-if="finished" class="headline grey lighten-2 mb-3"
         >This Game is Finished!</v-card-title
      >
      <v-card-text>
         <div v-if="props.text && !finished" class="mb-3">{{ props.text }}</div>
         <div v-if="finished" class="mb-3">
            This action is not available for finished games.
         </div>
         <slot></slot>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
         <v-spacer></v-spacer>
         <!-- these buttons are too involved to use the custom button -->
         <v-btn v-if="props.primaryBtn" text @click="action(primaryBtn.action)">
            <v-icon
               class="mr-1"
               :dark="primaryBtn.color === 'dark'"
               :color="primaryBtn.color || 'success'"
            >
               {{ primaryBtn.icon || Icons.CONTROLS.CONFIRM }}
            </v-icon>
            {{ primaryBtn.text || 'Confirm' }}
         </v-btn>
         <v-btn v-if="props.secondaryBtn" text @click="action(secondaryBtn.action)">
            <v-icon
               class="mr-1"
               :dark="secondaryBtn.color === 'dark'"
               :color="secondaryBtn.color || 'red'"
            >
               {{ secondaryBtn.icon || Icons.CONTROLS.DELETE }}
            </v-icon>
            {{ secondaryBtn.text || 'Delete' }}
         </v-btn>
         <v-btn v-if="!props.noCancel" text @click="close">
            <v-icon
               class="mr-1"
               :dark="!props.cancelBtn"
               :color="cancelBtn.color || undefined"
            >
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
   props: {
      props: {
         required: false,
         default() {
            return {};
         },
      },
      finished: { required: false, default: false },
   },
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

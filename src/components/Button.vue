<template>
   <v-btn text @click="$emit('click', $event)" :disabled="disabled">
      <v-icon :color="color" dark>{{ icon }}</v-icon>
      <span class="ml-1">
         <slot></slot>
      </span>
   </v-btn>
</template>

<script>
export default {
   name: 'Button',
   props: {
      color: { default: undefined },
      icon: { required: true },
      disabled: { required: false, default: false },
   },
};
</script>

<style></style>

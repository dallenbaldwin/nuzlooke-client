<template>
   <v-btn text @click="click">
      <v-icon :color="color" dark>{{ icon }}</v-icon>
      <span class="ml-1">
         <slot></slot>
      </span>
   </v-btn>
</template>

<script>
// TODO replace relevant buttons with this component
export default {
   name: 'Button',
   props: {
      color: { default: undefined },
      icon: { required: true },
      click: { required: true },
   },
};
</script>

<style></style>

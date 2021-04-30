<template>
   <div>
      <v-img
         contain
         :alt="alt"
         :src="src"
         aspect-ratio="3/2"
         :max-width="maxWidth"
         :lazy-src="Icons.MISC.NUZLOOKE"
         position="center left"
      ></v-img>
   </div>
</template>

<script>
export default {
   name: 'ResourceImage',
   props: {
      alt: { required: true },
      src: { required: true },
      'max-width': { required: true },
   },
   data() {
      return {};
   },
   computed: {},
   methods: {},
};
</script>

<style></style>

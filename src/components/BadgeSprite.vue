<template>
   <div class="c-circle">
      <v-img class="c-icon" position="center center" :lazy-src="src" :src="src" contain>
      </v-img>
   </div>
</template>

<script>
export default {
   name: 'BadgeSprite',
   props: ['src'],
   data() {
      return {};
   },
};
</script>

<style scoped>
.c-icon {
   transform: scale(0.8, 0.8);
}
.c-circle {
   border-radius: 50%;
   border-color: black;
   width: 40px;
   height: 40px;
   border-width: 2px;
   border-style: solid;
   /* stolen from v-btn */
   box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%),
      0px 1px 18px 0px rgb(0 0 0 / 12%);
}
</style>

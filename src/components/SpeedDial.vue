<template>
   <div>
      <div v-if="false" class="v-btn--floating float-right">
         {{ username }}
         <v-btn fab x-small color="orange" dark>
            <v-icon>mdi-pencil</v-icon>
         </v-btn>
      </div>
      <v-speed-dial
         open-on-hover
         top
         right
         direction="bottom"
         transition="scale-transition"
      >
         <template v-slot:activator>
            <v-btn dark fab x-large @click.prevent.stop><v-icon>mdi-menu</v-icon></v-btn>
         </template>
         <v-btn
            fab
            v-for="link of links"
            :key="link.label"
            :dark="link.dark"
            @click="linkActions(link)"
            class="mb-5"
            :color="link.color ? link.color : undefined"
         >
            <v-icon>{{ link.icon }}</v-icon>
            <div class="c-fab-bottom-text">{{ link.label }}</div>
         </v-btn>
      </v-speed-dial>
   </div>
</template>

<script>
export default {
   name: 'SpeedDial',
   data() {
      return {};
   },
   props: {
      links: Array,
   },
   methods: {
      linkActions(link) {
         if (link.action) this.$emit(link.action);
         if (link.route) this.navigate({ name: link.route });
      },
   },
   computed: {
      isLoggedIn() {
         return this.$store.state.isLoggedIn;
      },
      username() {
         return this.$store.state.username;
      },
   },
};
</script>

<style scoped>
.v-speed-dial {
   position: absolute;
   z-index: 1000;
}

.v-btn--floating {
   position: relative;
}

.c-fab-bottom-text {
   position: absolute;
   top: 35px;
   color: #272727;
   padding: 10px;
}
</style>

<template>
   <v-container>
      <v-row
         ><v-col>
            <div class="mt-6 text-h2 text-center">Nuzlooke</div>
            <div class="mt-6 text-h4 text-center">A Nuzlocke Manager</div>
            <v-divider class="mt-6 mx-auto" inset></v-divider>
            <div class="mt-6 text-center">
               <v-btn x-large @click="navigate('login')">
                  Sign In
                  <v-icon large class="ml-3">mdi-login</v-icon>
               </v-btn>
            </div>
            <div class="mt-6 text-center">
               <v-btn x-large @click="navigate('register')"
                  >Register
                  <v-icon large class="ml-3">mdi-account</v-icon>
               </v-btn>
            </div>
            <v-divider class="mt-6 mx-auto" inset></v-divider> </v-col
      ></v-row>
   </v-container>
</template>

<script>
export default {
   name: 'Home',
   data() {
      return {
         username: null,
      };
   },
   methods: {
      navigate(endpoint) {
         this.$router.push({ name: endpoint });
      },
   },
};
</script>

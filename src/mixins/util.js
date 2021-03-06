export default {
   methods: {
      navigate(endpoint) {
         this.$router.push(endpoint);
      },
      getRouteInfo() {
         return {
            name: this.$route.name,
            path: this.$route.path,
            params: this.$route.params,
         };
      },
      logout() {
         this.$store.commit('exitGame');
         this.$store.commit('logout');
      },
      login() {
         // FIXME: this is a dummy method to test the store
         this.$store.commit('login', { username: 'dallen.baldwin' });
         this.navigate({ name: 'games' });
      },
   },
};

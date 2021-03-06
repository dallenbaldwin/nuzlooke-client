export default {
   methods: {
      navigate(endpoint = { name: '', params: {} }) {
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
         alert('i want to logout!');
      },
   },
};

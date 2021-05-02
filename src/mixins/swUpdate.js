export default {
   data() {
      return {
         refreshing: false,
         registration: null,
         updateExists: false,
      };
   },
   created() {
      document.addEventListener('swUpdated', this.updateAvailable, { once: true });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
         if (this.refreshing) return;
         this.refreshing = true;
         // reload here
         window.location.reload();
      });
   },
   methods: {
      // store sw registration to send it a message
      // use updateExists to control notification
      updateAvailable(event) {
         this.registration = event.detail;
         this.updateExists = true;
      },
      // call when user accepts update
      refreshApp() {
         this.updateExists = false;
         // only send 'skip waiting' message if sw is waiting
         if (!this.registration || !this.registration.waiting) return;
         // send message to sw to skip waiting and activate new sw
         this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      },
   },
};

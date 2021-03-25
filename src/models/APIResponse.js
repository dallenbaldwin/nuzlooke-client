export default class APIResponse {
   constructor(response) {
      this.status = response.status;
      this.data = response.data.data || undefined;
      this.error = response.data.error ? response.data.error.stack : undefined;
   }
}

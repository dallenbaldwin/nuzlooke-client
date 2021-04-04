export default class APIResponse {
   constructor(response) {
      this.status = response.status;
      this.data = response.data ? response.data.data : undefined;
      this.error = response.data ? response.data.error : undefined;
   }
}

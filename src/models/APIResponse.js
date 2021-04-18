export default class APIResponse {
   constructor(status, data, error) {
      this.status = status;
      this.data = data;
      this.error = error;
   }
   static builder() {
      this.status = undefined;
      this.data = undefined;
      this.error = undefined;
      return this;
   }
   static withStatus(val) {
      this.status = val;
      return this;
   }
   static withData(val) {
      this.data = val;
      return this;
   }
   static withError(val) {
      this.error = val;
      return this;
   }
   static build() {
      return new APIResponse(this.status, this.data, this.error);
   }
   // TODO better error handling throughout app. don't just alert the errors
   static fromResponse(response) {
      return new APIResponse(
         response.status,
         response.data ? response.data.data : undefined,
         response.data ? response.data.error : undefined
      );
   }
}

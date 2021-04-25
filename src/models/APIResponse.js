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
   // TODO better error handling throughout app when pinging the api. don't just alert the error stacks
   static fromResponse(response) {
      return APIResponse.builder()
         .withStatus(response.status)
         .withData(response.data.data)
         .build();
   }
   static fromError(error) {
      let errors = error.response.data.error;
      return APIResponse.builder()
         .withStatus(error.response.status)
         .withError(typeof errors === 'string' ? [errors] : errors)
         .build();
   }
   static withDummyError() {
      const dummy = {
         response: {
            status: 400,
            data: {
               error: ['this is the error!', 'and another error!'],
            },
         },
      };
      return APIResponse.fromError(dummy);
   }
}

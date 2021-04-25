export default class APIResponse {
   constructor(status, data, errors) {
      this.status = status;
      this.data = data;
      this.errors = errors;
   }
   static builder() {
      this.status = undefined;
      this.data = undefined;
      this.errors = undefined;
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
   static withErrors(val) {
      this.errors = val;
      return this;
   }
   static build() {
      return new APIResponse(this.status, this.data, this.errors);
   }
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
         .withErrors(typeof errors === 'string' ? [errors] : errors)
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

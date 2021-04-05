export default class GameRule {
   constructor(label, description, is_active) {
      this.label = label;
      this.description = description;
      this.is_active = is_active;
   }
   static builder() {
      this.label = undefined;
      this.description = undefined;
      this.is_active = undefined;
      return this;
   }
   static withLabel(val) {
      this.label = val;
      return this;
   }
   static withDescription(val) {
      this.description = val;
      return this;
   }
   static withIsActive(val) {
      this.is_active = val;
      return this;
   }
   static build() {
      return new GameRule(this.label, this.description, this.is_active);
   }
}

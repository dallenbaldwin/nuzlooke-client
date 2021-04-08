export default class GameRule {
   constructor(id, label, description, is_active) {
      this.id = id;
      this.label = label;
      this.description = description;
      this.is_active = is_active;
   }
   static builder() {
      this.id = undefined;
      this.label = undefined;
      this.description = undefined;
      this.is_active = undefined;
      return this;
   }
   static withId(val) {
      this.id = val;
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
      return new GameRule(this.id, this.label, this.description, this.is_active);
   }
}

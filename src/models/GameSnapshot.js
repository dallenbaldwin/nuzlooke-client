export default class GameSnapshot {
   constructor(
      game_id,
      is_finished,
      label,
      version,
      party_icon_urls,
      gym_badge_icon_urls
   ) {
      this.game_id = game_id;
      this.is_finished = is_finished;
      this.label = label;
      this.version = version;
      this.party_icon_urls = party_icon_urls;
      this.gym_badge_icon_urls = gym_badge_icon_urls;
   }
   static builder() {
      this.game_id = undefined;
      this.is_finished = undefined;
      this.label = undefined;
      this.version = undefined;
      this.party_icon_urls = undefined;
      this.gym_badge_icon_urls = undefined;
      return this;
   }
   static withGameId(val) {
      this.game_id = val;
      return this;
   }
   static withIsFinished(val) {
      this.is_finished = val;
      return this;
   }
   static withLabel(val) {
      this.label = val;
      return this;
   }
   static withVersion(val) {
      this.version = val;
      return this;
   }
   static withPartyIconUrls(...vals) {
      this.party_icon_urls = Array.from([...vals]).flatMap(x => x);
      return this;
   }
   static withGymBadgeIconUrls(...vals) {
      this.gym_badge_icon_urls = Array.from([...vals]).flatMap(x => x);
      return this;
   }
   static build() {
      return new GameSnapshot(
         this.game_id,
         this.is_finished,
         this.label,
         this.version,
         this.party_icon_urls,
         this.gym_badge_icon_urls
      );
   }
}

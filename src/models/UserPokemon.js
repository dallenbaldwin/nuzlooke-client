import * as util from '../util/util';
import uuid_pkg from 'uuid';
const { v4: uuid } = uuid_pkg;

export default class UserPokemon {
   constructor(species, icon_url, sprite_url, types, nickname, evolves_to, party_state) {
      this.id = uuid();
      this.species = species;
      this.icon_url = icon_url;
      this.sprite_url = sprite_url;
      this.types = types;
      this.nickname = nickname;
      this.evolves_to = evolves_to;
      this.party_state = party_state;
   }
   static builder() {
      this.species = undefined;
      this.icon_url = undefined;
      this.sprite_url = undefined;
      this.types = undefined;
      this.nickname = undefined;
      this.evolves_to = undefined;
      this.party_state = undefined;
      return this;
   }
   static withSpecies(val) {
      this.species = val;
      return this;
   }
   static withIconUrl(val) {
      this.icon_url = val;
      return this;
   }
   static withSpritUrl(val) {
      this.sprite_url = val;
      return this;
   }
   static withTypes(...vals) {
      this.types = util.arrayify(...vals);
      return this;
   }
   static withNickname(val) {
      this.nickname = val;
      return this;
   }
   static withEvolvesTo(...vals) {
      this.evolves_to = util.arrayify(...vals);
      return this;
   }
   static withPartyState(val) {
      this.party_state = val;
      return this;
   }
   static build() {
      return new UserPokemon(
         this.species,
         this.icon_url,
         this.sprite_url,
         this.types,
         this.nickname,
         this.evolves_to,
         this.party_state
      );
   }
}

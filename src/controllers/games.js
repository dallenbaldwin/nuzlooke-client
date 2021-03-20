import UtilMixin from '../mixins/UtilMixin.js';

const VERSIONS = UtilMixin.data().VERSIONS;
const PARTY_STATE = UtilMixin.data().PARTY_STATE;

export const build = object => {
   const version = Object.values(VERSIONS).find(v => v.label === object.version).key;
   return {
      label: object.label,
      version: version,
   };
};

export const getSnapshot = game => {
   const partyIconUrls = game.pokemons
      ? game.pokemons
           .filter(p => p.party_state === PARTY_STATE.PARTY.label)
           .map(p => p.icon_url)
      : undefined;
   const gymBadgeIconsUrls = game.gyms
      ? game.gyms.filter(g => g.is_defeated).map(g => g.badge.sprite_url)
      : undefined;

   return {
      game_id: game.id,
      is_finished: game.is_finished,
      label: game.label,
      version: game.version,
      party_icon_urls: partyIconUrls,
      gym_badge_icon_urls: gymBadgeIconsUrls,
   };
};

import Versions from '../constants/Versions.js';
import PartyState from '../constants/PartyState.js';
import Icons from '../constants/Icons.js';
import store from '../store/store.js';

export const build = object => {
   const version = Object.values(Versions).find(v => v.label === object.version).key;
   return {
      label: object.label,
      version: version,
   };
};

export const getConsoleIcon = family => {
   const familyToConsole = {
      letsgo: Icons.CONSOLES.SWITCH,
      rubysapphire: Icons.CONSOLES.DEFAULT,
      emerald: Icons.CONSOLES.DEFAULT,
   };
   return familyToConsole[family];
};

export const getPartyIconUrls = game =>
   game.pokemons.filter(p => p.party_state === PartyState.PARTY).map(p => p.icon_url);

export const getGymBadgeIconsUrls = game =>
   game.gyms.filter(g => g.is_defeated).map(g => g.badge.sprite_url);

export const getSnapshot = game => {
   return {
      game_id: game.id,
      is_finished: game.is_finished,
      label: game.label,
      version: game.version,
      party_icon_urls: getPartyIconUrls(),
      gym_badge_icon_urls: getGymBadgeIconsUrls(),
   };
};

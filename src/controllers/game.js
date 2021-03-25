import Versions from '../constants/Versions.js';
import PartyState from '../constants/PartyState.js';
import Icons from '../constants/Icons.js';
import store from '../store/store.js';
import * as services from '../services/game.js';

export async function updateEncountersAndPokemons() {
   try {
      await services.updateGameById(store.game.id, {
         pokemons: store.game.pokemons,
         encounters: store.game.encounters,
      });
   } catch (err) {
      alert(err);
   }
}

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
      party_icon_urls: getPartyIconUrls(game),
      gym_badge_icon_urls: getGymBadgeIconsUrls(game),
   };
};

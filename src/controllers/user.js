import store from '../store/store.js';
import * as services from '../services/user.js';
import * as gameController from './game.js';

export async function updateUserGames() {
   try {
      await services.updateUserById(store.state.userId, {
         games: store.state.userGames,
      });
   } catch (err) {
      alert(err);
   }
}

export const updateSnapshotPartyUrls = id => {
   const snapshot = store.state.userGames.find(g => g.id === id);
   // by now i should have an updated party list
   snapshot.party_icon_urls = gameController.getPartyIconUrls(store.state.game);
   store.commit('updateGameSnapshot', snapshot);
};

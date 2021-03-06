import store from '../store/store';
import * as services from '../services/user';
import * as gameController from './game';

export const updateUserGames = async () => {
   const response = await services.updateUserById(store.state.userId, {
      games: store.state.userGames,
   });
   if (response && response.errors) return response;
};

export const addGameSnapshot = snapshot => {
   store.commit('addGameSnapshot', snapshot);
};

export const updateUser = async options => {
   const response = await services.updateUserById(store.state.userId, options);
   if (response && response.errors) return response;
};

export const updateSnapshotPartyUrls = id => {
   const snapshot = store.state.userGames.find(g => g.game_id === id);
   // by now i should have an updated party list
   snapshot.party_icon_urls = gameController.getPartyIconUrls(store.state.game);
   store.commit('updateGameSnapshot', snapshot);
};

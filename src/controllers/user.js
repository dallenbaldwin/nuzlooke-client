import store from '../store/store';
import * as services from '../services/user';
import * as gameController from './game';
import { prettySON } from '../util/util';

export const updateUserGames = async () => {
   try {
      await services.updateUserById(store.state.userId, {
         games: store.state.userGames,
      });
   } catch (err) {
      alert(err);
   }
};

export const addGameSnapshot = snapshot => {
   store.commit('addGameSnapshot', snapshot);
};

export const updateUser = async options => {
   try {
      if (options.username) store.commit('setUsername', options.username);
      await services.updateUserById(store.state.userId, options);
   } catch (err) {
      alert(prettySON([err, err.stack]));
   }
};

export const updateSnapshotPartyUrls = id => {
   const snapshot = store.state.userGames.find(g => g.game_id === id);
   // by now i should have an updated party list
   snapshot.party_icon_urls = gameController.getPartyIconUrls(store.state.game);
   store.commit('updateGameSnapshot', snapshot);
};

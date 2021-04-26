import store from '../store/store';
import * as gameController from './game';
import * as userController from './user';

export const setEarnedBadge = async gym => {
   store.commit('earnedBadge', gym);
   const gymBadgeUrls = gameController.getGymBadgeIconsUrls(store.state.game);
   const snapshot = gameController.buildSnapshot(store.state.game);
   snapshot.gym_badge_icon_urls = gymBadgeUrls;
   store.commit('updateGameSnapshot', snapshot);
   const updateUGResponse = await userController.updateUserGames();
   if (updateUGResponse && updateUGResponse.errors) return updateUGResponse;
   const updateGymResponse = await gameController.updateGymsInDB();
   if (updateGymResponse && updateGymResponse.errors) return updateGymResponse;
};

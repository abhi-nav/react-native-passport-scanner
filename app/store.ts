import { configureStore } from "@reduxjs/toolkit";
// ...

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { rootReducer, RootReducerType } from "./reducer";

const persistConfig = {
	key: "root",
	storage: AsyncStorage,
	stateReconciler: autoMergeLevel2,
};

// import { loadState } from "./browser-storage";
//MIDDLEWARE
// const localStorageMiddleware = ({ getState }) => {
// 	return next => action => {
// 	  const result = next(action);
// 	  localStorage.setItem('applicationState', JSON.stringify(getState()));
// 	  return result;
// 	};
//   };

//   const reHydrateStore = () => {
// 	if (localStorage.getItem('applicationState') !== null) {
// 	  return JSON.parse(localStorage.getItem('applicationState')); // re-hydrate the store
// 	}
//   };

const persistedReducer = persistReducer<any, any>(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					FLUSH,
					REHYDRATE,
					PAUSE,
					PERSIST,
					PURGE,
					REGISTER,
				],
			},
		}),
	// preloadedState: loadState(),
	//   middleware: getDefaultMiddleware =>
	//     getDefaultMiddleware().concat(localStorageMiddleware),
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

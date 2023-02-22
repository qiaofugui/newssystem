import { legacy_createStore as createStore, combineReducers } from 'redux'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { CollapsedReducer } from './reducer/CollapsedReducer'
import { LoadingReducer } from './reducer/LoadingReducer';
import { SideMenuReducer } from './reducer/SideMenuReducer'

const persistConfig = {
  key: 'joe',
  storage,
  blacklist: ['LoadingReducer','SideMenuReducer']
}

const reducer = combineReducers({
  CollapsedReducer,
  LoadingReducer,
  SideMenuReducer
})
const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer)
let persistor = persistStore(store)

export {
  store,
  persistor
}

/*
  store.dispatch()

  store.subscribe()
*/
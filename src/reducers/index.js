const {combineReducers} = require('redux');
const undoable = require('redux-undo').default;

const assetsReducer = require('./assets');
const layersReducer = require('./layers');

module.exports = combineReducers({
  assets: undoable(assetsReducer),
  layers: undoable(layersReducer)
});
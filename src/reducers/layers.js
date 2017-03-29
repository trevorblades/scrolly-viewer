const layerReducer = require('./layer');
const {linkLayers} = require('../actions');
const getNextId = require('../util/get-next-id');

module.exports = function(state = [], action) {
  switch (action.type) {
    case 'ADD_LAYER':
      return [
        ...state,
        layerReducer(undefined, Object.assign(action, {id: getNextId(state)}))
      ];
    case 'REMOVE_LAYER': {
      const nextState = state.map(function(layer) {
        if (layer.parent && layer.parent.id === action.id) {
          return layerReducer(layer, linkLayers(layer.id, null));
        }
        return layer;
      });

      let index = -1;
      for (let i = 0; i < nextState.length; i++) {
        if (nextState[i].id === action.id) {
          index = i;
          break;
        }
      }

      return [...nextState.slice(0, index), ...nextState.slice(index + 1)];
    }
    case 'COPY_LAYER': {
      let layer;
      for (var i = 0; i < state.length; i++) {
        if (state[i].id === action.id) {
          layer = Object.assign({}, state[i], {
            id: getNextId(state),
            name: `${state[i].name} copy`
          });
          break;
        }
      }

      if (!layer) {
        return state;
      }
      return [...state, layer];
    }
    case 'ORDER_LAYERS':
      return action.order.map(id => state.find(layer => layer.id === id));
    case 'SET_LAYER_PROPERTIES':
    case 'TOGGLE_LAYER_VISIBILITY':
    case 'LINK_LAYERS':
      return state.map(layer => layerReducer(layer, action));
    case 'LOAD_PROJECT':
      return action.layers;
    default:
      return state;
  }
};

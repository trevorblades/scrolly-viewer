import properties from '../util/properties';

export default (state, action) => {
  switch (action.type) {
    case 'ADD_LAYER': {
      const layer = {
        id: action.id,
        type: action.layerType,
        name: `Layer ${action.id}`,
        in: properties.in.default,
        out: properties.out.default,
        anchorX: properties.anchorX.default,
        anchorY: properties.anchorX.default,
        x: properties.x.default,
        y: properties.y.default,
        scale: properties.scale.default,
        rotation: properties.rotation.default,
        opacity: properties.opacity.default,
        visible: true,
        parent: null
      };

      switch (layer.type) {
        case 'text':
          layer.value = 'Enter text here';
          layer.paddingX = properties.paddingX.default;
          layer.paddingY = properties.paddingY.default;
          layer.fontSize = properties.fontSize.default;
          layer.fontWeight = properties.fontWeight.default;
          layer.fontStyle = properties.fontStyle.default;
          layer.fontColor = properties.fontColor.default;
          layer.backgroundColor = properties.backgroundColor.default;
          break;
        case 'image': {
          layer.asset = action.asset.id;
          layer.name = action.asset.name;
          const duplicateCount = action.layers.filter(
            ({asset}) => asset === action.asset.id
          ).length;
          if (duplicateCount) {
            layer.name += ` (${duplicateCount + 1})`;
          }
          break;
        }
        case 'shape':
          layer.shape = action.shape;
          layer.fill = properties.fill.default;
          layer.stroke = properties.stroke.default;
          layer.strokeWidth = properties.strokeWidth.default;
          break;
        default:
      }

      return layer;
    }
    case 'SET_LAYER_PROPERTIES':
      if (state.id !== action.id) {
        return state;
      }
      return {...state, ...action.properties};
    case 'TOGGLE_LAYER_VISIBILITY':
      if (state.id !== action.id) {
        return state;
      }
      return {...state, ...{visible: !state.visible}};
    case 'LINK_LAYERS':
      if (state.id !== action.child) {
        return state;
      }
      return {...state, ...{parent: action.parent}};
    default:
      return state;
  }
};

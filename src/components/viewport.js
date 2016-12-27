const React = require('react');
const {connect} = require('react-redux');
const classNames = require('classnames');

const ViewportLayer = require('./viewport-layer');

const {addImageLayer} = require('../actions');
const {ASSET_DRAG_TYPE} = require('../constants');
const isDragTypeFound = require('../util/is-drag-type-found');

function getViewportDimensions(props) {
  const compositionAspectRatio = props.compositionWidth / props.compositionHeight;
  const outerAspectRatio = props.wrapperWidth / props.wrapperHeight;

  let height = props.wrapperHeight;
  let width = props.wrapperWidth;
  if (compositionAspectRatio > outerAspectRatio) {
    height = props.wrapperWidth / compositionAspectRatio;
  } else {
    width = props.wrapperHeight * compositionAspectRatio;
  }

  const offsetLeft = props.wrapperOffsetLeft + (props.wrapperWidth - width) / 2;
  const offsetTop = props.wrapperOffsetTop + (props.wrapperHeight - height) / 2;
  return {
    height: height,
    offsetLeft: offsetLeft,
    offsetTop: offsetTop,
    width: width
  };
}

let Viewport = React.createClass({

  propTypes: {
    assets: React.PropTypes.array.isRequired,
    compositionHeight: React.PropTypes.number.isRequired,
    compositionWidth: React.PropTypes.number.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    layers: React.PropTypes.array.isRequired,
    percentPlayed: React.PropTypes.number.isRequired,
    selectLayer: React.PropTypes.func.isRequired,
    selectedLayerId: React.PropTypes.number,
    wrapperHeight: React.PropTypes.number.isRequired,
    wrapperOffsetLeft: React.PropTypes.number.isRequired,
    wrapperOffsetTop: React.PropTypes.number.isRequired,
    wrapperWidth: React.PropTypes.number.isRequired
  },

  getInitialState: function() {
    return getViewportDimensions(this.props);
  },

  componentWillMount: function() {
    this._dragCounter = 0;
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.compositionHeight !== this.props.compositionHeight ||
        nextProps.compositionWidth !== this.props.compositionWidth ||
        nextProps.wrapperHeight !== this.props.wrapperHeight ||
        nextProps.wrapperOffsetLeft !== this.props.wrapperOffsetLeft ||
        nextProps.wrapperOffsetTop !== this.props.wrapperOffsetTop ||
        nextProps.wrapperWidth !== this.props.wrapperWidth) {
      this.setState(getViewportDimensions(nextProps));
    }
  },

  _onClick: function() {
    if (this.props.selectedLayerId !== null) {
      this.props.selectLayer(null);
    }
  },

  _onDragEnter: function(event) {
    event.preventDefault();
    if (isDragTypeFound(event, ASSET_DRAG_TYPE)) {
      this._dragCounter++;
      this.setState({dragging: true});
    }
  },

  _onDragLeave: function(event) {
    if (isDragTypeFound(event, ASSET_DRAG_TYPE)) {
      this._dragCounter--;
      if (!this._dragCounter) {
        this.setState({dragging: false});
      }
    }
  },

  _onDragOver: function(event) {
    event.preventDefault();
  },

  _onDrop: function(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData(ASSET_DRAG_TYPE);
    if (id) {
      const asset = this.props.assets.find(asset => asset.id === parseInt(id));
      this.props.dispatch(addImageLayer(asset.data, asset.width, asset.height));
      this._dragCounter = 0;
      this.setState({dragging: false});
    }
  },

  render: function() {
    const layers = this.props.layers.slice();
    layers.reverse();

    const viewportClassName = classNames('pl-viewport', {
      'pl-dragging': this.state.dragging
    });

    return (
      <div className={viewportClassName}
          onClick={this._onClick}
          onDragEnter={this._onDragEnter}
          onDragLeave={this._onDragLeave}
          onDragOver={this._onDragOver}
          onDrop={this._onDrop}
          style={{
            width: this.state.width,
            height: this.state.height
          }}>
        {layers.map(layer => {
          if (layer.in > this.props.percentPlayed ||
              layer.out < this.props.percentPlayed) {
            return null;
          }

          return (
            <ViewportLayer key={layer.id}
                layer={layer}
                percentPlayed={this.props.percentPlayed}
                selectLayer={this.props.selectLayer}
                selected={layer.id === this.props.selectedLayerId}
                viewportHeight={this.state.height}
                viewportOffsetLeft={this.state.offsetLeft}
                viewportOffsetTop={this.state.offsetTop}
                viewportScale={this.state.width / this.props.compositionWidth}
                viewportWidth={this.state.width}/>
          );
        })}
      </div>
    );
  }
});

module.exports = connect(function(state) {
  return {
    assets: state.assets.present,
    layers: state.layers.present.filter(layer => layer.visible)
  };
})(Viewport);

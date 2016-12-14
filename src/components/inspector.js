const React = require('react');
const {connect} = require('react-redux');
const sentenceCase = require('sentence-case');

const {setLayerProperties} = require('../actions');

const PROPERTIES = {
  x: true,
  y: true,
  in: {
    step: 0.01,
    min: 0,
    max: 1
  },
  out: {
    step: 0.01,
    min: 0,
    max: 1
  },
  fontSize: {
    min: 1
  },
  fontWeight: true,
  fontStyle: true
};

function clamp(key, value) {
  const property = PROPERTIES[key];
  if (!isNaN(property.min) && value < property.min) {
    return property.min;
  } else if (!isNaN(property.max) && value > property.max) {
    return property.max;
  }
  return value;
}

let Inspector = React.createClass({

  propTypes: {
    layer: React.PropTypes.object.isRequired,
    onPropertyChange: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return Object.assign({
      dragKey: null,
      dragValue: null
    }, this.props.layer);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.layer !== this.props.layer) {
      this.setState(nextProps.layer);
    }
  },

  _onInputChange: function(event) {
    this.props.onPropertyChange(event.target.name, event.target.value);
  },

  _onInputKeyDown: function(event) {
    if (event.keyCode === 38 || event.keyCode === 40) {
      event.preventDefault();
      let direction = event.keyCode === 38 ? 1 : -1;
      let movement = event.target.step * direction;
      if (event.shiftKey) {
        movement *= 10;
      }

      const key = event.target.name;
      const value = parseFloat(event.target.value) + movement;
      this.props.onPropertyChange(key, clamp(key, value));
    }
  },

  _onLabelMouseDown: function(property, event) {
    if (event.button === 0) {
      this.setState({
        dragKey: property,
        dragValue: this.state[property]
      });
      document.addEventListener('mousemove', this._onLabelMouseMove);
      document.addEventListener('mouseup', this._onLabelMouseUp);
    }
  },

  _onLabelMouseMove: function(event) {
    let movement = event.movementX;
    const property = PROPERTIES[this.state.dragKey];
    if (!isNaN(property.step)) {
      movement *= property.step;
    }

    const value = this.state.dragValue + movement;
    this.setState({dragValue: clamp(this.state.dragKey, value)});
  },

  _onLabelMouseUp: function() {
    this.props.onPropertyChange(this.state.dragKey, this.state.dragValue);
    this.setState({
      dragKey: null,
      dragValue: null
    });
    document.removeEventListener('mousemove', this._onLabelMouseMove);
    document.removeEventListener('mouseup', this._onLabelMouseUp);
  },

  render: function() {
    const properties = Object.keys(PROPERTIES).filter(property => {
      return typeof this.state[property] !== 'undefined';
    });
    return (
      <div className="pl-inspector">
        <div className="pl-inspector-header">
          <input name="name"
              onChange={this._onInputChange}
              type="text"
              value={this.state.name}/>
        </div>
        <div className="pl-inspector-properties">
          {properties.map(key => {
            const property = PROPERTIES[key];

            let inputProps;
            let labelProps;
            let value = key === this.state.dragKey ?
                this.state.dragValue : this.state[key];
            const isNumber = !isNaN(value);
            if (isNumber) {
              value = Math.round(value * 100) / 100;
              inputProps = {
                onKeyDown: this._onInputKeyDown,
                step: property.step || 1
              };
              labelProps = {
                onMouseDown: this._onLabelMouseDown.bind(null, key),
                style: {
                  cursor: 'ew-resize'
                }
              };
            }

            return (
              <div className="pl-inspector-property"
                  key={key}>
                <input {...inputProps} name={key}
                    onChange={this._onInputChange}
                    type={isNumber ? 'number' : 'text'}
                    value={value}/>
                <label {...labelProps}>{sentenceCase(key)}</label>
                <span/>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
});

Inspector = connect(null, function(dispatch, props) {
  return {
    onPropertyChange: function(key, value) {
      const property = PROPERTIES[key];
      if (!isNaN(property.min) && value < property.min) {
        value = property.min;
      } else if (!isNaN(property.max) && value > property.max) {
        value = property.max;
      }
      dispatch(setLayerProperties(props.layer.id, {[key]: value}));
    }
  };
})(Inspector);
Inspector.displayName = 'Inspector';

module.exports = Inspector;

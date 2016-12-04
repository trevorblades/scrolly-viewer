const React = require('react');

const Timeline = React.createClass({

  propTypes: {
    layers: React.PropTypes.array,
    layersPanelWidth: React.PropTypes.number
  },

  getInitialState: function() {
    return {
      playheadFraction: 0,
      scrubbing: false
    };
  },

  _onPlayheadMouseDown: function() {
    this.setState({scrubbing: true});
    document.addEventListener('mousemove', this._onPlayheadMouseMove);
    document.addEventListener('mouseup', this._onPlayheadMouseUp);
  },

  _onPlayheadMouseMove: function(event) {
    const playheadPosition = this.refs.playhead.offsetLeft;
    let playheadFraction = (playheadPosition + event.movementX) / this.refs.timeline.offsetWidth;
    if (playheadFraction < 0) {
      playheadFraction = 0;
    } else if (playheadFraction > 1) {
      playheadFraction = 1;
    }
    this.setState({playheadLeft: playheadFraction * 100});
  },

  _onPlayheadMouseUp: function() {
    this.setState({scrubbing: false});
    document.removeEventListener('mousemove', this._onPlayheadMouseMove);
    document.removeEventListener('mouseup', this._onPlayheadMouseUp);
  },

  render: function() {
    return (
      <div className="pl-timeline" ref="timeline">
        <div className="pl-timeline-marker"
            style={{left: `${this.state.playheadLeft}%`}}/>
        <div className="pl-timeline-playhead"
            onMouseDown={this._onPlayheadMouseDown}
            ref="playhead"
            style={{left: `${this.state.playheadLeft}%`}}/>
      </div>
    );
  }
});

module.exports = Timeline;

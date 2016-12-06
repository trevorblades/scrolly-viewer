const React = require('react');
const ReactDOM = require('react-dom');

const Canvas = require('./canvas');
const Header = require('./header');
const Library = require('./library');
const Sidebar = require('./sidebar');
const Timeline = require('./timeline');

const TEST_LAYERS = {
  default: {
    type: 'image',
    name: 'Imagery'
  },
  text0: {
    type: 'text',
    name: 'Some text',
    value: 'Hey',
    x: 100,
    y: 100,
    fontSize: 48,
    fontStyle: 'italic'
  },
  text1: {
    type: 'text',
    name: 'Some more text',
    value: 'Hi',
    x: 240,
    y: 400
  },
  text2: {
    type: 'text',
    name: 'Even more text',
    value: 'Ho',
    x: 960,
    y: 120
  }
};

const App = React.createClass({

  getInitialState: function() {
    return {
      assets: [],
      innerHeight: 1080,
      innerWidth: 1920,
      layers: TEST_LAYERS,
      outerHeight: 0,
      outerWidth: 0,
      timelineMaxHeight: 0
    };
  },

  componentDidMount: function() {
    window.addEventListener('resize', this._onResize);
    this._onResize();
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this._onResize);
  },

  _onResize: function() {
    const canvas = ReactDOM.findDOMNode(this.refs.canvas);
    const header = ReactDOM.findDOMNode(this.refs.header);
    this.setState({
      outerHeight: canvas.offsetHeight,
      outerWidth: canvas.offsetWidth,
      timelineMaxHeight: (window.innerHeight - header.offsetHeight) / 2
    });
  },

  render: function() {
    return (
      <div className="pl-app">
        <Header ref="header"/>
        <div className="pl-app-content">
          <Sidebar>
            <Library assets={this.state.assets}/>
          </Sidebar>
          <Canvas innerHeight={this.state.innerHeight}
              innerWidth={this.state.innerWidth}
              layers={this.state.layers}
              outerHeight={this.state.outerHeight}
              outerWidth={this.state.outerWidth}
              ref="canvas"/>
        </div>
        <Timeline layers={this.state.layers}
            maxHeight={this.state.timelineMaxHeight}
            onResize={this._onResize}/>
      </div>
    );
  }
});

module.exports = App;

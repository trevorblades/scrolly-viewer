import React from 'react';
import {render} from 'react-dom';
import url from 'url';

import Viewport from '../components/viewport';

const Viewer = React.createClass({
  getInitialState() {
    let loading = false;
    const parsed = url.parse(window.location.href, true);
    const slug = parsed.query.project || parsed.query.p;
    if (slug) {
      loading = true;
      fetch(`${API_URL}/projects/${slug}`)
        .then(res => {
          if (!res.ok) {
            throw new Error();
          }
          return res.json();
        })
        .then(project => {
          this.setState({
            assets: project.assets,
            height: project.height,
            layers: project.layers,
            loading: false,
            step: project.step,
            width: project.width
          });
        })
        .catch(() => this.setState({loading: false}));
    }
    return {
      assets: [],
      height: 0,
      layers: [],
      loading,
      percentPlayed: 0,
      step: 1,
      width: 0,
      windowHeight: 0,
      windowWidth: 0
    };
  },

  componentDidMount() {
    window.addEventListener('wheel', this.onWheel);
    window.addEventListener('resize', this.onResize);
    this.onResize();
  },

  onWheel(event) {
    const movementY = event.deltaY / this.state.step;
    let percentPlayed =
      (this.state.windowWidth * this.state.percentPlayed + movementY) /
      this.state.windowWidth;
    if (percentPlayed < 0) {
      percentPlayed = 0;
    } else if (percentPlayed > 1) {
      percentPlayed = 1;
    }
    this.setState({percentPlayed});
  },

  onResize() {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth
    });
  },

  render() {
    if (this.state.loading) {
      return null;
    }
    return (
      <div className="sv-viewer">
        <Viewport
          assets={this.state.assets}
          compositionHeight={this.state.height}
          compositionWidth={this.state.width}
          layers={this.state.layers}
          percentPlayed={this.state.percentPlayed}
          readOnly
          wrapperHeight={this.state.windowHeight}
          wrapperWidth={this.state.windowWidth}
        />
      </div>
    );
  }
});

render(<Viewer />, document.getElementById('sv-root'));

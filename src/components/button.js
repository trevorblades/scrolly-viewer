const React = require('react');
const classNames = require('classnames');

const Button = React.createClass({

  propTypes: {
    children: React.PropTypes.node,
    className: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    type: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      type: 'button'
    };
  },

  _onMouseDown: function(event) {
    event.preventDefault();
    event.target.blur();
  },

  render: function() {
    return (
      <button className={classNames('pl-button', this.props.className)}
          disabled={this.props.disabled}
          onClick={this.props.onClick}
          onMouseDown={this._onMouseDown}
          type={this.props.type}>
        {this.props.children}
      </button>
    );
  }
});

module.exports = Button;
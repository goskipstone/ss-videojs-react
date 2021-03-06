'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _videojs = require('./videojs');

var _videojs2 = _interopRequireDefault(_videojs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file markerjs
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Component = _videojs2.default.getComponent('Component');

/**
 * Progress Bar - Marker
 *
 * @param {Object} player  Main Player
 * @param {Object=} options Object of option names and values
 * @extends Component
 * @class Marker
 */

var Marker = function (_Component) {
  _inherits(Marker, _Component);

  function Marker(player, options) {
    _classCallCheck(this, Marker);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Marker).call(this, player, options));

    _this.on('click', _this.handleClick);

    var duration = player.duration();
    var offset = options.seconds / options.duration;
    _this.offset = offset * 100;

    player.on('ready', function () {
      this.setOffset(this.offset);
    }.bind(_this));

    return _this;
  }

  /**
   * Allow sub components to stack CSS class names
   *
   * @return {String} The constructed class name
   * @method buildCSSClass
   */


  _createClass(Marker, [{
    key: 'createEl',
    value: function createEl() {

      return _get(Object.getPrototypeOf(Marker.prototype), 'createEl', this).call(this, 'div', {
        className: 'vjs-marker',
        innerHTML: '<span class="vjs-control-marker"><span class="vj-control-marker-inner">+</span></span>'
      });
    }
  }, {
    key: 'setOffset',
    value: function setOffset(position) {
      var el = this.el();
      el.style.left = position + '%';
      el.style.position = 'absolute';
    }
  }, {
    key: 'handleClick',
    value: function handleClick() {}
  }]);

  return Marker;
}(Component);

Marker.prototype.controlText_ = 'Play Video';

_videojs2.default.registerComponent('Marker', Marker);
exports.default = Marker;
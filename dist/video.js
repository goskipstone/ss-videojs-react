'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _videojs = require('./videojs');

var _videojs2 = _interopRequireDefault(_videojs);

var _markerBar = require('./markerBar');

var _markerBar2 = _interopRequireDefault(_markerBar);

var _marker = require('./marker');

var _marker2 = _interopRequireDefault(_marker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _forEach = _lodash2.default.forEach;
var _debounce = _lodash2.default.debounce;
var _defaults = _lodash2.default.defaults;


var DEFAULT_HEIGHT = 540;
var DEFAULT_WIDTH = 960;
var DEFAULT_ASPECT_RATIO = 9 / 16;
var DEFAULT_ADJUSTED_SIZE = 0;
var DEFAULT_RESIZE_DEBOUNCE_TIME = 500;
var DEFAULT_VIDEO_OPTIONS = {
  preload: 'auto',
  autoPlay: true,
  controls: true
};

function noop() {}

var ReactVideoJsComponent = function (_Component) {
  _inherits(ReactVideoJsComponent, _Component);

  function ReactVideoJsComponent(props) {
    _classCallCheck(this, ReactVideoJsComponent);

    //initial state

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ReactVideoJsComponent).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(ReactVideoJsComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.mountVideoPlayer();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var isEndless = this.props.endlessMode;
      var willBeEndless = nextProps.endlessMode;

      if (isEndless !== willBeEndless) {
        if (willBeEndless) {
          this.addEndlessMode();
        } else {
          this.removeEndlessMode();
        }
      }

      var isResizable = this.props.resize;
      var willBeResizeable = nextProps.resize;

      if (isResizable !== willBeResizeable) {
        if (willBeResizeable) {
          this.addResizeEventListener();
        } else {
          this.removeResizeEventListener();
        }
      }

      var currentSrc = this.props.src;
      var newSrc = nextProps.src;

      if (currentSrc !== newSrc) {
        this.addTextTracks(nextProps);
        this.setPoster(nextProps);
        this.setVideoPlayerSrc(newSrc);
        this.restartVideo();
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return false;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unmountVideoPlayer();
    }
  }, {
    key: 'drawMarker',
    value: function drawMarker(markerOptions) {
      if (!this._markerBar) {
        this._markerBar = this._player.controlBar.progressControl.addChild(new _markerBar2.default());
      }

      var marker = new _marker2.default(this._player, markerOptions);
      this._markerBar.addChild(marker);
    }
  }, {
    key: 'getVideoPlayer',
    value: function getVideoPlayer() {
      return this._player;
    }
  }, {
    key: 'getVideoPlayerEl',
    value: function getVideoPlayerEl() {
      return _reactDom2.default.findDOMNode(this.refs.videoPlayer);
    }
  }, {
    key: 'getVideoPlayerOptions',
    value: function getVideoPlayerOptions() {
      return _defaults({}, this.props.options, DEFAULT_VIDEO_OPTIONS);
    }
  }, {
    key: 'getVideoResizeOptions',
    value: function getVideoResizeOptions() {
      return _defaults({}, this.props.resizeOptions, {
        aspectRatio: DEFAULT_ASPECT_RATIO,
        shortWindowVideoHeightAdjustment: DEFAULT_ADJUSTED_SIZE,
        defaultVideoWidthAdjustment: DEFAULT_ADJUSTED_SIZE,
        debounceTime: DEFAULT_RESIZE_DEBOUNCE_TIME
      });
    }
  }, {
    key: 'getResizedVideoPlayerMeasurements',
    value: function getResizedVideoPlayerMeasurements() {
      var resizeOptions = this.getVideoResizeOptions();
      var aspectRatio = resizeOptions.aspectRatio;
      var defaultVideoWidthAdjustment = resizeOptions.defaultVideoWidthAdjustment;

      var winHeight = this._windowHeight();

      var baseWidth = this._videoElementWidth();

      var vidWidth = baseWidth - defaultVideoWidthAdjustment;
      var vidHeight = vidWidth * aspectRatio;

      if (winHeight < vidHeight) {
        var shortWindowVideoHeightAdjustment = resizeOptions.shortWindowVideoHeightAdjustment;
        vidHeight = winHeight - shortWindowVideoHeightAdjustment;
      }

      return {
        width: vidWidth,
        height: vidHeight
      };
    }
  }, {
    key: 'setVideoPlayerSrc',
    value: function setVideoPlayerSrc(src) {
      this._player.src(src);
    }
  }, {
    key: 'mountVideoPlayer',
    value: function mountVideoPlayer() {
      var src = this.props.src;
      var options = this.getVideoPlayerOptions();

      var playerEl = this.getVideoPlayerEl();
      playerEl.removeAttribute('data-reactid');

      this._player = (0, _videojs2.default)(playerEl, options);

      var player = this._player;

      _forEach(this.props.markers, this.drawMarker.bind(this));

      player.ready(this.handleVideoPlayerReady.bind(this));

      if (this.props.unboundOnReady) {
        player.ready(this.props.unboundOnReady);
      }

      _forEach(this.props.eventListeners, function (val, key) {
        player.on(key, val);
      });

      this.addTextTracks(this.props);
      this.setPoster(this.props);
      player.src(src);

      if (this.props.endlessMode) {
        this.addEndlessMode();
      }
    }
  }, {
    key: 'setPoster',
    value: function setPoster(_ref) {
      var poster = _ref.poster;

      var $poster = jQuery('.vjs-poster', this._player.id);
      $poster.removeClass('vjs-hidden');
      $poster.css('background-image', 'url(\'' + poster + '\')');
    }
  }, {
    key: 'addTextTracks',
    value: function addTextTracks(_ref2) {
      var _this2 = this;

      var tracks = _ref2.tracks;

      var currentTracks = this._player.textTracks();
      if (currentTracks) {
        currentTracks.tracks_.map(function (track) {
          _this2._player.removeRemoteTextTrack(track);
        });
      }
      if (tracks) {
        tracks.map(function (track) {
          _this2._player.addRemoteTextTrack(track);
        });
      }
    }
  }, {
    key: 'unmountVideoPlayer',
    value: function unmountVideoPlayer() {
      this.removeResizeEventListener();
      if (!this._player) {
        this._player.dispose();
      }
    }
  }, {
    key: 'addEndlessMode',
    value: function addEndlessMode() {
      var player = this._player;

      player.on('ended', this.handleNextVideo);

      if (player.ended()) {
        this.handleNextVideo();
      }
    }
  }, {
    key: 'addResizeEventListener',
    value: function addResizeEventListener() {
      var debounceTime = this.getVideoResizeOptions().debounceTime;

      this._handleVideoPlayerResize = _debounce(this.handleVideoPlayerResize.bind(this), debounceTime);
      window.addEventListener('resize', this._handleVideoPlayerResize);
    }
  }, {
    key: 'removeEndlessMode',
    value: function removeEndlessMode() {
      var player = this._player;

      player.off('ended', this.handleNextVideo);
    }
  }, {
    key: 'removeResizeEventListener',
    value: function removeResizeEventListener() {
      window.removeEventListener('resize', this._handleVideoPlayerResize);
    }
  }, {
    key: 'pauseVideo',
    value: function pauseVideo() {
      this._player.pause();
    }
  }, {
    key: 'playVideo',
    value: function playVideo() {
      this._player.play();
    }
  }, {
    key: 'setCurrentTime',
    value: function setCurrentTime(time) {
      this._player.currentTime(time);
    }
  }, {
    key: 'restartVideo',
    value: function restartVideo() {
      this._player.currentTime(0);
    }
  }, {
    key: 'togglePauseVideo',
    value: function togglePauseVideo() {
      if (this._player.paused()) {
        this.playVideo();
      } else {
        this.pauseVideo();
      }
    }
  }, {
    key: 'handleVideoPlayerReady',
    value: function handleVideoPlayerReady() {

      if (this.props.resize) {
        this.handleVideoPlayerResize();
        this.addResizeEventListener();
      }

      if (this.props.startWithControlBar) {
        this._player.bigPlayButton.hide();
        this._player.controlBar.show();
        this._player.userActive(true);
        this._player.play();
        this._player.pause();
      }

      this.props.onReady();
    }
  }, {
    key: 'handleVideoPlayerResize',
    value: function handleVideoPlayerResize() {
      var player = this._player;
      var videoMeasurements = this.getResizedVideoPlayerMeasurements();

      player.dimensions(videoMeasurements.width, videoMeasurements.height);
    }
  }, {
    key: 'handleNextVideo',
    value: function handleNextVideo() {
      this.props.onNextVideo();
    }
  }, {
    key: 'renderDefaultWarning',
    value: function renderDefaultWarning() {
      return _react2.default.createElement(
        'p',
        null,
        'test'
      );
    }
  }, {
    key: '_windowHeight',
    value: function _windowHeight() {
      return window.innerHeight;
    }
  }, {
    key: '_videoElementWidth',
    value: function _videoElementWidth() {
      var videoPlayer = this.getVideoPlayerEl();
      if (!videoPlayer) {
        return window.innerWidth;
      }
      return _lodash2.default.get(videoPlayer, 'parentElement.parentElement.offsetWidth', window.innerWidth);
    }
  }, {
    key: 'render',
    value: function render() {
      var videoPlayerClasses = (0, _classnames2.default)({
        'video-js': true,
        'vjs-fill': this.props.resize,
        'vjs-default-skin': this.props.vjsDefaultSkin,
        'vjs-big-play-centered': this.props.vjsBigPlayCentered
      });
      var inputProps = this.props.options;
      return _react2.default.createElement(
        'video',
        _extends({ ref: 'videoPlayer',
          className: videoPlayerClasses
        }, inputProps),
        this.props.children || this.renderDefaultWarning()
      );
    }
  }]);

  return ReactVideoJsComponent;
}(_react.Component);

ReactVideoJsComponent.propTypes = {
  src: _react2.default.PropTypes.string.isRequired,
  height: _react2.default.PropTypes.number,
  width: _react2.default.PropTypes.number,
  endlessMode: _react2.default.PropTypes.bool,
  options: _react2.default.PropTypes.object,
  onReady: _react2.default.PropTypes.func,
  poster: _react2.default.PropTypes.string,
  tracks: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.object),
  eventListeners: _react2.default.PropTypes.object,
  unboundOnReady: _react2.default.PropTypes.func,
  resize: _react2.default.PropTypes.bool,
  resizeOptions: _react2.default.PropTypes.shape({
    aspectRatio: _react2.default.PropTypes.number,
    shortWindowVideoHeightAdjustment: _react2.default.PropTypes.number,
    defaultVideoWidthAdjustment: _react2.default.PropTypes.number,
    debounceTime: _react2.default.PropTypes.number
  }),
  vjsDefaultSkin: _react2.default.PropTypes.bool,
  vjsBigPlayCentered: _react2.default.PropTypes.bool,
  startWithControlBar: _react2.default.PropTypes.bool,
  markers: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.object),
  children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.object, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.element), _react2.default.PropTypes.element]),
  dispose: _react2.default.PropTypes.bool,
  onNextVideo: _react2.default.PropTypes.func
};
ReactVideoJsComponent.defaultProps = {
  endlessMode: false,
  options: DEFAULT_VIDEO_OPTIONS,
  onReady: noop,
  eventListeners: {},
  resize: false,
  resizeOptions: {},
  vjsDefaultSkin: true,
  vjsBigPlayCentered: true,
  startWithControlBar: false,
  markers: [],
  onNextVideo: noop
};
exports.default = ReactVideoJsComponent;
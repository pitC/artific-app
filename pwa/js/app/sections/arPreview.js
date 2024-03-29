import SharedStorage from "../sharedStorage.js";
import RouteNames from "../RouteNames.js";
import AppState from "../appStates.js";
import AframeNav from "../ar/aframeNavigator.js";
import CanvasUtils from "../canvas/canvasUtils.js";

const VIDEO_READY = "video";
const TAKING_SCREENSHOT = "scrshot";
const VIDEO_NOT_AVAILABLE = "no video";
const WEBCAM_INIT = "init";

const AFRAME_SCENE_LISTENER = "scene-listener";
const AFRAME_IMAGE_LISTENER = "image-listener";
const AFRAME_CLICKABLE = "clickable-trigger";
const AFRAME_DRAGGABLE = "draggable";
const INITIAL_ARTWORK_DISTANCE = -4;
const INITIAL_ARTWORK_HEIGHT = 2;

const INITIAL_CAM_DISTANCE = 0;
const INITIAL_CAM_HEIGHT = 1.6;

const IMAGE_PLACED = "placed";
const IMAGE_REPLACING = "replacing";
const IMAGE_INITIAL_PLACING = "initial";

const DEFAULT_FRAME_COLOUR = "#fcf0d1";
const DEFAULT_MAT_COLOUR = "#fcf0d1";

const TRIGGER_DISTANCE = INITIAL_ARTWORK_DISTANCE + 0.2;

var VIDEO_CONSTRAINTS = {
  audio: false,
  video: {
    facingMode: "environment"
  }
};

export default {
  data: function() {
    return {
      images: [],
      currentImage: null,
      renderMat: true,
      state: AppState.READY,
      debug: false,
      debugStr: "",
      previewMode: IMAGE_INITIAL_PLACING,
      attachAnimation: false,
      headsetConnected: false,
      frameConfig : {
        renderMat: false,
        showFrame:false,
        depth: 0.1,
        width: 0.02,
        matPad: 0.2,
        frameColour: DEFAULT_FRAME_COLOUR,
        matColour: DEFAULT_MAT_COLOUR
      }
    };
  },
  computed: {
    frameColour() {
      return this.frameConfig.frameColour || DEFAULT_FRAME_COLOUR;
    },
    matColour() {
      return this.frameConfig.matColour || DEFAULT_MAT_COLOUR;
    },

    isImageLoaded() {
      if (this.state == AppState.SERVER_PROCESSING) {
        return false;
      } else {
        return true;
      }
    },
    noVideoAvailable() {
      if (this.state == VIDEO_NOT_AVAILABLE) {
        return true;
      } else {
        return false;
      }
    },
    displayOverlay() {
      if (this.state == VIDEO_READY || this.state == TAKING_SCREENSHOT) {
        return true;
      } else {
        return false;
      }
    },
    matMaterial() {
      return "color:" + this.matColour;
    },
    frameMaterial() {
      if (this.frameConfig.showFrame)
        return "color:" + this.frameColour;
      else
        return "color:" + this.frameColour+";opacity:0.0; transparent: true";
    },
    artworkPosition() {
      return `0 ${INITIAL_ARTWORK_HEIGHT} ${INITIAL_ARTWORK_DISTANCE}`;
    },
    cameraPosition() {
      return `0 ${INITIAL_CAM_HEIGHT} ${INITIAL_CAM_DISTANCE}`;
    },

    triggerPosition() {
      return `0 ${INITIAL_ARTWORK_HEIGHT} ${TRIGGER_DISTANCE} `;
    },

    triggeLockPosition() {
      return `0 ${INITIAL_ARTWORK_HEIGHT} ${TRIGGER_DISTANCE + 0.1} `;
    },

    showTrigger() {
      if (this.previewMode == IMAGE_PLACED) {
        return false;
      } else {
        return true;
      }
    },

    showArtwork() {
      if (this.previewMode == IMAGE_PLACED) {
        return "true";
      } else {
        return "false";
      }
    },

    showLockIndicator() {
      if (
        this.previewMode == IMAGE_PLACED ||
        this.previewMode == IMAGE_REPLACING
      ) {
        return "true";
      }
    },
    lockIndicatorIcon() {
      if (this.previewMode == IMAGE_PLACED && this.headsetConnected) {
        return "#srcLock";
      } else if (this.previewMode == IMAGE_PLACED && !this.headsetConnected) {
        return "#srcUnlock";
      } else if (this.previewMode == IMAGE_REPLACING) {
        return "#srcUnlock";
      } else return "#srcLock";
    },
    buttonsDisabled() {
      if (
        this.state == VIDEO_READY &&
        (this.previewMode == IMAGE_PLACED ||
          this.previewMode == IMAGE_INITIAL_PLACING)
      ) {
        return false;
      } else {
        return true;
      }
    },
    isProcessing() {
      if (this.state == WEBCAM_INIT || this.state == TAKING_SCREENSHOT) {
        return true;
      } else {
        return false;
      }
    },
    snapshotBtLbl() {
      if (this.state == WEBCAM_INIT) {
        return "Starting webcam";
      } else if (this.state == TAKING_SCREENSHOT) {
        return "Hold on...";
      } else if (this.previewMode == IMAGE_INITIAL_PLACING) {
        return "Place it";
      } else {
        return "This is it!";
      }
    }
  },

  template: `
   <div class="container-fluid">
   <nav id="navbar" class="navbar navbar-expand-lg navbar-light bg-light">
   <button class="navbar-toggler border-0 p-0" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01"
     aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
     <span class="navbar-toggler-icon"></span>
   </button>
   <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
        <a class="navbar-brand" href="/"><img src="../../../dist/img/logo_bunt.png" alt="artific logo" id="logo-nav" class="img-fluid"></a>
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
          <li class="nav-item">
            <a class="nav-link" href="/about.html">About</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/museum.html">For museums</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/contact.html">Contact</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/impressum.html">Legal Disclosure</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/privacypolicy.html">Privacy policy</a>
          </li>
          <li class="nav-item">
          <a
            class="nav-link"
            id="som-wrapper"
            href="https://twitter.com/AppArtific"
            target="_blank"
            ><i id="twitter-icon" class="fab fa-twitter pl-lg-3"></i
          ></a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            id="som-wrapper"
            href="https://www.instagram.com/artific.app/"
            target="_blank"
            ><i id="insta-icon" class="fab fa-instagram pl-lg-3"></i></i
          ></a>
        </li>
        </ul>
      </div>
   <span class="navbar-text">
Place the image on your wall
   </span>

 </nav>
    <p class="bg-light" v-if="debug">{{debugStr}}</p>
    
    <div class="ar-container">
      <div class="box box-1 alert alert-warning p-1" v-if="noVideoAvailable">
      <br>
        <p>
            Unfortunately we can’t access your camera. But don’t worry, you can
            still download and / or share the selected artwork.
        </p>
        <button type="button" v-on:click="checkoutWithoutSreenshot" class="btn custom-standard">Go to checkout</button>
      </div>
      <video
        id="video-el"
        width="100%"
        playsinline
        autoplay
        
        ref="video"
        
      ></video>
    
      <a-scene ref="overlay" id="overlay" v-if="displayOverlay" embedded vr-mode-ui="enabled:false" scene-listener cursor="rayOrigin: mouse;fuse:false; fuseTimeout: 0"><a-assets>
          <img crossorigin="anonymous" id="srcImage1" :src="currentImage.fileURL" />
          <img id="srcLock" src="/dist/img/lockedIcon.png" crossorigin="anonymous"/>
          <img id="srcUnlock" src="/dist/img/unlockedIcon.png" crossorigin="anonymous"/>
        </a-assets>
        <a-entity id="camera-controler" look-controls="enabled:true;hmdEnabled:false;touchEnabled:false" wasd-controls>
        
          <a-entity
            id="camera"
            camera="active: true"
            look-controls="enabled:false;hmdEnabled:false;touchEnabled:false"
            :position="cameraPosition"
            data-aframe-default-camera
            
          >
          
          </a-entity>
           <a-image
            v-if="showTrigger"
            clickable-trigger
            id="trigger"
            src="#srcImage1"
            npot="true"
            width="1"
            height="1"
            image-listener
            :position="triggerPosition"
            material = "transparent:false;opacity:0.5"
          ></a-image>
          <a-image
            v-if="showTrigger"
            clickable-trigger
            id="triggerLock"
            src="#srcUnlock"
            npot="true"
            width="0.7"
            height="0.7"
            :position="triggeLockPosition"
            material = "opacity:0.7"
          ></a-image>

        </a-entity>
        <a-entity id="framedArtwork" :visible="showArtwork">
          
          <a-plane
            v-if="frameConfig.renderMat"
            id="mat"
            width="1.8"
            height="1.2"
            position="0 1.5923205925486443 -2.89"
            :material="matMaterial"
          ></a-plane>
          <a-entity
            position="-0.8516078879934923 1.6162200397155804 -2.85"
            geometry="depth:0.1;width:0.1"
            :material="frameMaterial"
            id="left-frame"
          ></a-entity>
          <a-entity
            position="0 2.1203709574339804 -2.8511166046347225"
            geometry="depth:0.1;height:0.1;width:1.8"
            :material="frameMaterial"
            id="top-frame"
          ></a-entity>
          <a-entity
            position="0 1.126 -2.85"
            geometry="depth:0.1;height:0.1;width:1.8"
            :material="frameMaterial"
            id="bottom-frame"
          ></a-entity>
          <a-entity
            position="0.8441961799454462 1.585018086559569 -2.85"
            geometry="depth:0.1;width:0.1"
            :material="frameMaterial"
            id="right-frame"
          ></a-entity>
          
          <a-image
            :visible="showLockIndicator"
            geometry="primitive: plane"
            id="lockIndicator"
            :src="lockIndicatorIcon"
            npot="true"
            width="0.2"
            height="0.2"
            position="0 0 0 "
            material = "opacity:0.7"
            animation="property:material.opacity;delay:2000;dur:1500;startEvents:fade;to:0"
          >
          
          
          </a-image>
          
          

          <a-image
            id="artwork"
            click-drag
            src="#srcImage1"
            clickable-trigger
            npot="true"
            width="1.6"
            height="1"
            :position="artworkPosition"
            image-listener
          ></a-image>
        </a-entity>
          <a-entity
            id="lightDirect"
            light="intensity:0.6;castShadow:true"
            position="0 1 1"
            rotation=""
          >
          </a-entity>
          <a-entity id="lightAmbient" light="color:#BBB;type:ambient"></a-entity>
      </a-scene>
    </div>
    <div class="container">
      <div class="box box-5 fixed-bottom">
        <div class="btn-group w-100 btn-group-justified btn-group-lg" role="group">
          <button id="larger-btn" type="button" class="btn custom-standard mr-3 rounded-right" v-on:click="scaleDown" :disabled="buttonsDisabled"><i class="fas fa-minus-circle"></i></button>
          <button id="screenshot-btn" type="button" class="btn btn-block custom-action rounded" v-on:click="mainBtClick" :disabled="buttonsDisabled">
            <span v-if="isProcessing">
              <i class="fa fa-spinner fa-spin fa-fw"></i> {{snapshotBtLbl}}
            </span>
            <span v-else>
              <i class="fas fa-check"></i> {{snapshotBtLbl}}
            </span>
          </button>
           <button id="smaller-btn" type="button" class="btn custom-standard ml-3 rounded-left" v-on:click="scaleUp" :disabled="buttonsDisabled"><i class="fas fa-plus-circle"></i> </button>
        </div>
      </div>
    </div>
  </div>
  `,

  props: ["appstate"],
  methods: {
    onBackToList: function(event) {
      this.$router.go(-1);
    },

    changeImage: function() {
      AframeNav.adjustImageDimensions(this.frameConfig);
    },

    mainBtClick: function() {
      if (this.previewMode == IMAGE_INITIAL_PLACING) {
        this.recenter();
      } else {
        this.goToCheckout();
      }
    },

    recenter: function() {
      if (this.previewMode == IMAGE_PLACED) {
        this.previewMode = IMAGE_REPLACING;
        this.attachAnimation = false;
        AframeNav.resetLockIndicatorOpacity();
      } else {
        AframeNav.recenter();
        this.previewMode = IMAGE_PLACED;
        var lockInd = document.querySelector("#lockIndicator");
        lockInd.emit("fade");
        this.dumpCanvasGeometry();
        this.updateDebugStr();
        this.attachAnimation = true;
      }
    },

    checkoutWithoutSreenshot: function() {
      SharedStorage.putCheckoutImg(this.currentImage, null);
      this.$router.push(RouteNames.CHECKOUT);
    },

    goToCheckout: function() {
      this.state = TAKING_SCREENSHOT;
      var self = this;
      var video = this.$refs.video;
      video.pause();
      // a small delay so that the button can reload and start spinning
      setTimeout(function() {
        var canvas = document
          .querySelector("a-scene")
          .components.screenshot.getCanvas("perspective");
        CanvasUtils.combineVideoOverlay(video, canvas, function(videoScr) {
          var screenshot = videoScr.src;
          SharedStorage.putCheckoutImg(self.currentImage, screenshot);
          self.state = VIDEO_READY;
          self.$router.push(RouteNames.CHECKOUT);
        });
      }, 100);
    },
    scaleUp: function() {
      AframeNav.scale(0.1, this.frameConfig);
      this.updateDebugStr();
    },
    scaleDown: function() {
      AframeNav.scale(-0.1, this.frameConfig);
      this.updateDebugStr();
    },
    // not exposed in UI in final version
    stepForward: function() {
      AframeNav.moveCam(-0.5, this.frameConfig);
      this.updateDebugStr();
    },
    stepBack: function() {
      AframeNav.moveCam(+0.5, this.frameConfig);
      this.updateDebugStr();
    },

    // left for debug
    dumpCanvasGeometry: function() {
      var canvas = document.querySelector("canvas.a-canvas");
      console.log(
        `CLIENT - w:${canvas.clientWidth} h:${
          canvas.clientHeight
        } ratio:${canvas.clientWidth / canvas.clientHeight}`
      );
      console.log(
        `CANVAS - w:${canvas.width} h:${canvas.height} ratio: ${canvas.width /
          canvas.height}`
      );
    },

    updateDebugStr: function() {
      this.debugStr =
        AframeNav.getImageDimensions() + " " + AframeNav.getCamera();
    },
    stopVideo: function() {
      var video = this.$refs.video;
      video.pause();
      if ("srcObject" in video) {
        video.srcObject.getTracks()[0].stop();
      } else {
        video.src.stop();
      }
    },
    // TODO: finish investigation
    updateVideoProperties: function() {
      var video = this.$refs.video;
      if ("srcObject" in video) {
        var videoStream = video.srcObject.getTracks()[0];
        var settings = videoStream.getSettings();
        var maxWidth = 0;
        var maxHeight = 0;
        if (videoStream.getCapabilities) {
          var capabilities = videoStream.getCapabilities();
          maxWidth = capabilities.width.max;
          maxHeight = capabilities.height.max;
        } else {
          maxWidth = settings.width * 2;
          maxHeight = 520;
        }
        // var constraints = videoStream.getSupportedConstraints();
        var aspectRatio = settings.aspectRatio;

        var newWidth = maxWidth;
        var maxAdjustedHeight = newWidth / aspectRatio;
        var newHeight = maxAdjustedHeight;
        if (maxAdjustedHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = newHeight * aspectRatio;
        }
        var newConstraints = {
          width: { ideal: newWidth, max: newWidth },
          height: { ideal: newHeight, max: newHeight }
        };

        videoStream
          .applyConstraints(newConstraints)
          .then(() => {
            var settings = videoStream.getSettings();
            console.log("Constrains applied");
            console.log(settings);
          })
          .catch(e => {
            console.log(e);
            console.log(e.constraint);
          });
      }
    }
  },

  mounted() {
    this.state = WEBCAM_INIT;
    if (this.$route.query.hasOwnProperty("m")) {
      if (this.$route.query.m == "debug") {
        this.debug = true;
      }
    }
    var self = this;
    this.images = SharedStorage.getPreviewImgList();
    this.frameConfig = SharedStorage.getARConfig(null).frameConfig;
    this.currentImage = this.images[0];
    var video = this.$refs.video;
    this.headsetConnected = AFRAME.utils.device.checkHeadsetConnected(); // Samsung: true; Lap: false
    const isMobile = AFRAME.utils.device.isMobile(); //Samsung: true; Lap: false
    const isGearVR = AFRAME.utils.device.isGearVR();

    this.previewMode = IMAGE_INITIAL_PLACING;

    AframeNav.registerListener(AFRAME_SCENE_LISTENER, {
      init: function() {
        var overlay = this.el.sceneEl;
        var w = video.offsetWidth;
        var h = video.offsetHeight;
        overlay.width = w;
        overlay.height = h;
      },
      update: function() {}
    });

    AframeNav.registerListener(AFRAME_CLICKABLE, {
      init: function() {
        var el = this.el;
        el.addEventListener("click", function() {
          self.recenter();
        });
      }
    });

    AframeNav.registerListener(AFRAME_IMAGE_LISTENER, {
      update: function() {
        var img = this.el;
        var srcEl = img.getAttribute("src");
        var imgAsset = document.querySelector(srcEl);
        if (imgAsset) {
          if (img.id == "artwork") {

            AframeNav.adjustImageDimensions(self.frameConfig);
            self.updateDebugStr();
          } else {
            AframeNav.adjustPreviewImage();
          }
        }
      },
      init: function() {}
    });
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices
        .getUserMedia(VIDEO_CONSTRAINTS)
        .then(stream => {
          if ("srcObject" in video) {
            video.srcObject = stream;
          } else {
            video.src = window.URL.createObjectURL(stream);
          }
          video.play();

          video.onplaying = function() {
            self.state = VIDEO_READY;
          };
        })
        .catch(function(err) {
          self.state = VIDEO_NOT_AVAILABLE;
        });
    } else {
      this.state == VIDEO_NOT_AVAILABLE;
    }
  },
  beforeRouteLeave: function(to, from, next) {
    if (this.state != VIDEO_NOT_AVAILABLE && this.state != WEBCAM_INIT) {
      this.stopVideo();
    }
    next();
  }
};

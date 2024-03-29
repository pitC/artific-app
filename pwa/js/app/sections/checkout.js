import SharedStorage from "../sharedStorage.js";
import RouteNames from "../RouteNames.js";
import AppState from "../appStates.js";

export default {
  data: function() {
    return {
      image: {
        fileURL: "",
        title: "",
        author: "",
        filename: "",
        shopURL: "",
        license: "",
        subdomain: null
      },
      screenshot: null,
      sharingSupported: false,
      arGotoEnable: false,
      hideLink: true
    };
  },
  computed: {
    isScreenshot() {
      if (this.screenshot) {
        return true;
      } else {
        return false;
      }
    },
    hasBigFile() {
      if (this.image.bigFileURL) {
        return true;
      } else return false;
    },
    shopEnabled() {
      if (this.image.printURL) {
        return true;
      } else {
        return false;
      }
    },

    isImageLoaded() {
      if (this.state == AppState.SERVER_PROCESSING) {
        return false;
      } else {
        return true;
      }
    },
    instituteIcon() {
      if (this.image.subdomain) {
        return "fas fa-globe-africa";
      } else {
        return "fas fa-university";
      }
    },
    licenseIcon() {
      if (this.image.license == "Copyright") {
        return "far fa-copyright";
      } else {
        return "fab fa-creative-commons";
      }
    },
    licenseURL() {
      if (this.image.license == "CC-BY-SA 4.0") {
        return "https://creativecommons.org/licenses/by-sa/4.0/";
      } else if (this.image.license == "Public domain") {
        return "https://creativecommons.org/share-your-work/public-domain/";
      }
    },
    licenceText() {
      if (this.image.license == "Copyright") {
        return this.image.author;
      } else {
        return this.image.license;
      }
    },
    downloadFilename() {
      var filename =
        (this.image.title.replace(/\s+/g, "-").toLowerCase() || "download") +
        ".jpg";
      return filename;
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
Great choice!
    </span>
 
  </nav>
        <div id="imageDetailsContainer" class="container">
            <div class="card card-checkout" v-if="isImageLoaded">
              <div class="wrapper-checkout">
                <img v-if="isScreenshot" class="card-img-top img-fluid" :src="screenshot" alt="Card image cap">
                <img v-else class="card-img-top img-fluid" :src="image.fileURL" alt="Card image cap">
              </div>              
              <div class="card-body">
                    <h4 class="card-title">{{image.title}}</h4>
                    <p class="card-text">
                        {{image.author}}
                        <br/>{{image.year}}<br/>
                        <i :class="licenseIcon"></i> <a :href="licenseURL" target="_blank">{{licenceText}}</a><br/>
                        <i :class="instituteIcon"></i> <a :href="image.permalink" target="_blank">{{image.institution}}</a>
                        <br/>
                        
                    </p>
                    <div class="button-container">
                        <a v-if="isScreenshot" :href="screenshot" class="btn custom-standard btn-block" role="button" aria-disabled="true" :download="downloadFilename"><i class="far fa-save"></i> Save screenshot</a>
                        <a v-if="hasBigFile" :href="image.bigFileURL" target="_blank" class="btn custom-standard btn-block" role="button" aria-disabled="true" download><i class="fa fa-arrow-circle-down"></i> Download artwork</a>
                        <button v-if="sharingSupported" v-on:click="share" class="btn custom-standard btn-block" role="button" aria-disabled="true"><i class="fas fa-share-alt"></i> Share</button>
                        <span v-else>
                          <button v-on:click="shareURL" class="btn custom-standard btn-block" role="button" aria-disabled="true"><i class="fas fa-share-alt"></i> Share</button>
                          <div :hidden="hideLink" class="input-group mb-3">
                            <div class="input-group">   
                              <input type="text" class="form-control h-100" ref="shareLink" readonly/>
                              <span class="input-group-btn">
                                  <button class="btn btn-outline-secondary" type="button" v-on:click="copyToClipboard"><i class="far fa-copy"></i></button>
                              </span>
                            </div>
                          </div>
                        </span>
                        <button v-if="arGotoEnable" class="btn custom-action btn-block" role="button" aria-disabled="true" v-on:click="onTryIt"><i class="far fa-image"></i> See it on your wall</button>
                        <hr p-3>
                        <h5>Do you want to try again?</h5>
                        <a href="/" class="btn custom-action btn-block pt-2" role="button" aria-disabled="true"><i class="fa fa-undo-alt"></i> Find more art</a>
                    </div>
                </div>
            </div>
            <div v-else>
              <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
              <span class="sr-only">Loading...</span>
            </div>
            <div id="copiedToClipboard" class="modal fade bd-example-modal-sm" tabindex="-1" role="dialog" aria-hidden="true">
              <div class="modal-dialog modal-sm modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Link copied to clipboard</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                </div>
              </div>
            </div>
        </div>
    </div>
  `,
  methods: {
    getImagePermalink() {
      var protocol = window.location.protocol;
      var host = window.location.host;
      var pathname = window.location.pathname.split("#")[0];
      var imgDetails = RouteNames.IMAGE_DETAILS.replace(":id", this.image._id);
      var url = `${protocol}//${host}${imgDetails}`;
      return url;
    },
    copyToClipboard: function() {
      this.$refs.shareLink.select();
      document.execCommand("copy");
      $("#copiedToClipboard").modal("show");
    },
    shareURL: function() {
      var url = this.getImagePermalink();
      this.hideLink = false;
      this.$refs.shareLink.value = url;
    },
    onTryIt: function(event) {
      SharedStorage.putPreviewImg(this.image);
      this.$router.push(RouteNames.PREVIEW);
    },
    share: function() {
      var url = this.getImagePermalink();
      navigator.share({
        title: "Artific.app Recommendation",
        text:
          "This is the artwork https://www.artific.app recommended me, what do you think? #artificapp",
        url: url
      });
    }
  },
  mounted() {
    var id = this.$route.params.id;
    if (id) {
      this.state = AppState.SERVER_PROCESSING;
      var self = this;
      SharedStorage.getImgDetails(id, function(image) {
        if (image) {
          self.image = image;
        }
        self.state = AppState.READY;
        self.arGotoEnable = true;
      });
    } else {
      var checkoutImg = SharedStorage.getCheckoutImg();
      if (checkoutImg) {
        this.image = checkoutImg.image;
        this.screenshot = checkoutImg.screenshot;
      }
      if (navigator.share) {
        this.sharingSupported = true;
      }
    }
  }
};

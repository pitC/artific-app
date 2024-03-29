import SharedStorage from "../sharedStorage.js";
import ImgCard from "../components/imgCard.js";
import AppState from "../appStates.js";
import RouteNames from "../RouteNames.js";

Vue.component("img-card", ImgCard);

Vue.component("inp-colour-item", {
  template: `<div class='flex-fill' :style='style'></div> `,
  computed: {
    style() {
      return "background-color: " + this.colour;
    }
  },
  props: ["colour"]
});

export default {
  data: function() {
    return {
      inputColours: [],
      imgList: [],
      state: AppState.READY,
      debug: false,
      showQuestion: true
    };
  },
  computed: {
    isListReady() {
      if (this.state == AppState.SERVER_PROCESSING) {
        return false;
      } else {
        return true;
      }
    }
  },
  template: `
  <div>
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
Choose an artwork
  </span>

</nav>
    <div class="flex-row">
      <div class="d-flex w-100 colorsnav sticky-top">      
        <inp-colour-item
            v-for="colour in inputColours"
            v-bind:colour="colour"
          ></inp-colour-item>
      </div>
    
      <div class="card-columns" v-if="isListReady">
        <img-card
          v-for="img in imgList"
          
          :calclog="img.calclog"
          :fileurl="img.fileURL"
          :title="img.title"
          :author="img.author"
          :reason="img.reason"
          :_id="img._id"
          :year="img.year"
          :institution="img.institution"
          :institutionURL="img.institutionURL"
          :permalink="img.permalink"
          :subdomain="img.subdomain"
          :debug="debug"
          @preview-requested="onPreviewRequest"
        ></img-card>
        <div v-if="showQuestion" class="card text-center">
          <div class="card-body">
            <span class="h1">
            <i class="far fa-meh"></i>
            </span>
            <p>
              Still haven't found what you're looking for?
            </p>
            <div class="button-container">
              <button type="button" class="btn custom-action" v-on:click="goToQuestion"><i class="fas fa-pencil-alt"></i> Answer some questions</button>
            </div>
          </div>
        </div>
      </div>
      <div class="container" v-else>
        <div class="box box-1">
          <span class="h5">
            <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
          </span>
        </div>
      </div>
    </div>
</div>
  `,
  methods: {
    goBack: function(event) {
      this.$router.go(-1);
    },
    onPreviewRequest: function(id) {
      var img = this.imgList.find(o => o._id == id);
      SharedStorage.putPreviewImg(img);
      this.$router.push(RouteNames.PREVIEW);
    },
    goToQuestion: function() {
      var blacklist = this.imgList.map(o => o._id);
      SharedStorage.putBlacklist(blacklist);

      this.$router.push({
        path: RouteNames.QUESTION,
        query: this.$route.query
      });
    }
  },
  mounted: function() {
    if (this.$route.query.hasOwnProperty("m")) {
      if (this.$route.query.m == "debug") {
        this.debug = true;
      }
    }
    this.inputColours = SharedStorage.inputColours;
    var self = this;
    this.state = AppState.SERVER_PROCESSING;
    let collectionFilter = null;
    if (this.$route.query.hasOwnProperty("c")) {
      collectionFilter = this.$route.query.c;
    }
    SharedStorage.getImgList(this.inputColours, collectionFilter, function(
      imgList,
      returnPalette,
      questionsAvailable
    ) {
      self.imgList = imgList;
      self.state = AppState.READY;

      self.showQuestion =
        SharedStorage.areQuestionsLeft() && questionsAvailable;
    });
  }
};

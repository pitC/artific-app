import RouteNames from "../RouteNames.js";
import AppState from "../appStates.js";

export default {
  data: function() {
    return {
      
    };
  },
  computed: {},
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
Hi there!
   </span>

 </nav>
    <div class="container">
    <div class="box box-1">
    <img src="dist/img/logo_white.png" alt="artific logo" id="logo-index" class="img-fluid">
    
  </div>
  <div class="text-light box box-2">
   
      <p class="lead intro-text">We recommend you artworks matching your <b>color scheme</b> and <b>taste</b>. Take a picture or answer a few questions in order to <b>discover</b> over 1900 masterpieces, <b>preview</b> them on your wall with <b>augmented reality</b>, <b>download</b> the high-resolutions files for free or <b>order</b> the prints.</p> 
     <!-- <p class="lead bold">Artific is a free online tool for everybody.<br>For more art in your everyday life.</p>-->
   
  </div>
  <div class="box box-3 pt-1">

    <div class="mt-auto mt-md-0">
      <a role="button" class="btn custom-standard btn-block" v-on:click="onToColourPicker">
        <i class="fas fa-camera"></i> Take a photo
      </a>
      <a role="button" class="btn custom-standard btn-block" v-on:click="onToQuestions"><i class="fab fa-fly"></i> Discover
      </a>
    </div>
  </div>
    </div>
  </div>
  `,
  methods: {
      onToQuestions: function(event){
          this.$router.push(RouteNames.QUESTION);
      },
      onToColourPicker: function(event){
          this.$router.push(RouteNames.PHOTO_INPUT)
      }
    
  },

  mounted() {
    console.log("Index mounted!")
  }
};
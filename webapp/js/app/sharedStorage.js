const RECOMMEND_URL = "https://api.artific.app/recommend";
const IMAGE_URL = "https://api.artific.app/image";
const QUESTIONS_URL = "https://api.artific.app/questions";
const AR_CONFIG_URL = "https://api.artific.app/arconfig";
const DEF_MAX_QUESTION_CNT = 100;
export default {
  inputColours: [],
  imgList: [],
  previewImgList: [],
  imgWhitelist: [],
  imgBlacklist: [],
  questionSet: [],
  answerList: [],
  maxQuestionCnt: DEF_MAX_QUESTION_CNT,
  answerIterations: 0,
  recommendationValid: false,
  arConfig: null,
  checkoutImg: {
    image: null,
    screenshot: null
  },
  putInputColours: function(inpColours) {
    this.recommendationValid = false;
    this.resetAnswers();
    this.inputColours = inpColours;
  },
  putPreviewImg: function(img) {
    this.previewImgList = [];
    this.previewImgList.push(img);
  },

  putCheckoutImg: function(seletedImage, screenshot) {
    this.checkoutImg.image = seletedImage;
    this.checkoutImg.screenshot = screenshot;
  },

  getCheckoutImg: function() {
    return this.checkoutImg;
  },

  getPreviewImgList: function() {
    return this.previewImgList;
  },
  getImgList: function(colours, collectionFilter, callback) {
    if (this.recommendationValid) {
      callback(this.imgList);
    } else { 
      var request = {
        colours: colours,
        answers: this.answerList,
        blacklist: this.imgBlacklist,
        enhance: true,
        collectionFilter:collectionFilter
      };

      var paletteUsed = [];
      axios.post(RECOMMEND_URL, request).then(response => {
        this.imgList.splice(0, this.imgList.length);
        for (var index in response.data.paletteUsed) {
          paletteUsed.push({
            colour: response.data.paletteUsed[index],
            population: null
          });
        }
        for (var index in response.data.images) {
          var respImg = response.data.images[index];
          var img = {
            filename: respImg.filename,
            _id: respImg._id,
            title: respImg.title,
            author: respImg.author,
            year: respImg.year,
            institution: respImg.institution,
            institutionURL: respImg.institutionURL,
            printURL: respImg.printURL,
            reason: respImg.recommendationReason,
            fileURL: respImg.fileURL,
            bigFileURL: respImg.bigFileURL,
            calclog: respImg.calcLog,
            colours: respImg.colours,
            permalink: respImg.permalink,
            license: respImg.license,
            subdomain: respImg.subdomain
          };
          this.imgList.push(img);
        }
        this.recommendationValid = true;
        var questionsAvailable = response.data.questionsAvailable || false;
        callback(this.imgList, paletteUsed, questionsAvailable);
      });
    }
  },

  getImgDetails: function(id, callback) {
    var imgInLocalList = false;
    if (this.getImgList.length > 0) {
      var image = this.imgList.find(obj => obj._id == id);
      if (image) {
        imgInLocalList = true;
        callback(image);
      }
    }
    if (!imgInLocalList) {
      var url = `${IMAGE_URL}/${id}`;
      axios.get(url).then(response => {
        if (response.status == 200) {
          callback(response.data);
        } else {
          callback(null);
        }
      });
    }
  },

  resetAnswers: function() {
    this.answerList = [];
    this.questionSet = [];
  },

  loadQuestions: function(callback) {
    axios.get(QUESTIONS_URL).then(response => {
      if (response.status == 200) {
        this.questionSet = response.data;
        this.maxQuestionCnt = this.questionSet.length;
        callback(this.questionSet.length);
      }
    });
  },

  getRandomQuestion: function(callback) {
    var self = this;
    function pickRandom(cb) {
      var index = Math.floor(Math.random() * self.questionSet.length);
      var randomQuestion = self.questionSet[index];
      cb(randomQuestion);
    }

    if (this.questionSet.length == 0) {
      this.resetAnswers();
      this.loadQuestions(function(loadedQuestionCnt) {
        if (loadedQuestionCnt > 0) {
          pickRandom(callback);
        } else {
          callback(null);
        }
      });
    } else {
      pickRandom(callback);
    }
  },

  putAnswer: function(questionId, answer) {
    var answerObj = {};
    answerObj[questionId] = answer;
    // reset answer list
    this.answerIterations++;
    this.answerList = [];
    this.answerList.push(answerObj);
    var index = this.questionSet.findIndex(o => o.id == questionId);
    this.questionSet.splice(index, 1);
    this.recommendationValid = false;
  },

  areQuestionsLeft: function() {
    if (this.answerIterations < this.maxQuestionCnt) {
      return true;
    } else {
      return false;
    }
  },

  putBlacklist: function(images) {
    this.imgBlacklist.push.apply(this.imgBlacklist, images);
  },

  getARConfig: function(callback){
    // HACK synchronuous call
    // TODO: replace with proper API call
    var arConfig = {}
    arConfig['frameConfig'] = {
      renderMat: true,
      showFrame:true,
      depth: 0.1,
      width: 0.02,
      matPad: 0.2,
      frameColour: "#fcf0d1",
      matColour: "#fcf0d1"
    }
    if (window.location.href.includes('wwieteska')){
      arConfig.frameConfig.frameColour = "#1b1e23";
      arConfig.frameConfig.renderMat = false;
    }
    
    return arConfig

  }
};

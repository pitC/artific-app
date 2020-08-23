var questionnaire = require("questionnaire.json")
var questionSet = [];
Object.keys(questionnaire).forEach(function(key, index) {
  var qId = key;
  var qText = questionnaire[key].text;
  var qAnswers = questionnaire[key]["answers"].map(o => o.answer);
  var qObj = {
    id: qId,
    question: qText,
    answers: qAnswers
  };
  questionSet.push(qObj);
});

function getQuestions() {
  
  return questionSet;
}

exports.handler = async (event) => {
    // TODO implement
    console.log(event)
    const response = getQuestions();
    return response;
};
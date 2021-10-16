var questionnaire = require("./app/interview/questionnaire.json")
var questionSet = [];
Object.keys(questionnaire).forEach(function (key, index) {
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
  let response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(questionSet),
  };
  return response;
}

exports.handler = async (event) => {
  console.log(event)
  let response = getQuestions();
  return response;
};
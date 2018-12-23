const constants = require('./commonconstants')
const {speechResponses, SKILL_NAME} = constants('../')

module.exports = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest'
        && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
        .speak(HELP_MESSAGE)
        .reprompt(HELP_REPROMPT)
        .withSimpleCard(SKILL_NAME, speechText)
        .getResponse();
    },
  };
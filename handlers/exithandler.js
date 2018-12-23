const constants = require('./commonconstants')
const {speechResponses, SKILL_NAME, STOP_MESSAGE} = constants('../')

module.exports = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest'
        && (request.intent.name === 'AMAZON.CancelIntent'
          || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
        .speak(STOP_MESSAGE)
        .withSimpleCard(SKILL_NAME, STOP_MESSAGE)
        .getResponse();
    },
  };
  
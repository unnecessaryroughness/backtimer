const constants = require('./commonconstants')
const {speechResponses, SKILL_NAME, UNHANDLED_MESSAGE} = constants('../')

module.exports = {
    // Modify this to understand breadcrumbs and offer context sensitive help
    canHandle(handlerInput) {
      return true
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
        .speak(UNHANDLED_MESSAGE)
        .reprompt(UNHANDLED_MESSAGE)
        .getResponse();
    },
  };
  
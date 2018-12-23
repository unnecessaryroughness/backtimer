const constants = require('./commonconstants')
const {speechResponses, SKILL_NAME} = constants('../')

module.exports = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
  
      return handlerInput.responseBuilder
        .speak('Sorry, an error occurred. Trust me, you don\'t want to know the details.')
        .reprompt('Sorry, an error occurred.')
        .getResponse();
    },
  }

  
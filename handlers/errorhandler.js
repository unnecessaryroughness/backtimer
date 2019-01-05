const {configHandler} = require('./commonconstants')()
const errorOccurred = configHandler.get('AlexaEventSpeech', 'ERROR_OCCURRED', "Speech Undefined") 
const errorOccurredReprompt = configHandler.get('AlexaEventSpeech', 'ERROR_OCCURRED_REPROMPT', "Speech Undefined")

module.exports = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`)
      return handlerInput.responseBuilder
        .speak(errorOccurred)
        .reprompt(errorOccurredReprompt)
        .getResponse();
    },
  }

  
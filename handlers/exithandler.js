const constants = require('./commonconstants')
const {configHandler} = constants('../')
const stopMessage = configHandler.get('AlexaEventSpeech', 'STOP_MESSAGE', "Speech Undefined")
const skillName = configHandler.get('AlexaSkillSettings', 'SKILL_NAME', "[Skill Name]")

module.exports = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request
      return request.type === 'IntentRequest'
        &&  (request.intent.name === 'AMAZON.CancelIntent'
          || request.intent.name === 'AMAZON.StopIntent')
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
        .speak(stopMessage)
        .withSimpleCard(skillName, stopMessage)
        .getResponse();
    },
  }
  
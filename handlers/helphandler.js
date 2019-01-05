const {configHandler} = require('./commonconstants')()
const skillName = configHandler.get('AlexaSkillSettings', 'SKILL_NAME', "[Skill Name]")
const helpMessage = configHandler.get('AlexaEventSpeech', 'HELP_MESSAGE', "[Skill Name]")
const helpMessageReprompt = configHandler.get('AlexaEventSpeech', 'HELP_REPROMPT', "[Skill Name]")

module.exports = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request
      return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent'
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
        .speak(helpMessage)
        .reprompt(helpMessageReprompt)
        .withSimpleCard(skillName, helpMessage)
        .getResponse();
    },
  }

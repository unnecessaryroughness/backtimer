const {configHandler, speechResponses} = require('./commonconstants')()
const skillName = configHandler.get('AlexaSkillSettings', 'SKILL_NAME', "[Skill Name]")
const unhandledMessage = configHandler.get('AlexaEventSpeech', 'UNHANDLED_MESSAGE', "Unhandled")

module.exports = {
    // Modify this to understand breadcrumbs and offer context sensitive help
    canHandle(handlerInput) {
      return true
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
        .speak(unhandledMessage)
        .reprompt(unhandledMessage)
        .withSimpleCard(skillName, unhandledMessage)
        .getResponse();
    },
  };
  
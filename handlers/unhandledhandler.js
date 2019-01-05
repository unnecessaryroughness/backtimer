const {configHandler, speechResponses, sessionHandler} = require('./commonconstants')()
const skillName = configHandler.get('AlexaSkillSettings', 'SKILL_NAME', "[Skill Name]")

module.exports = {
  canHandle(handlerInput) {
    return true
  },
  handle(handlerInput) {
    const uhmSpeech = this.parseUHM(sessionHandler.getSession(handlerInput))
    return handlerInput.responseBuilder
      .speak(uhmSpeech)
      .reprompt(uhmSpeech)
      .withSimpleCard(skillName, uhmSpeech)
      .getResponse();
  },
  parseUHM(sessionAttributes) {
    let lastBreadcrumb = sessionAttributes.getNewestBreadcrumb().toUpperCase().replace(/ /g, '_')
    let intentSpeechResponses = speechResponses(sessionAttributes.intentType)
    speechText = intentSpeechResponses.parse(`LAST_BREADCRUMB_${lastBreadcrumb}`, [], 'AlexaUnhandledPrompts')
    return speechText
  }
}

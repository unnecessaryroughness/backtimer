const {configHandler, speechResponses, sessionHandler} = require('./commonconstants')()
const skillName = configHandler.get('AlexaSkillSettings', 'SKILL_NAME', "[Skill Name]")

module.exports = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request
      return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent'
    },
    handle(handlerInput) {
      const helpSpeech = this.parseHelp(sessionHandler.getSession(handlerInput))
      return handlerInput.responseBuilder
        .speak(helpSpeech)
        .reprompt(helpSpeech)
        .withSimpleCard(skillName, helpSpeech)
        .getResponse();
    },
    parseHelp(sessionAttributes) {
      let lastBreadcrumb = sessionAttributes.getNewestBreadcrumb().toUpperCase().replace(/ /g, '_')
      let intentSpeechResponses = speechResponses(sessionAttributes.intentType)
      console.log(lastBreadcrumb)
      speechText = intentSpeechResponses.parse(`LAST_BREADCRUMB_${lastBreadcrumb}`, [], 'AlexaHelpPrompts')
      return speechText
    }
}

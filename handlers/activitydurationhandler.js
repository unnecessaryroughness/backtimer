const {configHandler, sessionHandler, speechResponses} = require('./commonconstants')()
const skillName = configHandler.get('AlexaSkillSettings', 'SKILL_NAME', "[Skill Name]")

module.exports = {
    canHandle(handlerInput) {
      let request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest'
        && request.intent.name === 'ActivityDurationIntent'
    },
    handle(handlerInput) {
      let request = handlerInput.requestEnvelope.request
      let sessionAttributes = sessionHandler.getSession(handlerInput)
      let intentSpeechResponses = speechResponses(sessionAttributes.intentType)
      let minutesFound = request.intent.slots.Minutes.value
    
      sessionAttributes 
        .updateActivity(null, minutesFound)
        .addBreadcrumb(`Duration`)
      
      sessionHandler.updateSession(handlerInput, sessionAttributes)
      
      let {name, duration} = sessionAttributes.getNewest()

      let speechText = intentSpeechResponses.parse('REQ_ACTIVITY_CONFIRMATION', [name, duration]) + 
                        intentSpeechResponses.parse('REQ_ADD_ANOTHER_PROMPT') 
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard(skillName, speechText)
        .getResponse()
      }
  }

  
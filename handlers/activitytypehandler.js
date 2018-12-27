const constants = require('./commonconstants')
const {configHandler, sessionHandler, speechResponses} = constants('../')
const skillName = configHandler.get('AlexaSkillSettings', 'SKILL_NAME', "[Skill Name]")

module.exports = {
    canHandle(handlerInput) {
      let request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest' && request.intent.name === 'ActivityTypeIntent'
    },
    handle(handlerInput) {
      let request = handlerInput.requestEnvelope.request
      let sessionAttributes = sessionHandler.getSession(handlerInput)
      let intentSpeechResponses = speechResponses(sessionAttributes.intentType)
      let activityFound = request.intent.slots.ActivityType.value
    
      sessionAttributes
        .addActivity()
        .updateActivity(activityFound)
        .addBreadcrumb(`Activity Type`)
      
      sessionHandler.updateSession(handlerInput, sessionAttributes)
  
      const speechText = intentSpeechResponses.parse('REQ_ACTIVITY_DURATION', [activityFound])
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard(skillName, speechText)
        .getResponse()
    }
  }

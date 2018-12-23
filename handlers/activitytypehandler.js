const constants = require('./commonconstants')
const {sessionHandler, speechResponses, SKILL_NAME} = constants('../')

module.exports = {
    canHandle(handlerInput) {
      let request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest'
        && request.intent.name === 'ActivityTypeIntent'
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
  
      let speechText = intentSpeechResponses.parse('REQ_ACTIVITY_DURATION', [activityFound])
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard(SKILL_NAME, speechText)
        .getResponse()
    }
  }

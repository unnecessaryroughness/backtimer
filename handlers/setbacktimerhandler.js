const constants = require('./commonconstants')
const {sessionHandler, speechResponses, SKILL_NAME} = constants('../')

module.exports = {
    canHandle(handlerInput) {
      let request = handlerInput.requestEnvelope.request;
      return request.type === 'LaunchRequest'
        || request.type === 'IntentRequest'
        && ['SetMealTimer','SetBackTimer'].includes(request.intent.name);
    },
    handle(handlerInput) {
      let request = handlerInput.requestEnvelope.request;
      let sessionAttributes = sessionHandler.getSession(handlerInput)
      let intentType = request.type == 'LaunchRequest' ? 'SetMealTimer' : request.intent.name
  
      sessionAttributes
        .reset(intentType)
        .addBreadcrumb('Init')
      
      let speechText = speechResponses(sessionAttributes.intentType).parse('REQ_ACTIVITY_NAME', ['first'])
  
      sessionHandler.updateSession(handlerInput, sessionAttributes)
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard(SKILL_NAME, speechText)
        .getResponse();
    }
  }
  

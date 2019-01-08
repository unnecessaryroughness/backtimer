const {configHandler, sessionHandler, speechResponses} = require('./commonconstants')()
const skillName = configHandler.get('AlexaSkillSettings', 'SKILL_NAME', "[Skill Name]")
const delayCalc = require('../lib/delaycalculator')

module.exports = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest' && (request.intent.name === 'NowIntent' || request.intent.name === 'FinishByIntent')
    },
    handle(handlerInput) {
      let request = handlerInput.requestEnvelope.request
      let sessionAttributes = sessionHandler.getSession(handlerInput)
      let intentSpeechResponses = speechResponses(sessionAttributes.intentType)
      let activityList = sessionAttributes.activityList
      let speechText = 'now placeholder'
      let finishTimeFound = (request.intent.slots && request.intent.slots.FinishTime) ? request.intent.slots.FinishTime.value : null
      let longestMins = (activityList[0].duration)
      let delayCalcOutput = delayCalc(finishTimeFound, longestMins)
      let {waitSeconds, overridden, overriddenTime, fixedTime} = delayCalcOutput

      // console.log(`found FinishTime: `, finishTimeFound)
      // console.log(`delay calc output: \n`, JSON.stringify(delayCalcOutput, null, 2))
      // console.log(`waiting for ${waitSeconds}`)

      sessionAttributes
        .addBreadcrumb(`Confirm Alarm Schedule`)
        .setWaitSeconds(parseInt(waitSeconds))

      sessionHandler.updateSession(handlerInput, sessionAttributes)

      if (overridden) {
        speechText = intentSpeechResponses.parse('WARN_NOT_ENOUGH_TIME', [overriddenTime, fixedTime]) 
      } else {
        speechText = intentSpeechResponses.parse('SAY_OK') 
      }

      speechText += intentSpeechResponses.parse('REQ_PLAYBACK_REMINDERS_1', [activityList.length +1])
      
      for (let activity of activityList) {
        let mins = ((activity.startsecs / 60) + (waitSeconds / 60)).toFixed(0)
        let phrase = mins > 0 ?  'REQ_PLAYBACK_REMINDERS_2b' : 'REQ_PLAYBACK_REMINDERS_2a'
        speechText += intentSpeechResponses.parse(phrase, [activity.name, mins, (mins > 1) ? 's' : ''])
      }
  
      if (waitSeconds === 0) {
        speechText += intentSpeechResponses.parse('REQ_PLAYBACK_REMINDERS_2c', [longestMins, (longestMins > 1) ? 's' : ''])
      } else {
        speechText += intentSpeechResponses.parse('REQ_PLAYBACK_REMINDERS_2d', [fixedTime])
      }

      speechText += intentSpeechResponses.parse('REQ_PLAYBACK_REMINDERS_3')
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard(skillName, speechText)
        .getResponse();
    }
  }


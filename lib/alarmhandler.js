/*
    ALARMHANDLER.JS 
    ============

    Purpose: 
        * Facilitates the setting of a series of Alexa alarms
        * Handles the HTTPS communication to the Alexa API 
        * Returns a status on each alarm creation 

    Returns: 
        * Object: 
            - alarms: (list of objects)
                - alarm: (object)
                    - created: (boolean)
                    - timestamp: (UTC date time)
*/


// const callAPI = (token, url, payload = null) => new Promise((resolve, reject) => {
//   if (!token) reject(new Error('Error calling URL - user is not logged in'))
//   if (!url) reject(new Error('Error calling URL - missing URL string'))
//   let config = {
//     url: url,
//     method: 'post',
//     headers: {'Authorization': 'bearer ' + token, 
//               'Content-Type': 'application/json'},
//     data: payload
//   }
//   console.log('API Call Configuration -->', config)
//   Axios.request(config)
//     .then((response) => resolve(response))
//     .catch((error) => reject(error))
// })



// const SetAlarmHandler = {
//     canHandle(handlerInput) {
//         const request = handlerInput.requestEnvelope.request;
//         return request.type === 'LaunchRequest'
//           || (request.type === 'IntentRequest'
//           && request.intent.name === 'setAlarm')
//     },
//     handle(handlerInput) {
//       let currentTime = new Date();
//       let useBody = {
//           requestTime : currentTime.toISOString(),
//           trigger: {
//                type : "SCHEDULED_RELATIVE",
//                offsetInSeconds : 30,
//           },
//           alertInfo: {
//                spokenInfo: {
//                    content: [{
//                        locale: "en-US", 
//                        text: "test the reminder function"
//                    }]
//                }
//            },
//            pushNotification : {                            
//                 status : "ENABLED"         
//            }
//         }
//       let endpoint = handlerInput.requestEnvelope.context.System.apiEndpoint  
      
//       callAPI(handlerInput.requestEnvelope.context.System.apiAccessToken, endpoint + REMINDER_ENDPOINT, useBody)
//         .then(apiResult => {
//           console.log('successfully added reminder', apiResult)
//         })
//         .catch(apiErr => {
//           console.log('oh bugger - an error occurred ->', apiErr)
//         })

//       return handlerInput.responseBuilder
//         .speak('I have attempted to add a reminder')
//         .withSimpleCard(SKILL_NAME, 'reminder requested')
//         .getResponse();
//     }
// };


module.exports = (alarmList = []) => {
    // handle setting of a list of alarms
    return {
        alarms: []
    }
}


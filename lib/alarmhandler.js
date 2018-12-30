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

const Alexa = require('ask-sdk');
const Axios = require('axios')

const REMINDER_ENDPOINT = '/v1/alerts/reminders'


const callAPI = (token, url, payload = null) => new Promise((resolve, reject) => {
  if (!token) reject(new Error('Error calling URL - user is not logged in'))
  if (!url) reject(new Error('Error calling URL - missing URL string'))
  let config = {
    url: url,
    method: 'post',
    headers: {'Authorization': 'bearer ' + token, 
              'Content-Type': 'application/json'},
    data: payload
  }
  console.log('API Call Configuration -->', JSON.stringify(config, null, 2))
  Axios.request(config)
    .then((response) => resolve(response))
    .catch((error) => reject(error))
})



const SetAlarmHandler = (textContent, offsetSecs, endpoint, token) => {
    return new Promise((resolve, reject) => {
        let currentTime = new Date();
        offsetSecs = (offsetSecs < 5) ? 5 : offsetSecs 
        let reminderContent = (textContent === 'Complete') ? 'Everything should now be complete' : 'Time to start ' + textContent
        let useBody = {
            requestTime : currentTime.toISOString(),
            trigger: {
                type : "SCHEDULED_RELATIVE",
                offsetInSeconds : offsetSecs,
            },
            alertInfo: {
                spokenInfo: {
                    content: [{
                        locale: "en-US", 
                        text: reminderContent
                    }]
                }
            },
            pushNotification : {                            
                status : "ENABLED"         
            }
        }
        callAPI(token, endpoint + REMINDER_ENDPOINT, useBody)
            .then(apiResult => {
                console.log('successfully added reminder')
                resolve(apiResult)
            })
            .catch(apiErr => {
                console.log('oh bugger - an error occurred')
                reject(apiErr)
            })
    })
};


module.exports = (alarmList = [], waitSeconds, endpoint, token) => {
    return new Promise((resolve, reject) => {
        // handle setting of a list of alarms
        let alarms = []
        let maxAlarms = alarmList.length 
        let alarmsCompleted = 0

        // push 'all completed' entry onto alarmList array
        alarmList.push({
            name: 'Complete',
            duration: 0,
            startsecs: (alarmList[0].duration * 60) + waitSeconds
        })

        for (let alarm of alarmList) {
            SetAlarmHandler(alarm.name, alarm.startsecs + waitSeconds, endpoint, token)
                .then(alarmResult => {
                    console.log("success handler")
                    console.log(alarmResult)
                    let {status, statusText, data} = alarmResult
                    alarms.push({name: alarm.name, status, statusText, data} || alarmResult)
                    alarmsCompleted++
                    if (alarmsCompleted >= maxAlarms) {
                        console.log("then routine all alarms complete. resolving...")
                        resolve(alarms)
                    }
                })
                .catch(alarmError => {
                    let {status, statusText, data} = alarmError.response
                    alarms.push({name: alarm.name, status, statusText, data} || alarmError)
                    console.log("catch routine all alarms complete. resolving...")
                    reject(alarms)
                })
        }
    })
}


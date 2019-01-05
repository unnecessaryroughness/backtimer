/*
    DELAYCALCULATOR.JS 
    ==================

    Purpose: 
        * Accepts time in the future and determines how many seconds there are between now and then
        * 'thenTime' parameter may be in the form (24 hour clock): 
            - hh
            - hh:mm 
        * Executes a check that 'thenTime' isn't before now, including errors caused by not saying 'PM'
          in the intent spoken to Alexa

    Returns: 
        * Object: 
            - now: (ISO date string)
            - then: (ISO date string)
            - waitSeconds: numeric
*/

module.exports = (thenTime, longestDuration = '0') => {
    const rtnVal = {
        rawTime: thenTime,
        fixedTime: thenTime ? thenTime.concat(':00').substr(0, 5) : '00:00',
        today: '',
        now: '', 
        then: '', 
        longestDuration: longestDuration,
        waitSeconds: 0
    }

    const now = new Date()
    rtnVal.now = now.toISOString()
    rtnVal.today = (now.toISOString()).split('T')[0]

    if (!thenTime) {
        rtnVal.then = now.toISOString()
        rtnVal.waitSeconds = 0
    } else {    
        let then = new Date(rtnVal.today.concat('T', rtnVal.fixedTime))
        let timeDiff = (then.getTime() - now.getTime())/1000

        // if the time difference is negative then the target date is in the past. 
        // the user has probably forgotten to specify AM/PM. Add twelve hours and continue.
        if (timeDiff < 0) {
            then.setHours(then.getHours() + 12)
            timeDiff = (then.getTime() - now.getTime()) / 1000
            rtnVal.fixedTime = then.toISOString().split('T')[1].substr(0, 5)
        }
        rtnVal.then = then.toISOString()
        rtnVal.waitSeconds = (timeDiff - (parseInt(longestDuration)*60)).toString()
    }

    return rtnVal
}

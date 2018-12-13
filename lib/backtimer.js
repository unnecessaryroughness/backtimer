/*
    BACKTIMER.JS 
    ============

    Purpose: 
        * Accepts a list of arbitrary activities with durations
            - each activity is an object of form {name: xxx, duration: nnn}
        * Sorts by descending duration
        * Determines how long to wait after the first activity before starting to complete all other activities 

    Returns: 
        * Object: 
            - longestActivity: (object)
            - activities: (list of objects)
*/

module.exports = (activities) => {
    activities = activities.sort((a, b) => parseInt(a.duration) > parseInt(b.duration) ? -1 : 1)
    let longestActivity = activities[0]
    let prevDuration = longestActivity.duration 
    activities = activities.map(activity => {
        countdown = prevDuration - activity.duration
        prevDuration = activity.duration
        return {
            ...activity,
            startsecs: (longestActivity.duration - activity.duration) * 60,
            countdown
        }
    })
    return {
        longestActivity,
        activities
    }
}

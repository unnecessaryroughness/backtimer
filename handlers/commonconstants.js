module.exports = (pathToRoot = './') => {
    return {
        backtimer: require(`${pathToRoot}lib/backtimer`),
        speechResponses: require(`${pathToRoot}lib/speechresponses`),
        sessionHandler: require(`${pathToRoot}lib/sessionhandler`),
        alarmHandler: require(`${pathToRoot}lib/alarmhandler`),
        configHandler: require(`${pathToRoot}lib/configfileparser`)
    }
}

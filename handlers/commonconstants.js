module.exports = (pathToRoot = './') => {
    return {
        backtimer: require(`${pathToRoot}lib/backtimer`),
        speechResponses: require(`${pathToRoot}lib/speechresponses`),
        sessionHandler: require(`${pathToRoot}lib/sessionhandler`),
        alarmHandler: require(`${pathToRoot}lib/alarmhandler`),
        SKILL_NAME: 'Backtimer',
        HELP_MESSAGE: 'You can ask backtimer to "plan a meal", or, you can ask backtimer to "plan this"... What can I help you with?',
        HELP_REPROMPT: 'What can I help you with?',
        STOP_MESSAGE: 'Goodbye!',
        UNHANDLED_MESSAGE: "I didn't understand that instruction. Did you mean to say, Add, before giving an ingredient name?"
    }
}

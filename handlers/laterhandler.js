const constants = require('./commonconstants')
const {configHandler, speechResponses} = constants('../')
const skillName = configHandler.get('AlexaSkillSettings', 'SKILL_NAME', "[Skill Name]")

module.exports = {
    // write data to DDB that can be recovered later
    // save session.user.userId along with the name of the longest ingredient 
    // update lambda service role to allow access to a single DDB table 
    // ensure a single user can't store more than three concurrent schedules in the table
    // put a TTL on each DDB record for housekeeping
}

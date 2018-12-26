/*
    CONFIGFILEPARSER.JS 
    ===================

    Purpose: 
        * Opens ./etc/config.ini and caches the contents
        * Provides a 'get' method to read a section/option value from the config 

    Returns: 
        * Object: 
            - _parser: (object - not intended for public access)
            - get: (function)
*/

const iniParser = require("config-ini-parser").ConfigIniParser
const fs = require("fs")

const generateParser = () => {
    let iniFileContent = fs.readFileSync('./etc/config.ini', 'utf-8')
    let parser = new iniParser()
    parser.parse(iniFileContent)
    return {
        _parser: parser,
        get (seekSection, seekOption, defaultValue) { 
            return this._parser.get(seekSection, seekOption, defaultValue)
        }
    }
}

module.exports = generateParser()
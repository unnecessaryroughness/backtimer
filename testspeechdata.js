sr = require("./speechresponses")

console.log("\n+++++++++++++++++++++\n")

let output = sr('SetMealTimer')

console.log(JSON.stringify(output, null, 2))
console.log("\n" + output.parse('REQ_FIRST_ACTIVITY'))
console.log("\n" + output.parse('REQ_FIRST_DURATION', ['fried banana']))
console.log("\n" + output.parse('REQ_ADD_ANOTHER_PROMPT'))

console.log("\n+++++++++++++++++++++\n")

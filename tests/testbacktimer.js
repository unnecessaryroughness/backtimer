bt = require("../lib/backtimer")

console.log("\n+++++++++++++++++++++\n")

let output = bt([
    {name: "pizza", duration: '12'}, 
    {name: "chips", duration: '22'}, 
    {name: "beans", duration: '5'}
])

console.log(output.activities)
console.log(`\ntotal duration is: ${output.longestActivity.duration} minutes`)
console.log(`\nlongest activity to complete is: ${output.longestActivity.name}`)

console.log("\n+++++++++++++++++++++\n")

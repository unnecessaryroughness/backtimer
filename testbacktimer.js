bt = require("./backtimer")

console.log("\n+++++++++++++++++++++\n")

let output = bt([
    {name: "pear", duration: 8}, 
    {name: "apple", duration: 4}, 
    {name: "banana", duration: 10}
])

console.log(output.ingredients)
console.log(`\ntotal cooking time is: ${output.longestIngredient.duration} minutes`)
console.log(`\nlongest ingredient to cook is: ${output.longestIngredient.name}`)

console.log("\n+++++++++++++++++++++\n")

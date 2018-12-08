/*
    BACKTIMER.JS 
    ============

    Purpose: 
        * Accepts a list of arbitrary ingredients with cooking durations
            - each ingredient is an object of form {name: xxx, duration: nnn}
        * Sorts by descending cooking duration
        * Determines how long to wait after the first ingredient before starting to cook all other ingredients 

    Returns: 
        * Object: 
            - longestIngredient: (object)
            - ingredients: (list of objects)
*/

module.exports = (ingredients) => {
    ingredients = ingredients.sort((a, b) => a.duration > b.duration ? -1 : 1)
    let longestIngredient = ingredients[0]
    ingredients = ingredients.map(ingredient => {
        return {
            ...ingredient,
            startsects: (longestIngredient.duration - ingredient.duration) * 60
        }
    })
    return {
        longestIngredient,
        ingredients
    }
}

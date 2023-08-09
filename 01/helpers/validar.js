const validator = require("validator");

const validateParameters = (parameters) => {

    let validate_title = !validator.isEmpty(parameters.title) &&
                            validator.isLength(parameters.title, {min:5, max:50});
    let validate_content = !validator.isEmpty(parameters.content) &&
                            validator.isLength(parameters.content, {min:10, max:200});

    if(!validate_content || !validate_title) throw new Error("Empty data found")

    
}

module.exports = {
    validateParameters
}
//filter all the validated fields that are not undefined

exports.filterDefinedFields = (obj) => {
    let filtered_obj = {}
    let filtered_fields = Object.keys(obj).filter((field) => obj[field] !== undefined)
    filtered_fields.forEach((field) => filtered_obj[field] = obj[field]);
    return filtered_obj
}
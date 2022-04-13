const { read, write } = require('../lib/FS')

const addCourses = (req, res) => {
    const courses = read('courses.json')
    const { name } = req.body
    
    const data = { id: courses.length + 1, name: name}
    
    courses.push(data)

    write('courses.json', courses)
    
    res.redirect("/courses")
}
const courser = (req, res) => {
    const courses = read('courses.json')
}

module.exports = addCourses
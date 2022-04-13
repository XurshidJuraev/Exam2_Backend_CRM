const { read, write } = require('../lib/FS')

const addTeachers = (req, res) => {
  const users = read('users.json')

  const { name, surname, phone, password, courses } = req.body
  
  const data = { id: users.length + 1, name: name, surname: surname, role: "teacher", phone: phone, password: password, courses: courses }

  users.push(data)

  write('users.json', users)
  
  res.redirect("/admin")
}

module.exports = addTeachers
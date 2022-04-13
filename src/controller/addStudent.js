const { read, write } = require('../lib/FS')

const addStudent = (req, res) => {
  const users = read('users.json')

  const { name, surname, phone, password, courses } = req.body
  
  const data = { id: users.length + 1, name: name, surname: surname, role: "student", phone: phone, password: password, courses: courses }

  users.push(data)

  write('users.json', users)

  res.redirect("/student")
}

module.exports = addStudent
const { read, write } = require('../lib/FS')

const addGroup = (req, res) => {
  const groups = read('groups.json')
  const { name, ismi } = req.body
  
  const data = { id: groups.length + 1, name: name, ismi: ismi }
  
  groups.push(data)

  write('groups.json', groups)
  
  res.redirect("/groups")
}

module.exports = addGroup
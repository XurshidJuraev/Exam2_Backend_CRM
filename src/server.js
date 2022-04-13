const express = require('express')
const app = express()
const ejs = require('ejs')
const multer = require('multer')
const { read } = require('./lib/FS')
const { verify, sign } = require('jsonwebtoken') 
const cookieParser = require('cookie-parser')

// Multer
const storage = multer.diskStorage({
    destination: function (_, _, cb) {
        cb(null, __dirname + '/uploads')
    },
    filename: function (_, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage})

// Middelware
app.use('/assets', express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Controller
const addTeachers = require("./controller/addTeacher");
const addGroup = require("./controller/addGroup");
const addCourse = require("./controller/addCourses");
const addStudent = require("./controller/addStudent");

// GET methods
app.get('/addTeachers', addTeachers);
app.get('/addGroup', addGroup);
app.get('/addCourse', addCourse);
app.get('/addStudent', addStudent);

// POST method
app.post('/newTeachers', addTeachers);
app.post('/newGroup', addGroup);
app.post('/newCourse', addCourse);
app.post('/newStudent', addStudent);
app.post('/student', upload.single('rasm'), (req, res) => {
    res.send("OK")
})


// Middelware
const verifyAccess = (req, res, next) => {
    try {
        const { token } = req.cookies

        if(!token) {
            return res.status(401).send("Tokenni ber")
        }

        const user = verify(token, '1q2w3e4rhahahESHMAT')

        if(!user) {
            return res.status(401).send("Sen menga begonasan, bekobod, uyga borrrrrrrrr")
        }


        res.clea

        req.body.userId = user.id

        next()
    } catch(err) {
        res.status(500).send(err.message)
    }
}

// Middelware
const verifyRole = (req, res, next) => {
    const { name, password } = req.body

    if(!name || !password) {
        return res.status(400).json({
            message: "Enter valid credentials !!"
        })
    }

    const foundUser = read('users.json').find(e => e.name == name && e.password == password)

    if(!foundUser) {
        return res.status(401).json({
            message: "Uka Adashib qolding shekil. Sur buyodan, Kottalani ishiga aralashma Uyga bor..."
        })
    }

    req.body.token = sign({ id: foundUser.id, role: foundUser.role }, '1q2w3e4rhahahESHMAT')
    req.body.role = foundUser.role
    next()
}

// Routing
app.get('/', (_, res) => {
    res.render('login')
})

app.post('/login', verifyRole, (req, res) => {
    const { role, token } = req.body

    if(role == 'admin') {
        res.cookie('token', token)
        res.redirect('/admin')
    } else if(role == 'teacher') {
        res.cookie('token', token)
        res.redirect('/teacher')
    } else if(role == 'student') {
        res.cookie('token', token)
        res.redirect('/students')
    } else {
        res.send("Tre...")
    }
})

app.get('/admin', verifyAccess, (_, res) => {

    const allUsers = read('users.json')

    res.render('admin', { allUsers })
})

app.get('/student', verifyAccess, (_, res) => {

    const allStudent = read('users.json')

    const foundStudent = allStudent.filter(e => e.role === "student") 

    const groups = read('groups.json').filter(e => e.course == allStudent.courses)

    res.render('student', { foundStudent, groups })

})

app.get('/courses', verifyAccess, (_, res) => {

    const course = read('courses.json')

    res.render('course', { course })
})

app.get('/groups', verifyAccess, (_, res) => {

    const group = read('groups.json')

    res.render('group', { group })
})

app.get('/students', verifyAccess, (req, res) => {
    const { userId } = req.body

    const myTeacher = read('users.json')

    const foundTeacher = read('users.json').find(e => e.id == userId)

    const groups = read('groups.json').filter(e => e.course == foundTeacher.courses)

    const course = read('courses.json').filter(e => e.name == groups.courses)

    res.render('students', { groups, myTeacher, course })
})

app.get('/teacher', verifyAccess, (req, res) => {
    const { userId } = req.body

    const myTeacher = read('users.json')

    const foundTeacher = read('users.json').find(e => e.id == userId)

    const groups = read('groups.json').filter(e => e.course == foundTeacher.courses)

    const course = read('courses.json').filter(e => e.name == groups.courses)

    res.render('teachers', { groups, myTeacher, course })
})

// Port
app.listen(9000, console.log(9000))
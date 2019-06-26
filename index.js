const express=require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser'); /* need for form submission */
const methodOverride = require('method-override'); /* di ko alam ginagawa nito pero kailangan siya so... */
const config = require('./config/config.json'); /* dapat tama or else code is br0ken */
const PORT=3000; /* sunod sa third */
const app=express();

/* connect to database */
const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
    host: config.development.host,
    dialect: config.development.dialect,
});

/* for pug, front end stuff */
app.set('views', './views');
app.set('view engine', 'pug');

/* used for form submission */
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));

/* i used to be a */
const models = require('./models/index');
const Teacher = models.teachers;
const Student = models.students;

/* papuntang sign up */
app.get('/signup', function(req,res) {
    return res.render('signup');
});

/* papuntang log in */
app.get('/login', function(req,res) {
    return res.render('login');
});

/* after sign up */
app.get('/profile', function(req,res) {
    Student.findAll()
        .then(function(students) {
            return res.render('student_profile', { students })
        })
        .catch(function(err) { console.log(err) });
});

app.post('/profile', function(req,res) {
    const student_ = Student.build({
        first_name: req.body.first_name,
        last_name: req.body.last_name
    });

    student_.save()
        .then(function(savedStudent) {
            return res.redirect('/profile');
        })
        .catch(function(err) { res.status(400).send({ error: err.message }) });
});

/* renders form, new user create */
app.get('/users/new', function(req,res) {
    return res.render('newUser');
});

/* edit user */
app.get('/users/:id', function(req,res) {
    Teacher.findByPk(req.params.id)
        .then(function(teacher_) {
            return res.render('editUser', { teacher_ });
        })
        .catch(function(err) { res.status(400).send({ error: err.message }) });
});

app.put('/users/:id', function(req,res) {
    Teacher.findByPk(req.params.id)
        .then(function(teacher_) {
            teacher_.first_name = req.body.first_name;
            teacher_.last_name = req.body.last_name;

            return teacher_.save();
        })
        .then(function(savedTeacher) {
            return res.redirect('/users');
        })
        .catch(function(err) { res.status(400).send({ error: err.message }) });
});

/* delete teacher (sana all) */
function deleteUser(req, res) {
    Teacher.findByPk(req.params.id)
        .then(teacher_ => {
            return teacher_.destroy();
        })
        .then(() => res.redirect('/users'))
        .catch(err => res.status(400).send({ error: err.message }));
}

app.get('/users/:id/delete', deleteUser);
app.delete('/users/:id', deleteUser);

/* post new/edited user, happens after submit is cliqd */
app.get('/users', function(req,res) {
    Teacher.findAll()
        .then(function(teachers) {
            return res.render('users', { teachers })
        })
        .catch(function(err) { console.log(err) });
});

app.post('/users', function(req,res) {
    const teacher_ = Teacher.build({
        first_name: req.body.first_name,
        last_name: req.body.last_name
    });

    teacher_.save()
        .then(function(savedTeacher) {
            return res.redirect('/users');
        })
        .catch(function(err) { res.status(400).send({ error: err.message }) });
});

/* para hindi fake yung connection */
sequelize.authenticate()
    .then(function() {
        console.log(`Successfully authenticated to the database ${config.development.database}`);

        app.listen(PORT, function() {
            console.log(`Listening to port ${PORT}`);
        });
    })
    .catch(function(err) {
    	console.log(err)
    });
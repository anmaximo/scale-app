const express=require('express');
const Sequelize = require('sequelize');
const session=require('express-session'); /* for log in */
const bodyParser = require('body-parser'); /* need for form submission */
const methodOverride = require('method-override'); /* di ko alam ginagawa nito pero kailangan siya so... */ 
const config = require('./config/config.json'); /* dapat tama or else code is br0ken */
const PORT=3000; /* sunod sa third */
const app=express();
const path=require('path');
/* connect to database */
const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
    host: config.development.host,
    dialect: config.development.dialect,
});

/* for pug, front end stuff */
app.set('views', './views');
app.set('view engine', 'pug');

/* used for form submission */
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, 'public')));


/* i used to be a */
const models = require('./models/index');
const Teacher = models.teachers;
const Student = models.students;
const Event = models.events;

/* papuntang sign up */
app.get('/signup', function(req,res) {
    return res.render('signup');
});

app.get('/index', function(req,res) {
    return res.render('index');
});

/* papuntang log in */
app.get('/login', function(req,res) {
    return res.render('login');
});

/* papuntang teacher log in */
app.get('/teacher_login', function(req,res) {
    return res.render('teacher_login');
});

app.get('/event1approved', function(req,res) {
    return res.render('event1approved');
});

app.get('/event1done', function(req,res) {
    return res.render('event1done');
});

app.get('/event2approved', function(req,res) {
    return res.render('event2approved');
});

app.get('/event2done', function(req,res) {
    return res.render('event2done');
});

app.get('/event3approved', function(req,res) {
    return res.render('event3approved');
});

app.get('/event3done', function(req,res) {
    return res.render('event3done');
});

app.get('/event4approved', function(req,res) {
    return res.render('event4approved');
});

app.get('/event4done', function(req,res) {
    return res.render('event4done');
});

app.get('/', function(req,res) {
    return res.render('index');
});

app.get('/join1', function(req,res) {
    return res.render('najoin si ayn');
});

app.get('/join2', function(req,res) {
    return res.render('najoin si micha');
});

/* after sign up */
app.get('/profile/:username', function(req,res) {
    Student.findOne({where: {username: req.params.username}})
        .then(function(students) {
            Event.findAll({where: {status: "Approved"}})
                .then(function(events) {
                            console.log(events[0].toJSON())
                            return res.render('student_profile', { students:students.toJSON(),  events:events })
                })

            console.log(students.toJSON());
        })
        .catch(function(err) { console.log(err) });
});

app.get('/teacher_profile/:username', function(req,res) {
    Teacher.findOne({where: {username: req.params.username}})
        .then(function(teachers) {
            Event.findAll({include:[Student]})
                .then(function(events){
                    console.log(events[0].toJSON())
                    return res.render('teacher_profile', { teachers:teachers.toJSON(), events:events })
                })
        })
        .catch(function(err) { console.log(err) });
});

app.post('/profile', function(req,res) {
    const student_ = Student.build({  
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        student_number: req.body.student_number,
        teacher_id: req.body.teacher_id,
        username: req.body.username,
        password: req.body.password
    });

    student_.save()
        .then(function(savedStudent) {
            return res.redirect(`/profile/${req.body.username}`);
        })
        .catch(function(err) { res.status(400).send({ error: err.message }) });
});

/* after create event */
app.get('/redirect', function(req,res) {
    Event.findAll()
        .then(events => {
            return res.render('redirect_event', { events })
        })
        .catch(err => console.log(err));
});

app.post('/redirect', function(req,res) {
    console.log(req.body);
    const event_ = Event.build({  
        strand: req.body.strand,
        name: req.body.name,
        description: req.body.description,
        event_date: req.body.date,
        number_of_participants: req.body.number_of_participants
    });

    event_.save()
        .then(function(savedEvent) {
            return res.redirect(`/redirect`);
        })
        .catch(function(err) { res.status(400).send({ error: err.message }) });
});

/* log in code */
app.post('/profile/:username', function(req, res) {
    const username=req.body.username;
    const password=req.body.password;
    return res.redirect(`/profile/${req.body.username}`);
});

app.post('/teacher_profile/:username', function(req, res) {
    const username=req.body.username;
    const password=req.body.password;
    return res.redirect(`/teacher_profile/${req.body.username}`);
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
            teacher_.username = req.body.username;
            teacher_.password = req.body.password;

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
        last_name: req.body.last_name,
        username:req.body.username,
        password: req.body.password
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


app.get('/student_profile/:username', function(req,res) {
    Event.findAll({where: {status: "Approved"}})
        .then(function(events) {
                    console.log(events[0].toJSON())
                    return res.render('student_profile', { events:events.toJSON()})
        })
        .catch(function(err) { console.log(err) });
});
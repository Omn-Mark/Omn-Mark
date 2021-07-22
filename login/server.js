const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mysql = require('mysql');
const ejs = require('ejs');
const fs = require('fs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const { connect } = require('http2');
const filestore = require('session-file-store')(session);
const connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'baddb73ad66b5e',
    password : 'e1b952f1',
    database : 'heroku_0d8013809c89e64'
});

connection.connect(); 

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({extended : true}));
app.use(session({
    secret: 'omnmark',
    resave: false,
    saveUninitialized: true,
    store: new filestore()
}))
//app.use('/api', api);

/*function handleDisconnect() {
  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();*/

app.get('/', (req, res) => { 
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/join', (req, res) => {
    res.sendFile(__dirname + '/public/join.html');
});

app.get('/board', (req, res) => {
       res.render('board'); 
});

/*app.post('/board', (req,res) => {
    let boardInsert = 'insert into board (title, content, time) value (?, ?, NOW())';
    let boardParams = [req.body.inputTitle, req.body.inputWriter];
    connection.query(boardInsert, boardParams, (err, result, fields) => {
        if(err) {throw error;}
        console.log('데이터 추가 완료');
    })
    connection.query('select * from board', (err, result, fields) =>{
        if(err) {throw err;}
        console.log(result);
        res.render('board_content', { data : result });
    })
})*/

app.post('/board_content', (req,res) => {
    let boardInsert = 'insert into board (title, content, time) value (?, ?, NOW())';
    let boardParams = [req.body.inputTitle, req.body.inputWriter];
    connection.query(boardInsert, boardParams, (err, result, fields) => {
        if(err) {throw error;}
        console.log('데이터 추가 완료');
    })
    connection.query('select * from board', (err, result, fields) =>{
        if(err) {throw err;}
        console.log(result);
        res.render('board_content', { data : result });
    });
    connection.end();
})

app.get('/delete/:id', (req,res) => {
    let sql = 'select * from board';
        connection.query('delete from board where id = ? ', [req.params.id], (err,result,fields) => {
            if(err) {throw err;}
            res.redirect('/board');
            });
        connection.end();
        });


app.post('/add', (req, res) => {
    let testInsert = 'insert into test (user_id, password, name, gender) value (?, ?, ?, ?)';
    let params = [req.body.id, req.body.pwd, req.body.name, req.body.gender];   
    connection.query(testInsert, params, (err, result, fields) => {
        if(err) {throw err;}
        console.log('ok db insert', result.insertId, req.body.name);
    })
    res.sendFile(__dirname + '/public/joinComp.html');
});

app.listen(PORT, () => {
    console.log('Hello wolrd');
});


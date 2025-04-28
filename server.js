const db = require('./db.js')

const express = require('express')
const bcrypt = require('bcrypt')
const app = express()
const port = 3000
const mysql = require("mysql2/promise")

// parse application/json, för att hantera att man POSTar med JSON
const bodyParser = require("body-parser")

// Inställningar av servern.
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

async function getConnection() {
    return mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "accountsystem",
    })
  }

function isValidUserData(body){
    return body && body.username && body.password
}

app.post('/users', async function(req, res) {
   
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

     let connection = await getConnection()
     if (isValidUserData(req.body)) {
        let sql = `INSERT INTO users (username, password)
        VALUES (?, ?)`
    
        let [results] = await connection.execute(sql, [
        req.body.username,
        hashedPassword,
        ])
    4
        //results innehåller metadata om vad som skapades i databasen
        console.log(results)
        res.json(results)
    } else {
        res.sendStatus(422)
    }
   });


app.post('/login', async function(req, res) {
    let connection = await getConnection()
    let sql = `SELECT * FROM users WHERE username = ?`
    let [results] = await connection.execute(sql, [req.body.username])

    const isPasswordCorrect = await bcrypt.compare(req.body.password, results[0].password)

    if (isPasswordCorrect) {
        res.json({message: 'Inloggad'}) 
    } else {
        res.json({message: 'Fel användarnamn eller lösenord'})
        res.status(400).json({ error: 'Invalid credentials' });
    }
});
   
app.get('/greet', (req, res) => {
    res.send(`<h1>Hej ${req.query.name}</h1>`)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


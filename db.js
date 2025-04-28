const mysql = require("mysql2/promise")

async function getConnection() {
    return mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "accountsystem",
    })
  }

  async function getUsers() {
  
    const connection = await getConnection()
    const result = await connection.execute("SELECT * FROM users")
  
  
    await connection.end() //Stänger kopplingen till databasen.
    return result[0] //Plats 0 innehåller alla rader som returnerats från databasen.
  }
  
  module.exports = {
    getUsers,
  }
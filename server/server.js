/**
 * Below the code fro creating the node server using
 * node and import some module like fs and mysql and
 * some more
 *
 * @import(http)
 * @import(mysql)
 * @import(path) - if we needed
 * @import(joi) - it is module for validation   
 */
const http = require('node:http');
const mysql = require('mysql');
const userSchema = require('../validation/loginValidation');
require('dotenv').config({path: '../env/.env' });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((error) => {
  if (error) {
    console.error(error);
  }
  console.log("DB Connected Successfully");
});

const port = process.env.PORT || 3000;

http.createServer((req, response) => {

    // CORS headers to allow requests from different origins
    response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Below the code server send the option method so we write this code
  if (req.method === 'OPTIONS') {
      response.writeHead(200);
      response.end();
  } 
  
  // Below the code for handle the post method and user endpoint
  else if (req.method === 'POST' && req.url === '/UserLogin') {
    console.log(req.url + " " +  req.method);
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const data = JSON.parse(body);
      const { email, password } = data;

      // Below the code for validate the user details using joi
      const {error} = userSchema.validate({ email, password });
      if (error) {
        console.error(error.details);
        response.writeHead(400, { 'Content-Type': 'text/plain' });
        response.end("Invalid data");
        return;
      }

      // Below the code for insert query into the DB
      const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
      db.query(sql, [email, password], (err, result) => {
        if (err) {
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.end("Error storing user data in DB");
          console.error(err);
          return;
        }
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.end("User data stored successfully in DB");
        console.log('User data Stored successfully');
      });
    });

  }

  // Below the code handle the post method and tasks endpoint
  else if(req.method === 'POST' && req.url === '/tasks'){
    console.log(req.url + " " +  req.method);
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () =>{
      const data = JSON.parse(body);
      const {taskname,description} = data;
    
      // Below the code for insert the tasks into DB
      const sql =  'INSERT INTO tasks (title,description) VALUES (?,?)';
      db.query(sql,[taskname,description],(err,result)=>{
        if(err){
          response.writeHead(400,{'Content-Type': 'text/plain'});
          response.end('Error while Storing the Task data');
          console.error(err);
          return;
        }
        response.writeHead(200,{'Content-Type': 'text/plain'});
        response.end('SucessFully Stored the Data');
        console.log('Store data success');
      });
    });
  }

  // Below the code for get request from the task
  else if(( req.method === 'GET' && req.url.startsWith('/tasks') ) || req.url.startsWith('/') ){
    console.log(req.url + " " +  req.method);
    const sql = `SELECT id,title, description,status, DATE_FORMAT(created_at,'%d, %M, %Y %r') AS formatted_created_at FROM tasks;`;
    db.query(sql,(err,result)=>{
      if(err){
        response.writeHead(400,{'Content-Type': 'text/plain'});
        response.end('Error while Storing the Task data');
        console.error(err);
        return;
      }
      response.writeHead(200,{'Content-Type': 'application/json'});
      response.end(JSON.stringify(result)); // "[{}]"
      console.log('retrive data success');

    })
  }
  // Below the code for patch method from the task
  else if(req.method === 'PATCH' && req.url.startsWith(`/tasks`)){
    console.log(req.method + " " + req.url);
    const parts = req.url.split('/');
    const taskid = parts[2];
    let body = '';
    req.on('data',(chunk) =>{
      body += chunk.toString();
    });
    console.log(body);
    req.on('end',()=>{
      const patchData = JSON.parse(body);
      const {status} = patchData;  

      const sql = 'UPDATE tasks SET status = ? WHERE id = ?';
      db.query(sql,[status,taskid],(err,result)=>{
        if(err){
          response.writeHead(400,{'Content-Type': 'text/plain'});
          response.end('Error while Updating the Task data');
          console.error(err);
          return;
        }
        response.writeHead(200,{'Content-Type': 'application/json'});
        response.end(JSON.stringify(result));
        console.log('retrive data success');
      });
    });
  }else {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end("Not Found");
  }
}).listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// setTimeout(() => {
//   // Close the database connection
//   db.end((err) => {
//     if (err) {
//       console.log('Error while closing the DB', err);
//       return;
//     }
//     console.log('DB Connection Closed');
//   });
// },60000);

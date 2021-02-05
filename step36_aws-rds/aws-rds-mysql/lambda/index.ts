import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { env } from "process";

const value = env.vala || "ll";
const envvalue2: any = JSON.parse(value);

// Require and initialize outside of your main handler
const mysql = require("serverless-mysql")({
  config: {
    host: env.HOST,
    database: envvalue2.dbname,
    user: "admin",
    password: envvalue2.password,
  },
});

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  // If you're using AWS Lambda with callbacks, be sure to set context.callbackWaitsForEmptyEventLoop = false; in your main handler. This will allow the freezing of connections and will prevent Lambda from hanging on open connections. See here for more information. If you are using async functions, this is no longer necessary.
  // context.callbackWaitsForEmptyEventLoop = false;
  try {
    // Connect to your MySQL instance first
    await mysql.connect();
    // Get the connection object
    // let connection = mysql.getClient()

    // Simple query
    let resultsa = await mysql.query(
      "CREATE TABLE IF NOT EXISTS new (task_id INT AUTO_INCREMENT, description TEXT, PRIMARY KEY (task_id))"
    );

    // let resultsb = await mysql.query(
    //   "insert into new (task_id, description) values(20,'important')"
    // );

    // Query with advanced options
    // let resultsc= await connect.query({
    //   sql: 'SELECT * FROM table WHERE name = ?',
    //   timeout: 10000,
    //   values: ['serverless']
    // })

    // let results = await mysql.query("SELECT * FROM new");

    console.log(resultsa, "results from database");

    //  close the connection
    await mysql.end();

    // first query
    // "CREATE TABLE IF NOT EXISTS new (task_id INT AUTO_INCREMENT, description TEXT, PRIMARY KEY (task_id))"

    // second query
    // "insert into new (task_id, description) values(20,'humddda')",

    // third query
    // "SELECT * FROM new"

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: `Hello, CDK! You've created ${JSON.stringify(resultsa, null, 2)}\n`,
    };
  } catch (e) {
    console.log(e, "error from lambda");
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: `Hello, CDK! You've created${JSON.stringify(e, null, 2)} \n`,
    };
  }
}
// ***************************************************************************************************************

// Transaction support in serverless-mysql has been dramatically simplified. Start a new transaction using the transaction() method, and then chain queries using the query() method. The query() method supports all standard query options. Alternatively, you can specify a function as the only argument in a query() method call and return the arguments as an array of values. The function receives two arguments, the result of the last query executed and an array containing all the previous query results. This is useful if you need values from a previous query as part of your transaction.

// You can specify an optional rollback() method in the chain. This will receive the error object, allowing you to add additional logging or perform some other action. Call the commit() method when you are ready to execute the queries.
// let results = await mysql.transaction()
//   .query('INSERT INTO table (x) VALUES(?)', [1])
//   .query('UPDATE table SET x = 1')
//   .rollback(e => { /* do something with the error */ }) // optional
//   .commit() // execute the queries

const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const port = 4000;
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDbAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}/`);
        });
    } catch(error) {
        console.log(`DB Error ${error.message}`);
        process.exit(1);
    }
}

initializeDbAndServer();

//Read Api
app.get("/details", async(request, response) => {
    const detailsQuery = `SELECT * from details`;
    const detailsArray = await db.all(detailsQuery);
    response.send(detailsArray)
})

//Create Api
app.post("/details/post", async (request, response) => {
    const { name, img, summary } = request.body;
    const postQuery = `INSERT INTO details
    (name,img,summary)
    VALUES('${name}','${img}','${summary}')`;
  
    await db.run(postQuery);
    response.send("Query Posted");
  });
  
  //Update api
  app.put("/detail/", async (request, response) => {
    const { name, img, summary } = request.body;
    const UpdateQuery = `UPDATE 
    details
    SET 
    name = '${name}',
    img = '${img}',
    summary = '${summary}'
    WHERE name LIKE "%Harry%"`;
    await db.run(UpdateQuery);
    response.send("Details Updated");
  });
  
  //Delete api
  app.delete("/detail/:name", async (request, response) => {
    const { name } = request.body;
    const deleteQuery = `
      DELETE FROM 
      details
      WHERE 
      name = '${name}'`;
    await db.run(deleteQuery);
    response.send("Details Deleted");
  });

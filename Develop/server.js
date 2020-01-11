// // ==============================================================================
// // DEPENDENCIES
// // Series of npm packages that we will use to give our server useful functionality
// // ==============================================================================
const path = require("path");
const express = require("express");
const fs = require("fs");
const mainDir = path.join(__dirname, "/public");

// // ==============================================================================
// // EXPRESS CONFIGURATION
// // This sets up the basic properties for our express server
// // ==============================================================================

// // Tells node that we are creating an "express" server
const app = express();

// // Sets an initial port. We"ll use this later in our listener
const PORT = process.env.PORT || 3000;

// // Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// // ================================================================================
// // // ROUTER
// // // The below points our server to a series of "route" files.
// // // These routes give our server a "map" of how to respond when users visit or request data from various URLs.
// // // ================================================================================

app.get("/notes", function(req, res) {
  res.sendFile(path.join(mainDir, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});

// Posts new note to note taker & stringify stored note to be pushed to file.

app.post("/api/notes", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    let uniqueID = (savedNotes.length).toString();
    newNote.id = uniqueID;
    savedNotes.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    console.log("Note saved to db.json. Content: ", newNote);
    res.json(savedNotes);
})


app.listen(PORT, function() {
console.log("App listening on PORT: " + PORT);
});
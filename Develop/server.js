// // ==============================================================================
// // DEPENDENCIES
// // Series of npm packages that we will use to give our server useful functionality
// // ==============================================================================

const express = require("express");
const fs = require("fs");

// // EXPRESS CONFIGURATION
const app = express();

// // Sets an initial port. We"ll use this later in our listener
const PORT = process.env.PORT || 3000;

// // Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// // ================================================================================
// // // ROUTER
// // // The below points our server to a series of "route" files.
// // // These routes give our server a "map" of how to respond when users visit or request data from various URLs.
// // // ================================================================================

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

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
// Deletes any selected note, filters over saved notes and reassigns new IDs to all strings.
app.delete("/api/notes/:id", function(req, res) {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteID = req.params.id;
  let newID = 0;
  console.log(`Deleting note with ID ${noteID}`);
  savedNotes = savedNotes.filter(currNote => {
      return currNote.id != noteID;
  })
  for (currNote of savedNotes) {
    currNote.id = newID.toString();
    newID++;
}
for (currNote of savedNotes) {
  currNote.id = newID.toString();
  newID++;
}

fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
res.json(savedNotes);
})

app.listen(PORT, function() {
console.log("App listening on PORT: " + PORT);
});
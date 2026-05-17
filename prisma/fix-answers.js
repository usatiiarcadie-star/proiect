// Converts numeric answer indexes to string values in seed-sql.js
const fs = require("fs");

const file = "e:\\Proiect\\proiect\\prisma\\seed-sql.js";
const content = fs.readFileSync(file, "utf8");

// Load the module to get the actual data
const { sqlLessons } = require(file);

let fixed = 0;
sqlLessons.forEach((lesson) => {
  lesson.tasks.forEach((task) => {
    if (typeof task.answer === "number") {
      task.answer = task.options[task.answer];
      fixed++;
    }
  });
});

// Re-serialize: replace the tasks array in file by re-writing the whole export
// Safer: just regenerate the whole file programmatically
const lines = ["const sqlLessons = " + JSON.stringify(sqlLessons, null, 2) + ";\n\nmodule.exports = { sqlLessons };\n"];

fs.writeFileSync(file, lines.join(""));
console.log(`Fixed ${fixed} numeric answers → string values`);
console.log("seed-sql.js rewritten successfully");

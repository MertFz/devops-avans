db.getSiblingDB("avans_db").createCollection("reference_data");
db.getSiblingDB("avans_db").reference_data.insertMany([
  { name: "DevOps", category: "Course" },
  { name: "Avans", category: "University" }
]);

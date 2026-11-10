# Assignment 9: Student Course Registration Database (MongoDB CRUD Operations)

## Aim
To design a database for university course registration using MongoDB and perform basic CRUD (Create, Read, Update, Delete) operations.

---

## Database Design
- **Database Name:** `student_course_db`
- **Collection Name:** `student_registrations`

### Sample Document Structure
```json
{
  "_id": ObjectId("..."),
  "roll_number": "CS202601",
  "student_name": "Aarav Patel",
  "email": "aarav.patel@univ.edu",
  "department": "Computer Science",
  "semester": 4,
  "registered_courses": [
    { "course_code": "CS201", "course_name": "Data Structures", "credits": 4 },
    { "course_code": "CS202", "course_name": "Operating Systems", "credits": 4 }
  ],
  "status": "Active"
}
```

---

## MongoDB CRUD Queries

### 1. Create (Insert Operations)
```javascript
use student_course_db;

// Insert a single registration record
db.student_registrations.insertOne({
    roll_number: "CS202601",
    student_name: "Aarav Patel",
    email: "aarav.patel@univ.edu",
    department: "Computer Science",
    semester: 4,
    registered_courses: [
        { course_code: "CS201", course_name: "Data Structures", credits: 4 },
        { course_code: "CS202", course_name: "Operating Systems", credits: 4 }
    ],
    status: "Active"
});

// Insert multiple student registrations
db.student_registrations.insertMany([
    {
        roll_number: "CS202602",
        student_name: "Diya Sen",
        email: "diya.sen@univ.edu",
        department: "Computer Science",
        semester: 4,
        registered_courses: [
            { course_code: "CS201", course_name: "Data Structures", credits: 4 },
            { course_code: "CS203", course_name: "DBMS", credits: 3 }
        ],
        status: "Active"
    },
    {
        roll_number: "IT202603",
        student_name: "Rohan Sharma",
        email: "rohan.sharma@univ.edu",
        department: "Information Technology",
        semester: 4,
        registered_courses: [
            { course_code: "IT201", course_name: "Web Technologies", credits: 3 }
        ],
        status: "Active"
    }
]);
```

### 2. Read (Query Operations)
```javascript
// Display all registered students
db.student_registrations.find().pretty();

// Find a student by roll number
db.student_registrations.find({ roll_number: "CS202601" });

// Find students who registered for course code 'CS201'
db.student_registrations.find({ "registered_courses.course_code": "CS201" });
```

### 3. Update Operations
```javascript
// Update semester and status for a student
db.student_registrations.updateOne(
    { roll_number: "CS202601" },
    { $set: { status: "Approved", semester: 5 } }
);

// Add a new course to the student's registered courses ($push)
db.student_registrations.updateOne(
    { roll_number: "CS202601" },
    {
        $push: {
            registered_courses: {
                course_code: "CS204",
                course_name: "Computer Networks",
                credits: 3
            }
        }
    }
);

// Drop a course from the student's registration ($pull)
db.student_registrations.updateOne(
    { roll_number: "CS202602" },
    { $pull: { registered_courses: { course_code: "CS203" } } }
);
```

### 4. Delete Operations
```javascript
// Delete a student registration by roll number
db.student_registrations.deleteOne({ roll_number: "IT202603" });
```

---

## How to Run

### Method 1: MongoDB Shell (`mongosh`)
Run the query script directly in MongoDB Shell:
```bash
mongosh < mongo_queries.js
```

### Method 2: Node.js Full Stack Web Application
1. Start the web server:
   ```bash
   node server.js
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
   Use the web portal to perform Insert, Search, Add/Drop Courses, and Delete operations.

---

## Result
A student course registration database was created in MongoDB, and all CRUD operations (insert, query, push/pull updates, and delete) were executed successfully.

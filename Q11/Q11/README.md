# Assignment 11: MongoDB Aggregation — Sort, Group by Name, and Find Sum of Marks

## Aim
To perform aggregation operations in MongoDB that sort students by their subject marks, group students who share the same name, and calculate their total sum of marks.

---

## Database Design
- **Database Name:** `academic_db`
- **Collection Name:** `student_subject_marks`

### Sample Schema
```json
{
  "_id": ObjectId("..."),
  "roll_number": "CS101",
  "name": "Aarav Patel",
  "subject": "Mathematics",
  "marks": 95
}
```

---

## MongoDB Aggregation Pipeline

```javascript
use academic_db;

db.student_subject_marks.aggregate([
    // Stage 1: Sort individual records by marks in descending order
    {
        $sort: { marks: -1 }
    },

    // Stage 2: Group by student name and compute sum of marks
    {
        $group: {
            _id: "$name",                          // Group key: student name
            total_marks: { $sum: "$marks" },       // Accumulator: sum of marks
            subject_count: { $sum: 1 },            // Count of subjects
            marks_breakdown: {                     // Preserves sorted marks array
                $push: {
                    subject: "$subject",
                    marks: "$marks"
                }
            }
        }
    },

    // Stage 3: Clean projection
    {
        $project: {
            _id: 0,
            student_name: "$_id",
            total_marks: 1,
            subject_count: 1,
            marks_breakdown: 1
        }
    },

    // Stage 4: Order final groups by total marks descending
    {
        $sort: { total_marks: -1 }
    }
]);
```

---

## Step-by-Step Execution in MongoDB Shell

### 1. Insert Sample Data
```javascript
use academic_db;

db.student_subject_marks.insertMany([
    { roll_number: "CS101", name: "Aarav Patel", subject: "Mathematics", marks: 95 },
    { roll_number: "CS101", name: "Aarav Patel", subject: "Physics", marks: 88 },
    { roll_number: "CS101", name: "Aarav Patel", subject: "Computer Science", marks: 98 },
    { roll_number: "CS102", name: "Diya Sen", subject: "Mathematics", marks: 82 },
    { roll_number: "CS102", name: "Diya Sen", subject: "Physics", marks: 91 },
    { roll_number: "CS102", name: "Diya Sen", subject: "Computer Science", marks: 89 },
    { roll_number: "CS103", name: "Rohan Sharma", subject: "Mathematics", marks: 74 },
    { roll_number: "CS103", name: "Rohan Sharma", subject: "Physics", marks: 68 },
    { roll_number: "CS103", name: "Rohan Sharma", subject: "Computer Science", marks: 80 },
    { roll_number: "CS104", name: "Aarav Patel", subject: "English", marks: 85 }
]);
```

### 2. Run Aggregation Query
```javascript
db.student_subject_marks.aggregate([
    { $sort: { marks: -1 } },
    {
        $group: {
            _id: "$name",
            total_marks: { $sum: "$marks" }
        }
    },
    { $project: { _id: 0, student_name: "$_id", total_marks: 1 } },
    { $sort: { total_marks: -1 } }
]);
```

---

## How to Run

### Method 1: Using MongoDB Shell (`mongosh`)
```bash
mongosh < mongo_queries.js
```

### Method 2: Running Full Stack Web Application
1. Start the server:
   ```bash
   node server.js
   ```
2. Open your browser at:
   ```
   http://localhost:3002
   ```
   The web page displays the raw subject marks alongside the live aggregated and sorted totals.

---

## Result
The MongoDB aggregation pipeline was successfully executed, sorting student marks, grouping by identical student names, and finding their total sum of marks.

// =============================================================================
// Q11: MongoDB Aggregation - Sort Marks, Group by Student Name & Calculate Sum
// Database: academic_db
// Collection: student_subject_marks
// =============================================================================

// 1. Switch to database
use academic_db;

// Clean up existing collection
db.student_subject_marks.drop();

// 2. Insert sample documents containing student name, roll number, subject, and marks
print("Inserting student marks records across subjects...");
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

    { roll_number: "CS104", name: "Aarav Patel", subject: "English", marks: 85 }, // Same name record
    { roll_number: "CS105", name: "Diya Sen", subject: "Chemistry", marks: 94 },  // Same name record
    { roll_number: "CS106", name: "Ananya Gupta", subject: "Mathematics", marks: 92 },
    { roll_number: "CS106", name: "Ananya Gupta", subject: "Computer Science", marks: 96 }
]);

print("\n========================================================");
print("               ALL STUDENT MARKS RECORDS                ");
print("========================================================");
db.student_subject_marks.find({}, { _id: 0 }).pretty();

print("\n========================================================");
print("     CORE AGGREGATION PIPELINE FOR QUESTION 11          ");
print("  1. Sort by marks                                      ");
print("  2. Group by same student name                         ");
print("  3. Calculate sum of marks                             ");
print("========================================================");

// =====================================================================
// CORE AGGREGATION PIPELINE:
// Stage 1 ($sort): Sort individual student records by marks (descending)
// Stage 2 ($group): Group students by identical name, calculate sum of marks,
//                   and collect the sorted marks breakdown
// Stage 3 ($project): Format output fields cleanly
// Stage 4 ($sort): Order the final grouped records by total marks
// =====================================================================
var aggregationResult = db.student_subject_marks.aggregate([
    // Stage 1: Sort by marks descending
    {
        $sort: { marks: -1 }
    },
    // Stage 2: Group by student name and compute sum of marks
    {
        $group: {
            _id: "$name",                                  // Group by identical student names
            total_marks: { $sum: "$marks" },               // Sum of marks
            average_marks: { $avg: "$marks" },             // Average marks
            subject_count: { $sum: 1 },                    // Count of subject entries
            marks_breakdown: {                             // Preserves sorted subject marks
                $push: {
                    subject: "$subject",
                    marks: "$marks",
                    roll_number: "$roll_number"
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
            average_marks: { $round: ["$average_marks", 2] },
            subject_count: 1,
            marks_breakdown: 1
        }
    },
    // Stage 4: Sort final grouped output by total marks descending
    {
        $sort: { total_marks: -1 }
    }
]);

print("\n--- Aggregation Output (Pretty Printed) ---");
aggregationResult.forEach(printjson);

print("\n========================================================");
print(" COMPACT TABLE FORMAT (STUDENT NAME & SUM OF MARKS)     ");
print("========================================================");
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
]).forEach(function(doc) {
    print("Student Name: " + doc.student_name.padEnd(20) + " | Total Sum of Marks: " + doc.total_marks);
});

// =============================================================================
// Q9: Student Course Registration Database - MongoDB CRUD Operations
// Database: student_course_db
// Collection: student_registrations
// Can be executed directly in mongosh or MongoDB Compass
// =============================================================================

// Switch to the student database
use student_course_db;

// Clean up existing collection if needed
db.student_registrations.drop();

print("========== 1. CREATE OPERATIONS (INSERT) ==========");

// Insert a single student course registration
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
    registration_date: new Date("2026-01-15"),
    status: "Active"
});

// Insert multiple student course registrations
db.student_registrations.insertMany([
    {
        roll_number: "CS202602",
        student_name: "Diya Sen",
        email: "diya.sen@univ.edu",
        department: "Computer Science",
        semester: 4,
        registered_courses: [
            { course_code: "CS201", course_name: "Data Structures", credits: 4 },
            { course_code: "CS203", course_name: "DBMS", credits: 3 },
            { course_code: "MA201", course_name: "Discrete Mathematics", credits: 3 }
        ],
        registration_date: new Date("2026-01-16"),
        status: "Active"
    },
    {
        roll_number: "IT202603",
        student_name: "Rohan Sharma",
        email: "rohan.sharma@univ.edu",
        department: "Information Technology",
        semester: 4,
        registered_courses: [
            { course_code: "IT201", course_name: "Web Technologies", credits: 3 },
            { course_code: "CS203", course_name: "DBMS", credits: 3 }
        ],
        registration_date: new Date("2026-01-16"),
        status: "Active"
    },
    {
        roll_number: "CS202604",
        student_name: "Ananya Gupta",
        email: "ananya.gupta@univ.edu",
        department: "Computer Science",
        semester: 6,
        registered_courses: [
            { course_code: "CS301", course_name: "Artificial Intelligence", credits: 4 },
            { course_code: "CS302", course_name: "Cloud Computing", credits: 3 }
        ],
        registration_date: new Date("2026-01-17"),
        status: "Active"
    },
    {
        roll_number: "EC202605",
        student_name: "Vikram Singh",
        email: "vikram.singh@univ.edu",
        department: "Electronics",
        semester: 4,
        registered_courses: [
            { course_code: "EC201", course_name: "Digital Signal Processing", credits: 4 }
        ],
        registration_date: new Date("2026-01-18"),
        status: "Pending Approval"
    }
]);

print("Sample records inserted successfully!\n");

print("========== 2. READ OPERATIONS (QUERY) ==========");

// 2.1 Read all student registrations
print("--- All Registered Students ---");
db.student_registrations.find().pretty();

// 2.2 Read a specific student by Roll Number
print("--- Find Student with Roll No: CS202601 ---");
db.student_registrations.find({ roll_number: "CS202601" }).pretty();

// 2.3 Query students who registered for a specific course (CS203 - DBMS)
print("--- Students registered for course CS203 ---");
db.student_registrations.find(
    { "registered_courses.course_code": "CS203" },
    { roll_number: 1, student_name: 1, department: 1, "registered_courses.$": 1 }
).pretty();

// 2.4 Read with projection (only selected fields)
print("--- Project Student Names and Registered Courses only ---");
db.student_registrations.find(
    {},
    { roll_number: 1, student_name: 1, "registered_courses.course_name": 1, _id: 0 }
);

print("\n========== 3. UPDATE OPERATIONS ==========");

// 3.1 Update single student info ($set: update semester and status)
print("--- Update status and semester for CS202601 ---");
db.student_registrations.updateOne(
    { roll_number: "CS202601" },
    { 
        $set: { 
            status: "Approved", 
            semester: 5,
            last_updated: new Date()
        } 
    }
);

// 3.2 Add a new course to a student's registered_courses array ($push)
print("--- Add new elective CS204 to student CS202601 ---");
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

// 3.3 Drop a course from a student's registration ($pull)
print("--- Drop course MA201 from Diya Sen (CS202602) ---");
db.student_registrations.updateOne(
    { roll_number: "CS202602" },
    {
        $pull: {
            registered_courses: { course_code: "MA201" }
        }
    }
);

// 3.4 Update many documents ($set: mark all Computer Science students as 'Verified')
print("--- Update Many: Mark all CS department students as Verified ---");
db.student_registrations.updateMany(
    { department: "Computer Science" },
    { $set: { verification_status: "Verified" } }
);

print("\n========== 4. DELETE OPERATIONS ==========");

// 4.1 Delete a single student registration by Roll Number
print("--- Delete registration for roll_number EC202605 ---");
db.student_registrations.deleteOne({ roll_number: "EC202605" });

// 4.2 Delete multiple registrations based on condition (e.g. status is Cancelled)
print("--- Delete registrations with status 'Cancelled' ---");
db.student_registrations.deleteMany({ status: "Cancelled" });

print("\n========== FINAL VERIFICATION ==========");
print("Remaining Active Course Registrations in Database:");
db.student_registrations.find({}, { roll_number: 1, student_name: 1, department: 1, status: 1, registered_courses: 1 }).pretty();

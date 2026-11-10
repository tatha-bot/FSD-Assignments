// =============================================================================
// Q10: Update Employee Salary (+1000 Increment) in MongoDB
// Database: company_db
// Collection: employees
// =============================================================================

// 1. Switch to company_db database
use company_db;

// Clean up existing collection
db.employees.drop();

// 2. Insert initial sample employee documents
print("Inserting sample employee records...");
db.employees.insertMany([
    { emp_id: "E101", emp_name: "Rajesh Sharma", department: "Engineering", designation: "Software Engineer", salary: 55000 },
    { emp_id: "E102", emp_name: "Pooja Nair", department: "Human Resources", designation: "HR Executive", salary: 38000 },
    { emp_id: "E103", emp_name: "Vikram Malhotra", department: "Engineering", designation: "Tech Lead", salary: 85000 },
    { emp_id: "E104", emp_name: "Sneha Roy", department: "Marketing", designation: "Marketing Specialist", salary: 42000 },
    { emp_id: "E105", emp_name: "Arun Kumar", department: "Finance", designation: "Financial Analyst", salary: 60000 },
    { emp_id: "E106", emp_name: "Meera Patel", department: "Engineering", designation: "QA Engineer", salary: 47000 },
    { emp_id: "E107", emp_name: "Karthik Rao", department: "Support", designation: "Support Specialist", salary: 32000 }
]);

print("\n========================================================");
print("     EMPLOYEE RECORDS BEFORE 1000 SALARY INCREMENT     ");
print("========================================================");
db.employees.find({}, { _id: 0, emp_id: 1, emp_name: 1, department: 1, salary: 1 }).pretty();

print("\n========================================================");
print("     EXECUTING CORE QUERY: INCREMENT SALARY BY 1000    ");
print("========================================================");

// ====================================================================
// CORE MONGODB QUERY FOR QUESTION 10:
// Uses $inc operator with updateMany() to increment salary of ALL employees
// ====================================================================
var updateResult = db.employees.updateMany(
    {},                           // Empty filter selects all documents
    { $inc: { salary: 1000 } }    // Increment salary field by 1000
);

print("Matched Documents : " + updateResult.matchedCount);
print("Modified Documents: " + updateResult.modifiedCount);

print("\n========================================================");
print("     EMPLOYEE RECORDS AFTER 1000 SALARY INCREMENT      ");
print("========================================================");
db.employees.find({}, { _id: 0, emp_id: 1, emp_name: 1, department: 1, salary: 1 }).pretty();

// Bonus / Variation Query: Increment by 1000 for a specific department only
print("\n--- Additional Example: Increment by 1000 only for Engineering Department ---");
db.employees.updateMany(
    { department: "Engineering" },
    { $inc: { salary: 1000 } }
);
print("Updated Engineering department employees.");

# Assignment 10: Increment Employee Salary by 1000 in MongoDB

## Aim
To write and execute a MongoDB query that increments the salary field of all employees by 1000 in an employee database.

---

## Database Design
- **Database Name:** `company_db`
- **Collection Name:** `employees`

### Sample Schema
```json
{
  "_id": ObjectId("..."),
  "emp_id": "E101",
  "emp_name": "Rajesh Sharma",
  "department": "Engineering",
  "designation": "Software Engineer",
  "salary": 55000
}
```

---

## Core MongoDB Query

```javascript
use company_db;

// Query to increment the salary of all employees by 1000
db.employees.updateMany(
    {},                           // Empty filter selects all documents
    { $inc: { salary: 1000 } }    // $inc operator increases salary by 1000
);
```

### Explanation:
1. `db.employees`: Target collection name.
2. `updateMany()`: Updates all documents in the collection that match the criteria.
3. `{}`: Matches every document in the collection.
4. `{ $inc: { salary: 1000 } }`: The atomic `$inc` operator increments the numeric value of the `salary` field by 1000.

---

## Step-by-Step Execution

### 1. Insert Initial Records
```javascript
use company_db;

db.employees.insertMany([
    { emp_id: "E101", emp_name: "Rajesh Sharma", department: "Engineering", salary: 55000 },
    { emp_id: "E102", emp_name: "Pooja Nair", department: "Human Resources", salary: 38000 },
    { emp_id: "E103", emp_name: "Vikram Malhotra", department: "Engineering", salary: 85000 },
    { emp_id: "E104", emp_name: "Sneha Roy", department: "Marketing", salary: 42000 },
    { emp_id: "E105", emp_name: "Arun Kumar", department: "Finance", salary: 60000 }
]);
```

### 2. View Records Before Update
```javascript
db.employees.find({}, { _id: 0, emp_id: 1, emp_name: 1, salary: 1 });
```

### 3. Run Salary Increment Query
```javascript
db.employees.updateMany({}, { $inc: { salary: 1000 } });
```

### 4. Verify Updated Records
```javascript
db.employees.find({}, { _id: 0, emp_id: 1, emp_name: 1, salary: 1 });
```

---

## How to Run

### Method 1: In MongoDB Shell (`mongosh`)
```bash
mongosh < mongo_queries.js
```

### Method 2: Running the Full Stack Web Application
1. Start the server:
   ```bash
   node server.js
   ```
2. Open your browser at:
   ```
   http://localhost:3001
   ```
   Click the **"Apply +1000 Salary Hike"** button to trigger the query and view the live updated salaries.

---

## Result
The MongoDB query using `updateMany()` with the `$inc` operator was successfully executed, incrementing the salary of all employees by Rs. 1,000.

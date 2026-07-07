export const schemaMetadata = {
  college: {
    name: "College Management",
    tables: {
      students: {
        description: "Contains academic and profile details of students.",
        columns: [
          { name: "student_id", type: "INT", key: "PRI", desc: "Unique identifier for student" },
          { name: "student_name", type: "VARCHAR(100)", desc: "Full name of the student" },
          { name: "department", type: "VARCHAR(50)", desc: "Academic department (e.g., Computer Science, Electrical)" },
          { name: "year", type: "INT", desc: "Current academic year (1-4)" },
          { name: "cgpa", type: "FLOAT", desc: "Cumulative Grade Point Average (0.0 - 10.0)" }
        ]
      },
      courses: {
        description: "Details of active academic courses offered.",
        columns: [
          { name: "course_id", type: "INT", key: "PRI", desc: "Unique identifier for course" },
          { name: "course_name", type: "VARCHAR(100)", desc: "Title of the course" },
          { name: "faculty_name", type: "VARCHAR(100)", desc: "Instructor teaching the course" },
          { name: "department", type: "VARCHAR(50)", desc: "Department offering the course" }
        ]
      }
    }
  },
  ecommerce: {
    name: "E-Commerce",
    tables: {
      customers: {
        description: "Registered customers and their profile information.",
        columns: [
          { name: "customer_id", type: "INT", key: "PRI", desc: "Unique identifier for customer" },
          { name: "customer_name", type: "VARCHAR(100)", desc: "Full name of the customer" },
          { name: "email", type: "VARCHAR(100)", desc: "Email address" },
          { name: "city", type: "VARCHAR(50)", desc: "Resident city of the customer" }
        ]
      },
      orders: {
        description: "Transaction history and order details.",
        columns: [
          { name: "order_id", type: "INT", key: "PRI", desc: "Unique transaction identifier" },
          { name: "customer_id", type: "INT", key: "MUL", desc: "Foreign key reference to Customers" },
          { name: "order_date", type: "DATE", desc: "Date when transaction was placed" },
          { name: "total_amount", type: "DECIMAL(10,2)", desc: "Total price of items purchased" }
        ]
      },
      products: {
        description: "Inventory details and catalog of items.",
        columns: [
          { name: "product_id", type: "INT", key: "PRI", desc: "Unique item code" },
          { name: "product_name", type: "VARCHAR(100)", desc: "Name of the product" },
          { name: "category", type: "VARCHAR(50)", desc: "Product category (e.g., Electronics, Apparel)" },
          { name: "price", type: "DECIMAL(10,2)", desc: "Unit price of product" },
          { name: "stock", type: "INT", desc: "Quantity remaining in stock" }
        ]
      }
    }
  },
  hospital: {
    name: "Hospital Management",
    tables: {
      patients: {
        description: "Details of admitted and visiting patients.",
        columns: [
          { name: "patient_id", type: "INT", key: "PRI", desc: "Unique health ID for patient" },
          { name: "patient_name", type: "VARCHAR(100)", desc: "Patient full name" },
          { name: "age", type: "INT", desc: "Age of patient" },
          { name: "diagnosis", type: "VARCHAR(150)", desc: "Diagnosed medical condition" }
        ]
      },
      appointments: {
        description: "Scheduled consultation logs with physicians.",
        columns: [
          { name: "appointment_id", type: "INT", key: "PRI", desc: "Unique visit booking code" },
          { name: "patient_id", type: "INT", key: "MUL", desc: "Patient reference ID" },
          { name: "doctor_name", type: "VARCHAR(100)", desc: "Consulting physician's name" },
          { name: "appointment_date", type: "DATE", desc: "Scheduled date" }
        ]
      }
    }
  },
  business: {
    name: "Business Sales",
    tables: {
      employees: {
        description: "Details of corporate staff members.",
        columns: [
          { name: "employee_id", type: "INT", key: "PRI", desc: "Unique worker ID" },
          { name: "employee_name", type: "VARCHAR(100)", desc: "Employee name" },
          { name: "department", type: "VARCHAR(50)", desc: "Office division (e.g., Sales, Marketing, IT)" },
          { name: "role", type: "VARCHAR(50)", desc: "Job title (e.g., Manager, Executive)" }
        ]
      },
      sales: {
        description: "Revenue collection and performance tracking.",
        columns: [
          { name: "sale_id", type: "INT", key: "PRI", desc: "Unique receipt ID" },
          { name: "employee_id", type: "INT", key: "MUL", desc: "Responsible salesperson ID" },
          { name: "revenue", type: "DECIMAL(12,2)", desc: "Monetary income generated" },
          { name: "sale_date", type: "DATE", desc: "Date of transaction completion" }
        ]
      }
    }
  }
};

import sqlite3
import os
from database import engine, Base
from models import QueryHistory

# Datasets from mockData
MOCK_DATA = {
    "students": [
        (101, "Rahul Sharma", "Computer Science", 3, 8.9),
        (102, "Priya Patel", "Computer Science", 4, 9.4),
        (103, "Amit Singh", "Electrical Eng", 2, 7.2),
        (104, "Sneha Reddy", "Computer Science", 3, 9.1),
        (105, "Vikram Malhotra", "Mechanical Eng", 4, 8.3),
        (106, "Anjali Rao", "Information Tech", 1, 8.8),
        (107, "Sandeep Nair", "Computer Science", 2, 6.8),
        (108, "Meera Krishnan", "Electrical Eng", 3, 8.6),
        (109, "Karan Gupta", "Computer Science", 4, 9.7),
        (110, "Divya Verma", "Civil Eng", 3, 7.9)
    ],
    "courses": [
        (301, "Database Systems", "Dr. K. Srinivas", "Computer Science"),
        (302, "Algorithms Design", "Prof. Sarah Mathew", "Computer Science"),
        (303, "Power Systems", "Dr. A. K. Prasad", "Electrical Eng"),
        (304, "Machine Learning", "Dr. R. Ramanujan", "Computer Science"),
        (305, "Fluid Dynamics", "Prof. H. S. Murthy", "Mechanical Eng")
    ],
    "customers": [
        (1, "John Doe", "john.doe@gmail.com", "New York"),
        (2, "Jane Smith", "jane.s@yahoo.com", "Los Angeles"),
        (3, "Robert Chen", "robert.c@gmail.com", "San Francisco"),
        (4, "Aisha Taylor", "aisha.t@outlook.com", "Chicago"),
        (5, "David Miller", "miller.d@gmail.com", "Houston"),
        (6, "Sophia Martinez", "sophia.m@gmail.com", "Miami")
    ],
    "orders": [
        (1001, 1, "2026-05-15", 150.50),
        (1002, 3, "2026-05-18", 890.00),
        (1003, 2, "2026-05-20", 45.20),
        (1004, 5, "2026-05-22", 1200.00),
        (1005, 1, "2026-06-01", 75.80),
        (1006, 4, "2026-06-05", 320.00),
        (1007, 6, "2026-06-10", 450.00),
        (1008, 3, "2026-06-12", 120.00)
    ],
    "products": [
        (201, "Wireless Headphones", "Electronics", 99.99, 45),
        (202, "Smart Watch v3", "Electronics", 199.99, 12),
        (203, "Leather Wallet", "Accessories", 45.00, 80),
        (204, "Running Shoes", "Apparel", 120.00, 25),
        (205, "Bluetooth Speaker", "Electronics", 79.50, 60),
        (206, "Casual Denim Jacket", "Apparel", 85.00, 15)
    ],
    "patients": [
        (501, "Alice Green", 34, "Migraine"),
        (502, "Bob Harris", 62, "Hypertension"),
        (503, "Charlie Jenkins", 25, "Fractured Arm"),
        (504, "Diana Prince", 41, "Asthma"),
        (505, "Edward Norton", 55, "Diabetes Type 2"),
        (506, "Fiona Gallagher", 19, "Influenza")
    ],
    "appointments": [
        (801, 501, "Dr. Sarah Adams", "2026-06-16"),
        (802, 503, "Dr. James Lee", "2026-06-16"),
        (803, 502, "Dr. Sarah Adams", "2026-06-17"),
        (804, 505, "Dr. Emily Watson", "2026-06-18"),
        (805, 504, "Dr. James Lee", "2026-06-19"),
        (806, 506, "Dr. Sarah Adams", "2026-06-20")
    ],
    "employees": [
        (10, "Michael Scott", "Management", "Regional Manager"),
        (11, "Dwight Schrute", "Sales", "Assistant to the Regional Manager"),
        (12, "Jim Halpert", "Sales", "Sales Executive"),
        (13, "Pam Beesly", "Administration", "Office Administrator"),
        (14, "Angela Martin", "Finance", "Head Accountant"),
        (15, "Stanley Hudson", "Sales", "Sales Representative"),
        (16, "Ryan Howard", "Marketing", "Temp Associate")
    ],
    "sales": [
        (9001, 11, 15000.00, "2026-05-10"),
        (9002, 12, 18500.00, "2026-05-12"),
        (9003, 15, 9500.00, "2026-05-14"),
        (9004, 11, 12000.00, "2026-05-28"),
        (9005, 12, 22000.00, "2026-06-02"),
        (9006, 15, 14000.00, "2026-06-08"),
        (9007, 16, 2500.00, "2026-06-12")
    ]
}

def init_db():
    print("Initializing SQLite Database...")
    
    # 1. Create SQL History table using SQLAlchemy models
    Base.metadata.create_all(bind=engine)
    print("Created system schema (History tracking).")

    # 2. Setup SQLite database tables and seed sample data
    db_path = "sql_generator.db"
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Drop existing tables if they exist
    tables = list(MOCK_DATA.keys())
    for t in tables:
        cursor.execute(f"DROP TABLE IF EXISTS {t}")

    # College tables
    cursor.execute("""
    CREATE TABLE students (
        student_id INTEGER PRIMARY KEY,
        student_name TEXT NOT NULL,
        department TEXT NOT NULL,
        year INTEGER NOT NULL,
        cgpa REAL NOT NULL
    )
    """)
    cursor.execute("""
    CREATE TABLE courses (
        course_id INTEGER PRIMARY KEY,
        course_name TEXT NOT NULL,
        faculty_name TEXT NOT NULL,
        department TEXT NOT NULL
    )
    """)

    # E-Commerce tables
    cursor.execute("""
    CREATE TABLE customers (
        customer_id INTEGER PRIMARY KEY,
        customer_name TEXT NOT NULL,
        email TEXT NOT NULL,
        city TEXT NOT NULL
    )
    """)
    cursor.execute("""
    CREATE TABLE orders (
        order_id INTEGER PRIMARY KEY,
        customer_id INTEGER NOT NULL,
        order_date TEXT NOT NULL,
        total_amount REAL NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
    )
    """)
    cursor.execute("""
    CREATE TABLE products (
        product_id INTEGER PRIMARY KEY,
        product_name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL
    )
    """)

    # Hospital tables
    cursor.execute("""
    CREATE TABLE patients (
        patient_id INTEGER PRIMARY KEY,
        patient_name TEXT NOT NULL,
        age INTEGER NOT NULL,
        diagnosis TEXT NOT NULL
    )
    """)
    cursor.execute("""
    CREATE TABLE appointments (
        appointment_id INTEGER PRIMARY KEY,
        patient_id INTEGER NOT NULL,
        doctor_name TEXT NOT NULL,
        appointment_date TEXT NOT NULL,
        FOREIGN KEY (patient_id) REFERENCES patients (patient_id)
    )
    """)

    # Business tables
    cursor.execute("""
    CREATE TABLE employees (
        employee_id INTEGER PRIMARY KEY,
        employee_name TEXT NOT NULL,
        department TEXT NOT NULL,
        role TEXT NOT NULL
    )
    """)
    cursor.execute("""
    CREATE TABLE sales (
        sale_id INTEGER PRIMARY KEY,
        employee_id INTEGER NOT NULL,
        revenue REAL NOT NULL,
        sale_date TEXT NOT NULL,
        FOREIGN KEY (employee_id) REFERENCES employees (employee_id)
    )
    """)
    
    print("Relational tables created.")

    # Populate tables
    for table, rows in MOCK_DATA.items():
        placeholders = ", ".join(["?"] * len(rows[0]))
        cursor.executemany(f"INSERT INTO {table} VALUES ({placeholders})", rows)
        print(f"Seeded table '{table}' with {len(rows)} records.")

    conn.commit()
    conn.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    init_db()

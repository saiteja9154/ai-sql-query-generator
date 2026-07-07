import os
import re
import json
from typing import Dict, Any, List
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Define System Instructions for the LLM
SYSTEM_INSTRUCTION = """
You are an expert SQL Translator for an AI SQL Query Generator web application.
Your task is to translate natural language English queries into accurate, valid SQL code based on the database schemas provided below.

The system supports 4 schemas:
1. 'college' (College Management):
   - Table 'students': columns=[student_id (INT, PK), student_name (VARCHAR), department (VARCHAR), year (INT), cgpa (FLOAT)]
   - Table 'courses': columns=[course_id (INT, PK), course_name (VARCHAR), faculty_name (VARCHAR), department (VARCHAR)]

2. 'ecommerce' (E-Commerce):
   - Table 'customers': columns=[customer_id (INT, PK), customer_name (VARCHAR), email (VARCHAR), city (VARCHAR)]
   - Table 'orders': columns=[order_id (INT, PK), customer_id (INT, FK), order_date (DATE), total_amount (DECIMAL)]
   - Table 'products': columns=[product_id (INT, PK), product_name (VARCHAR), category (VARCHAR), price (DECIMAL), stock (INT)]

3. 'hospital' (Hospital Management):
   - Table 'patients': columns=[patient_id (INT, PK), patient_name (VARCHAR), age (INT), diagnosis (VARCHAR)]
   - Table 'appointments': columns=[appointment_id (INT, PK), patient_id (INT, FK), doctor_name (VARCHAR), appointment_date (DATE)]

4. 'business' (Business Sales):
   - Table 'employees': columns=[employee_id (INT, PK), employee_name (VARCHAR), department (VARCHAR), role (VARCHAR)]
   - Table 'sales': columns=[sale_id (INT, PK), employee_id (INT, FK), revenue (DECIMAL), sale_date (DATE)]

You must translate the query into the specified SQL Dialect (one of: mysql, postgres, sqlite, mssql).
For mssql, use 'SELECT TOP N ...' syntax instead of 'LIMIT N'.

You must return your output ONLY as a JSON object matching the following structure:
{
  "sql": "The translated SQL query string. Keep SQL syntax capitalized.",
  "explanation": "A short explanation of what the query does (1-2 sentences).",
  "confidence": 95,
  "schemaUsed": ["list", "of", "columns", "referenced"],
  "detectedSchema": "one of 'college', 'ecommerce', 'hospital', 'business'",
  "table": "the primary table targeted in the query",
  "optimization": "A suggestion for query optimization (e.g. index additions, JOIN improvements)",
  "otherSuggestions": [
    "Alternative SQL query 1",
    "Alternative SQL query 2"
  ]
}

Only return the JSON. Do not include markdown code block formatting (like ```json ... ```) in your response, just the raw JSON text.
"""

class RegexSQLEngine:
    def __init__(self):
        self.schema_metadata = {
            "college": {
                "name": "College Management",
                "tables": {
                    "students": ["student_id", "student_name", "department", "year", "cgpa"],
                    "courses": ["course_id", "course_name", "faculty_name", "department"]
                }
            },
            "ecommerce": {
                "name": "E-Commerce",
                "tables": {
                    "customers": ["customer_id", "customer_name", "email", "city"],
                    "orders": ["order_id", "customer_id", "order_date", "total_amount"],
                    "products": ["product_id", "product_name", "category", "price", "stock"]
                }
            },
            "hospital": {
                "name": "Hospital Management",
                "tables": {
                    "patients": ["patient_id", "patient_name", "age", "diagnosis"],
                    "appointments": ["appointment_id", "patient_id", "doctor_name", "appointment_date"]
                }
            },
            "business": {
                "name": "Business Sales",
                "tables": {
                    "employees": ["employee_id", "employee_name", "department", "role"],
                    "sales": ["sale_id", "employee_id", "revenue", "sale_date"]
                }
            }
        }

    def translate(self, query: str, schema_key: str = "college", dialect: str = "mysql") -> Dict[str, Any]:
        query_lower = query.lower().strip()
        sql = ""
        explanation = ""
        confidence = 95
        schema_used = []
        optimization = ""
        other_suggestions = []
        
        # Auto-detect schema key
        detected_schema = schema_key
        if any(kw in query_lower for kw in ["student", "course", "cgpa", "faculty"]):
            detected_schema = "college"
        elif any(kw in query_lower for kw in ["customer", "order", "product"]) or ("sales" in query_lower and "employee" not in query_lower):
            detected_schema = "ecommerce"
        elif any(kw in query_lower for kw in ["patient", "appointment", "doctor"]):
            detected_schema = "hospital"
        elif any(kw in query_lower for kw in ["employee", "revenue", "role"]):
            detected_schema = "business"

        schema_obj = self.schema_metadata.get(detected_schema, self.schema_metadata["college"])
        tables_in_schema = list(schema_obj["tables"].keys())

        if detected_schema == "college":
            if "student" in query_lower or "cgpa" in query_lower:
                table = "students"
                schema_used = schema_obj["tables"]["students"]
                select_cols = ", ".join(schema_used)
                where_clause = ""
                order_by_clause = ""
                limit_clause = ""

                if "computer science" in query_lower or "cs" in query_lower:
                    where_clause += "department = 'Computer Science'"
                elif "electrical" in query_lower:
                    where_clause += "department = 'Electrical Eng'"
                elif "mechanical" in query_lower:
                    where_clause += "department = 'Mechanical Eng'"

                cgpa_match = re.search(r'(?:cgpa|score|gpa)\s*(?:more than|>|greater than|above)\s*([0-9.]+)', query_lower) or re.search(r'(?:>)\s*([0-9.]+)', query_lower)
                if cgpa_match:
                    val = cgpa_match.group(1)
                    where_clause += (" AND " if where_clause else "") + f"cgpa > {val}"

                if any(k in query_lower for k in ["highest", "top", "descending", "best"]):
                    order_by_clause = "ORDER BY cgpa DESC"

                limit_match = re.search(r'(?:top|limit|first)\s*([0-9]+)', query_lower)
                if limit_match:
                    limit_clause = f"LIMIT {limit_match.group(1)}"

                sql = f"SELECT {select_cols}\nFROM Students"
                if where_clause:
                    sql += f"\nWHERE {where_clause}"
                if order_by_clause:
                    sql += f"\n{order_by_clause}"
                if limit_clause:
                    sql += f"\n{limit_clause}"
                sql += ";"

                explanation = f"Retrieves students records from the database, filtered by {' department and' if 'department' in where_clause else ''} CGPA requirements."
                optimization = "Add an index on (department, cgpa) to speed up filtered lookups on departments and grade ranking."
                other_suggestions = [
                    "SELECT student_name, cgpa FROM Students WHERE department = 'Computer Science';",
                    "SELECT COUNT(*), department FROM Students GROUP BY department;"
                ]
            else:
                table = "courses"
                schema_used = schema_obj["tables"]["courses"]
                where_clause = ""
                if "computer science" in query_lower or "cs" in query_lower:
                    where_clause = "department = 'Computer Science'"
                
                sql = "SELECT course_id, course_name, faculty_name, department\nFROM Courses"
                if where_clause:
                    sql += f"\nWHERE {where_clause}"
                sql += ";"
                
                explanation = "Fetches the list of active courses along with their corresponding faculty members and departments."
                optimization = "Create a standard index on department if course lookups by department are frequent."
                other_suggestions = ["SELECT * FROM Courses ORDER BY course_name ASC;"]

        elif detected_schema == "ecommerce":
            if "customer" in query_lower:
                table = "customers"
                schema_used = schema_obj["tables"]["customers"]
                where_clause = ""
                city_match = re.search(r'in\s+([a-zA-Z\s]+)', query_lower)
                if city_match and not any(k in query_lower for k in ["department", "category"]):
                    city = city_match.group(1).replace("city", "").strip()
                    if city in ["new york", "ny"]: city = "New York"
                    elif city in ["los angeles", "la"]: city = "Los Angeles"
                    elif city == "chicago": city = "Chicago"
                    where_clause = f"city = '{city}'"
                
                sql = "SELECT customer_id, customer_name, email, city\nFROM Customers"
                if where_clause:
                    sql += f"\nWHERE {where_clause}"
                sql += ";"
                
                explanation = "Queries the Customers table to fetch the identification details, email, and location of users."
                optimization = "An index on (city) can help optimize customer geographical segmentation queries."
                other_suggestions = ["SELECT COUNT(*), city FROM Customers GROUP BY city;"]
            elif "order" in query_lower or "sales" in query_lower or "revenue" in query_lower:
                table = "orders"
                schema_used = schema_obj["tables"]["orders"]
                if any(k in query_lower for k in ["total", "sum", "revenue"]):
                    sql = "SELECT SUM(total_amount) AS total_revenue\nFROM Orders;"
                    explanation = "Calculates the total revenue generated across all completed orders in the e-commerce database."
                    optimization = "Ensure total_amount has a decimal index or is indexed together with order_date if filtering by range."
                    other_suggestions = ["SELECT customer_id, SUM(total_amount) FROM Orders GROUP BY customer_id;"]
                else:
                    limit_match = re.search(r'(?:top|limit|first)\s*([0-9]+)', query_lower)
                    limit_str = f"\nLIMIT {limit_match.group(1)}" if limit_match else ""
                    sql = f"SELECT order_id, customer_id, order_date, total_amount\nFROM Orders\nORDER BY total_amount DESC{limit_str};"
                    explanation = "Retrieves e-commerce orders sorted by total transaction value in descending order."
                    optimization = "Create a descending index on (total_amount) to optimize top sales sorting queries."
                    other_suggestions = ["SELECT * FROM Orders WHERE order_date >= '2026-06-01';"]
            else:
                table = "products"
                schema_used = schema_obj["tables"]["products"]
                where_clause = ""
                if "low stock" in query_lower or "low" in query_lower:
                    where_clause = "stock < 20"
                elif "electronics" in query_lower:
                    where_clause = "category = 'Electronics'"
                elif "apparel" in query_lower or "clothing" in query_lower:
                    where_clause = "category = 'Apparel'"
                
                sql = "SELECT product_id, product_name, category, price, stock\nFROM Products"
                if where_clause:
                    sql += f"\nWHERE {where_clause}"
                sql += ";"
                explanation = "Fetches inventory item details like pricing and current stock levels from the products catalog."
                optimization = "Add a composite index on (category, price) to support catalog navigation sorting."
                other_suggestions = ["SELECT * FROM Products ORDER BY price ASC;"]

        elif detected_schema == "hospital":
            if "patient" in query_lower:
                table = "patients"
                schema_used = schema_obj["tables"]["patients"]
                where_clause = ""
                age_match = re.search(r'(?:age|older than)\s*(?:>|above|more than)\s*([0-9]+)', query_lower)
                if age_match:
                    where_clause = f"age > {age_match.group(1)}"
                elif "migraine" in query_lower:
                    where_clause = "diagnosis = 'Migraine'"
                elif "asthma" in query_lower:
                    where_clause = "diagnosis = 'Asthma'"
                
                sql = "SELECT patient_id, patient_name, age, diagnosis\nFROM Patients"
                if where_clause:
                    sql += f"\nWHERE {where_clause}"
                sql += ";"
                explanation = "Retrieves records from the Patients database, optionally filtered by patient demographics or diagnoses."
                optimization = "Add a standard index on (diagnosis) for fast medical logs classification."
                other_suggestions = ["SELECT COUNT(*), diagnosis FROM Patients GROUP BY diagnosis;"]
            else:
                table = "appointments"
                schema_used = schema_obj["tables"]["appointments"]
                where_clause = ""
                if "today" in query_lower:
                    where_clause = "appointment_date = '2026-06-16'"
                sql = "SELECT appointment_id, patient_id, doctor_name, appointment_date\nFROM Appointments"
                if where_clause:
                    sql += f"\nWHERE {where_clause}"
                sql += ";"
                explanation = "Lists medical appointment schedules and doctors for patients booked on the system."
                optimization = "Index (appointment_date, doctor_name) to speed up doctors' daily calendar lookups."
                other_suggestions = ["SELECT doctor_name, COUNT(*) FROM Appointments GROUP BY doctor_name;"]

        elif detected_schema == "business":
            if "employee" in query_lower:
                table = "employees"
                schema_used = schema_obj["tables"]["employees"]
                where_clause = ""
                if "sales" in query_lower:
                    where_clause = "department = 'Sales'"
                elif "marketing" in query_lower:
                    where_clause = "department = 'Marketing'"
                sql = "SELECT employee_id, employee_name, department, role\nFROM Employees"
                if where_clause:
                    sql += f"\nWHERE {where_clause}"
                sql += ";"
                explanation = "Fetches general details of corporate employees, including department assignment and current roles."
                optimization = "Create index on department to improve reporting speed."
                other_suggestions = ["SELECT role, COUNT(*) FROM Employees GROUP BY role;"]
            else:
                table = "sales"
                schema_used = schema_obj["tables"]["sales"]
                order_by_clause = ""
                limit_clause = ""
                sum_select = False

                if any(k in query_lower for k in ["total", "sum", "revenue"]):
                    sum_select = True

                if any(k in query_lower for k in ["top", "highest", "best"]):
                    order_by_clause = "ORDER BY revenue DESC"

                limit_match = re.search(r'(?:top|limit|first)\s*([0-9]+)', query_lower)
                if limit_match:
                    limit_clause = f"LIMIT {limit_match.group(1)}"

                if sum_select:
                    sql = "SELECT SUM(revenue) AS total_revenue\nFROM Sales;"
                    explanation = "Queries total income aggregated across all active sales cycles."
                else:
                    sql = "SELECT sale_id, employee_id, revenue, sale_date\nFROM Sales"
                    if order_by_clause:
                        sql += f"\n{order_by_clause}"
                    if limit_clause:
                        sql += f"\n{limit_clause}"
                    sql += ";"
                    explanation = "Extracts financial transaction receipts sorted and sized based on revenue sizes."

                optimization = "Index (revenue) or composite index (employee_id, revenue) for sorting high-performer logs."
                other_suggestions = ["SELECT employee_id, SUM(revenue) FROM Sales GROUP BY employee_id;"]

        # Default Fallback
        if not sql:
            confidence = 60
            table = tables_in_schema[0]
            schema_used = schema_obj["tables"][table]
            sql = f"SELECT {', '.join(schema_used[:3])}\nFROM {table.capitalize()}\nLIMIT 5;"
            explanation = f"Generic query output created for table '{table}'. Verify your query details for specific filters."
            optimization = "Structure filters with exact column matches to take advantage of database indexes."
            other_suggestions = [f"SELECT COUNT(*) FROM {table.capitalize()};"]

        if dialect == "mssql":
            limit_match = re.search(r'LIMIT\s+([0-9]+)', sql, re.IGNORECASE)
            if limit_match:
                sql = re.sub(r'LIMIT\s+[0-9]+', '', sql, flags=re.IGNORECASE)
                sql = re.sub(r'SELECT', f'SELECT TOP {limit_match.group(1)}', sql, flags=re.IGNORECASE)

        return {
            "sql": sql,
            "explanation": explanation,
            "confidence": confidence,
            "schemaUsed": schema_used,
            "detectedSchema": detected_schema,
            "table": table,
            "optimization": optimization,
            "otherSuggestions": other_suggestions
        }

regex_engine = RegexSQLEngine()

def translate_query(english_query: str, schema_key: str = "college", dialect: str = "mysql") -> Dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return regex_engine.translate(english_query, schema_key, dialect)

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=SYSTEM_INSTRUCTION
        )
        
        prompt = f"SQL Dialect: {dialect}\nActive Schema Context: {schema_key}\nQuery: {english_query}"
        
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        data = json.loads(response.text)
        return data
    except Exception as e:
        print(f"Gemini API Error, falling back to local regex: {str(e)}")
        return regex_engine.translate(english_query, schema_key, dialect)

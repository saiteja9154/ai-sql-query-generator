# AI SQL Query Generator & Database Playground

An interactive, full-stack web application designed for data analysts, developers, and learners. It translates natural English prompts into structured, optimized SQL queries using the **Google Gemini API** (with a local rule-based regex fallback) and executes them against a local **SQLite database** in real-time.

---

## 🚀 Key Features

* **English to SQL Translation**: Instantly convert natural language questions like *"Show top 5 students by CGPA"* into valid SQL syntax.
* **Dialect Customization**: Generate syntax formatted for **MySQL, PostgreSQL, SQLite, or MS SQL Server**.
* **Database Execution Playground**: Execute generated queries directly against a live database. View rows, counts, sums, or SQL syntax error reports instantly in the UI.
* **Interactive Schema Catalogs**: Visually inspect table schemas, columns, data types, primary keys, and foreign keys across four preloaded domains:
  1. **College Management** (students, courses)
  2. **E-Commerce** (customers, orders, products)
  3. **Hospital Management** (patients, appointments)
  4. **Business Sales** (employees, sales)
* **Query History logs**: Star/bookmark favorite queries, search logs, delete entries, and reload previous translations to run modifications.
* **Clean Dark-Mode Dashboard**: Sleek visual aesthetics matching glassmorphism and modern dashboard design standards.

---

## 🛠️ Technology Stack

* **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, HTML5 Semantic Tags
* **Backend**: Python, FastAPI (High-performance API server with auto-documentation)
* **Database**: SQLite (Local serverless database), SQLAlchemy (Python ORM connector)
* **AI Engine**: Google Gemini API (`gemini-1.5-flash`) via `google-generativeai` SDK

---

## 📂 Project Structure

```text
ai-sql-query-generator/
│
├── src/                      # React Frontend Source Code
│   ├── components/           # Dashboard views (Home, Results, Schemas, etc.)
│   ├── App.jsx               # Main routing & state container
│   ├── main.jsx              # React app mount script
│   ├── api.js                # Fetch API wrapper functions
│   ├── index.css             # Global stylesheets & theme variables
│   └── schemaData.js         # Schema layout catalog definitions
│
├── backend/                  # Python FastAPI Backend
│   ├── main.py               # API Router and endpoint mappings
│   ├── database.py           # SQLAlchemy session & DB connection configs
│   ├── models.py             # Database ORM models (Query History table)
│   ├── schemas.py            # Pydantic schemas for request validation
│   ├── ai_service.py         # AI translation logic (Gemini API + Regex fallback)
│   ├── db_initializer.py     # Database schema creator and sample data seeder
│   └── requirements.txt      # Python dependencies
│
├── package.json              # Node dependencies (Vite & React)
├── vite.config.js            # Vite configurations
├── tailwind.config.js        # Tailwind CSS utility configurations
├── postcss.config.js         # PostCSS configuration
├── index.html                # Core HTML template
│
├── backend/sql_generator.db  # SQLite Database File (generated inside backend)
├── run_project.bat           # Quick launch script for Windows
└── README.md                 # Project documentation
```

---

## ⚙️ Local Setup & Installation

### Prerequisites
Make sure you have [Python 3.8+](https://www.python.org/downloads/) and [Node.js 18+](https://nodejs.org/) installed.

### Step-by-Step Run

1. **Clone/Download the repository** to your local workspace.
2. **Set up your environment variables**:
   Create a `.env` file inside the `backend/` folder and insert your Google Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: If no API key is set, the backend automatically falls back to a built-in Regex Translation Engine, meaning the app runs out-of-the-box anyway!*

3. **Initialize the database and run servers**:
   In the root directory, simply double-click **`run_project.bat`** (on Windows). 
   This script will install Node dependencies at the root level, install Python backend dependencies, seed the mock tables, start the FastAPI backend server on `http://localhost:8000`, and start the Vite React server on `http://localhost:3000`.

---

## 📝 How to Showcase this Project on Your Resume

If you are applying for **Data Analyst** or **Full-Stack Developer** positions, add this project to your resume using these action-oriented bullet points:

* **Developed** a full-stack data playground using **React**, **FastAPI (Python)**, and **SQLite** that translates English prompts to SQL queries and executes them on mock schemas in real-time.
* **Integrated** the **Google Gemini API** (using the `google-generativeai` SDK) to handle AI text-to-SQL conversions, writing a robust custom Python regex parser as a failover handler to guarantee 100% application uptime.
* **Designed** and seeded relational tables across 4 domains (E-Commerce, College, Hospital, Sales) inside **SQLite**, implementing query execution output formatting with proper decimal alignments and currency parsing.
* **Engineered** query history logging and starring capabilities utilizing **SQLAlchemy ORM** to execute database updates, queries, and deletions.

---

## 💬 Interview Preparation (Data Analyst Q&As)

Here is how you can discuss the technical details of this project in a job interview:

### Q1: Why did you choose SQLite instead of MySQL/PostgreSQL for this project?
> **Answer**: "SQLite was selected because it is serverless, lightweight, and stores the database in a single file directly inside the project folder. This makes the application incredibly easy to package, deploy, and run locally without requiring complex local installation of database servers (like MySQL). Since SQLite complies with standard ANSI SQL, the generated SQL queries run exactly the same way, demonstrating my database and SQL query proficiency."

### Q2: How did you implement query translation? What happens if the LLM API is unavailable?
> **Answer**: "I designed a two-layer translation service. When a translation request arrives at FastAPI, it first checks if a `GEMINI_API_KEY` is present. If it is, the server passes the question alongside a structured schema prompt to the Gemini model requesting a structured JSON response. If the key is missing or the API rate-limit triggers, the service catches the error and falls back to a custom built-in Regex-based translation engine. This ensures the app is highly reliable and never crashes during evaluations."

### Q3: How do you prevent SQL Injection if you are running raw SQL strings in the `/execute` route?
> **Answer**: "For a production data environment, running raw SQL query inputs from users is highly unsafe due to SQL Injection risks. To mitigate this in a resume project, the database playground operates on a dedicated mock database containing only non-sensitive dummy data. Additionally, the database file is completely isolated from system-level files."  

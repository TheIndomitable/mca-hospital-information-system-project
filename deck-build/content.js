// content.js — single source of truth for all 45 slides.
// Every figure here was extracted from the codebase (see extract.py / facts.json).

const FRONT = [
  { n: "01", t: "React 19 SPA" },
  { n: "02", t: "React Router 7 client routing" },
  { n: "03", t: "Role-aware Sidebar & Navbar" },
  { n: "04", t: "Axios API service layer" },
  { n: "05", t: "ChatBot assistant widget" },
];

const BACK = [
  { n: "01", t: "FastAPI REST API" },
  { n: "02", t: "JWT auth + role guards" },
  { n: "03", t: "30 routers / 168 endpoints" },
  { n: "04", t: "Pydantic validation" },
  { n: "05", t: "Global exception handlers" },
  { n: "06", t: "AI chat router" },
];

const DATA = [
  { n: "01", t: "PostgreSQL" },
  { n: "02", t: "SQLAlchemy 2.0 ORM" },
  { n: "03", t: "27 relational tables" },
  { n: "04", t: "Alembic migrations" },
  { n: "05", t: "bcrypt password hashing" },
];

const ROLES = [
  { r: "admin", t: "Administrator", d: "Full control of every master record and dashboard" },
  { r: "doctor", t: "Doctor", d: "Appointments, patients, records, prescriptions, schedule" },
  { r: "nurse", t: "Nurse", d: "Assigned patients and vitals recording" },
  { r: "receptionist", t: "Receptionist", d: "Patients, appointments, admissions, billing" },
  { r: "pharmacist", t: "Pharmacist", d: "Prescription billing and stock control" },
  { r: "lab_technician", t: "Lab Technician", d: "Test types, lab tests and result entry" },
  { r: "accountant", t: "Accountant", d: "Invoices, invoice items and payments" },
  { r: "patient", t: "Patient", d: "Own records, results, prescriptions, vitals, bills" },
];

// ---------------------------------------------------------------- use cases (from Sidebar.jsx)
const UC = {
  patient: ["Dashboard", "Profile", "Appointments", "Doctors", "Medical Records", "Lab Results", "Prescriptions", "Vitals", "Admissions", "Billing", "Payments"],
  doctor: ["Dashboard", "Appointments", "Patients", "Medical Records", "Prescriptions", "Doctor Schedule"],
  nurse: ["Dashboard", "Assigned Patients", "Record Vitals"],
  receptionist: ["Dashboard", "Patients", "Appointments", "Admissions", "Billing"],
  pharmacist: ["Dashboard", "Prescriptions & Billing", "Medicines", "Medicine Batches", "Pharmacies", "Pharmacy Stock"],
  lab_technician: ["Dashboard", "Lab Prescriptions & Billing", "Test Types", "Lab Tests", "Lab Results"],
  accountant: ["Dashboard", "Invoices", "Invoice Items", "Payments"],
  admin: ["Dashboard", "Hospitals", "Employees", "Doctors", "Patients", "Departments", "Appointments", "Admissions", "Rooms", "Beds", "Nurse Assignments", "Test Types", "Lab Tests", "Lab Results", "Medicines", "Medicine Batches", "Pharmacies", "Pharmacy Stock", "Invoices", "Invoice Items", "Payments"],
  member: ["Dashboard", "Doctor Schedule"],
};

// ---------------------------------------------------------------- 27 tables grouped by domain
const SCHEMA = [
  ["Identity & Access", "users, roles, patients, employees, doctors"],
  ["Hospital Setup", "hospitals, departments, rooms, beds"],
  ["Clinical", "appointments, doctor_schedules, medical_records, vitals"],
  ["Inpatient", "admissions, nurse_assignments"],
  ["Laboratory", "test_types, lab_tests, lab_results"],
  ["Pharmacy", "medicines, medicine_batches, pharmacies, pharmacy_stock"],
  ["Prescribing", "prescriptions, prescription_medicines"],
  ["Finance", "invoices, invoice_items, payments"],
];

const SLIDES = [
  // 1 -----------------------------------------------------------------
  { kind: "title" },

  // 2 -----------------------------------------------------------------
  {
    kind: "toc", kicker: "Roadmap", title: "Presentation Outline",
    groups: [
      { t: "Foundations", n: "01", items: "Introduction · Problem · Scope · Objectives" },
      { t: "Architecture", n: "02", items: "System architecture · Technology stack · Modules" },
      { t: "Access Control", n: "03", items: "Roles · Authentication and security flow" },
      { t: "Data Flow", n: "04", items: "DFD Level 0 · Level 1 · seven Level 2 diagrams" },
      { t: "Data Design", n: "05", items: "ERD across three domains · Database schema" },
      { t: "Use Cases", n: "06", items: "Eight role-specific use case diagrams" },
      { t: "API & AI", n: "07", items: "REST design · Assistant pipeline · Tool permissions" },
      { t: "Build & Delivery", n: "08", items: "Frontend · Backend · Security · Deployment · QA" },
    ],
  },

  // 3 -----------------------------------------------------------------
  {
    kind: "split", kicker: "Foundations", title: "Introduction",
    lead: "The Hospital Management System is a role-aware web application that digitises the complete operational cycle of a hospital — from patient registration and appointment booking through admission, treatment, prescribing, laboratory investigation, dispensing and final settlement.",
    points: [
      { t: "One connected record", d: "A patient's identity, visits, vitals, records, prescriptions, results and bills stay linked through foreign keys." },
      { t: "Eight distinct viewpoints", d: "Admin, doctor, nurse, receptionist, pharmacist, lab technician, accountant and patient each see only their own workspace." },
      { t: "Single deployable process", d: "FastAPI serves the API and the compiled React bundle from the same origin." },
      { t: "Assistive intelligence", d: "A role-gated LLM assistant answers scheduling and operational questions through 14 database-backed tools." },
    ],
    aside: { t: "At a glance", stats: [["27", "database tables"], ["168", "API endpoints"], ["30", "API routers"], ["8", "user roles"]] },
  },

  // 4 -----------------------------------------------------------------
  {
    kind: "cards", kicker: "Foundations", title: "Problem Statement",
    cols: 3,
    cards: [
      { label: "01", title: "Fragmented paper records", lines: ["Patient history spread across files and registers.", "Clinical decisions without a complete longitudinal view."] },
      { label: "02", title: "Repeated manual entry", lines: ["The same demographic captured at reception, ward and billing.", "Every hand-off a fresh transcription of the same data."] },
      { label: "03", title: "No unified availability view", lines: ["Bed and slot occupancy not visible while booking.", "Patients discover conflicts only at the counter."] },
      { label: "04", title: "Untraceable clinical history", lines: ["Records, vitals, results and prescriptions held apart.", "No single timeline per patient."] },
      { label: "05", title: "Slow settlement", lines: ["Manual invoice assembly across departments.", "Payment status not visible to the patient."] },
      { label: "06", title: "Uncontrolled data access", lines: ["One shared login could reach every record.", "No role boundary between clinical and administrative data."] },
    ],
  },

  // 5 -----------------------------------------------------------------
  {
    kind: "chips2", kicker: "Foundations", title: "Project Scope",
    intro: "The system covers eleven functional domains served by thirty API routers. Every domain is modelled in PostgreSQL and exposed through role-gated REST endpoints.",
    domains: [
      "Identity & access", "Hospital setup", "Staff & doctors", "Patients", "Appointments",
      "Admissions & wards", "Clinical records", "Laboratory", "Pharmacy & inventory",
      "Billing & payments", "Dashboards & AI",
    ],
    model: [
      { t: "Deployment model", d: "A single FastAPI process serves the JSON API, the compiled frontend bundle and the SPA fallback route." },
      { t: "Integration style", d: "Frontend and backend communicate over a documented REST surface consumed through 30 Axios service modules." },
      { t: "Intelligence layer", d: "An OpenAI-compatible LLM endpoint, Ollama by default, is wrapped by a tool dispatcher gated on role." },
    ],
  },

  // 6 -----------------------------------------------------------------
  {
    kind: "numbered", kicker: "Foundations", title: "Objectives",
    items: [
      { t: "Digitise the hospital workflow", d: "Replace register-based operation with a single relational model covering every stage of care." },
      { t: "Enforce role-based access control", d: "Eight roles, two account types, and server-side guards on every protected endpoint." },
      { t: "Guarantee data integrity", d: "Foreign keys, check constraints and indexes on hot lookup columns such as patient, doctor, bed and status." },
      { t: "Model the domain explicitly", d: "Twenty-seven tables capturing identity, hospital, clinical, inpatient, laboratory, pharmacy and finance data." },
      { t: "Expose a clean API", d: "Thirty routers and 168 endpoints following consistent REST verbs with Pydantic request and response schemas." },
      { t: "Deliver usable dashboards", d: "Seven staff dashboards plus a patient dashboard, each fed by scoped aggregate queries." },
      { t: "Add assistive intelligence", d: "A conversational assistant grounded in live database state rather than free-form generation." },
      { t: "Keep deployment simple", d: "One container image serving API, static assets and a guarded SPA fallback route." },
    ],
  },

  // 7 -----------------------------------------------------------------
  { kind: "diagram", kicker: "Architecture", title: "System Architecture", sub: "Three-tier architecture served from a single process",
    draw: "architecture", data: { front: FRONT, back: BACK, data: DATA } },

  // 8 -----------------------------------------------------------------
  {
    kind: "stack", kicker: "Architecture", title: "Technology Stack",
    left: {
      t: "Frontend and tooling",
      rows: [["React", "19.2.8", "Component-based SPA"], ["Vite", "8.2.2", "Dev server and bundler"],
      ["React Router DOM", "7.18.3", "Client-side routing"], ["Axios", "1.20.0", "HTTP service layer"],
      ["Oxlint", "1.79.0", "Static analysis"]],
    },
    right: {
      t: "Backend, data and AI",
      rows: [["FastAPI", "0.141.1", "REST API framework"], ["Uvicorn", "0.52.4", "ASGI server"],
      ["SQLAlchemy", "2.0.52", "ORM and data access"], ["psycopg2-binary", "2.9.13", "PostgreSQL driver"],
      ["Alembic", "1.19.2", "Schema migrations"], ["python-jose", "3.5.0", "JWT encode and decode"],
      ["Passlib / bcrypt", "1.7.4 / 4.0.1", "Password hashing"], ["Pydantic", "2.13.5", "Request validation"],
      ["pydantic-settings", "2.15.0", "Environment configuration"], ["HTTPX", "0.28.1", "OpenAI-compatible LLM client"]],
    },
  },

  // 9 -----------------------------------------------------------------
  {
    kind: "cards", kicker: "Architecture", title: "Functional Modules",
    cols: 4, dense: true,
    cards: [
      { label: "01", title: "Identity & Access", tag: "3 routers", lines: ["Patient self-registration", "Login and JWT issue", "Role master"] },
      { label: "02", title: "Hospital Setup", tag: "4 routers", lines: ["Hospitals and departments", "Rooms and beds", "Availability queries"] },
      { label: "03", title: "Staff & Doctors", tag: "3 routers", lines: ["Employee directory", "Doctor profiles", "Weekly schedules"] },
      { label: "04", title: "Patients", tag: "1 router", lines: ["Registration and profile", "Patient and staff views"] },
      { label: "05", title: "Appointments", tag: "1 router", lines: ["Slot booking and cancel", "Booked-slot views"] },
      { label: "06", title: "Admissions & Wards", tag: "2 routers", lines: ["Admit and discharge", "Nurse assignment"] },
      { label: "07", title: "Clinical Records", tag: "3 routers", lines: ["Medical records", "Vitals capture", "Prescriptions"] },
      { label: "08", title: "Laboratory", tag: "3 routers", lines: ["Test type catalogue", "Test orders", "Result entry"] },
      { label: "09", title: "Pharmacy", tag: "6 routers", lines: ["Medicine master", "Batch and expiry", "Stock by pharmacy"] },
      { label: "10", title: "Billing & Payments", tag: "3 routers", lines: ["Invoices and items", "Payment capture"] },
      { label: "11", title: "Dashboards & AI", tag: "2 routers", lines: ["Aggregate statistics", "Tool-gated assistant"] },
      { label: "", title: "30 routers", tag: "168 endpoints", lines: ["Every module exposed over", "consistent REST verbs"] },
    ],
  },

  // 10 ----------------------------------------------------------------
  {
    kind: "roles", kicker: "Access Control", title: "Roles and Access Model",
    intro: "Accounts are split into two types. A patient account can only ever address patient-scoped routes; a member account must additionally carry one of seven staff roles, checked on every protected request.",
    roles: ROLES,
    types: [
      { t: "account_type = patient", d: "require_patient guard. Self-service on own appointments, records, results, prescriptions, vitals, admissions, invoices and payments." },
      { t: "account_type = member", d: "require_member or require_role guard. Staff workspaces for admin, doctor, nurse, receptionist, pharmacist, lab_technician and accountant." },
    ],
  },

  // 11 ----------------------------------------------------------------
  { kind: "diagram", kicker: "Access Control", title: "Authentication and Security Flow", sub: "Bearer token issued at login, validated on every request",
    draw: "authFlow", data: {
      steps: [
        { n: "01", t: "POST /auth/login", fill: null },
        { n: "02", t: "bcrypt verify", fill: null },
        { n: "03", t: "JWT signed by python-jose", fill: null },
        { n: "04", t: "Client sends Authorization: Bearer", fill: null },
        { n: "05", t: "HTTPBearer extracts token", fill: null },
        { n: "06", t: "Resolve user, check is_active", fill: null },
        { n: "07", t: "require_role gate", fill: null },
      ],
      guards: [
        { t: "Password storage", d: "Passlib CryptContext with the bcrypt scheme. Hashing rejects any password longer than 72 bytes, and verification refuses the same." },
        { t: "Token contents", d: "The subject claim carries the numeric user id. A missing, malformed or undecodable token is rejected before any database access." },
        { t: "Failure responses", d: "Missing or invalid credentials return 401 with a WWW-Authenticate: Bearer header. An inactive account or a failed role check returns 403." },
      ],
    } },

  // 12 ----------------------------------------------------------------
  { kind: "diagram", kicker: "Data Flow", title: "DFD Level 0 — Context Diagram", sub: "The entire hospital function represented as a single process",
    source: "dfd0", draw: "dfd0", data: {
      name: "Hospital Management System",
      ext: ["Patients", "Doctors", "Nurses", "Reception & Administration"],
      caption: "All clinical, administrative and financial data flows of the hospital enter and leave through a single process boundary.",
    } },

  // 13 ----------------------------------------------------------------
  { kind: "diagram", kicker: "Data Flow", title: "DFD Level 1", sub: "Six major processes over the supporting data stores",
    source: "dfd1", draw: "dfd1", data: {
      ext: ["Patients", "Doctors", "Nurses", "Reception", "Pharmacy & Accounts", "Administration"],
      proc: [
        { t: "Patient & Identity Management", stores: "users · roles · patients" },
        { t: "Appointment Scheduling", stores: "appointments · doctor_schedules" },
        { t: "Clinical Care & Records", stores: "medical_records · vitals" },
        { t: "Inpatient & Ward Management", stores: "admissions · beds · nurse_assignments" },
        { t: "Laboratory Services", stores: "test_types · lab_tests · lab_results" },
        { t: "Billing & Payments", stores: "invoices · invoice_items · payments" },
      ],
      stores: ["pharmacy_stock · medicines", "pharmacy_stock · medicines", "medical_records · vitals", "admissions · beds", "lab_tests · lab_results", "invoices · payments"],
      caption: "Each process owns a distinct slice of the schema; pharmacy processes run alongside the clinical chain.",
    } },

  // 14 ----------------------------------------------------------------
  { kind: "diagram", kicker: "Data Flow", title: "DFD Level 2 — Patient and Registration",
    source: "dfd2_a", draw: "dfd2", data: {
      ext: ["Patient", "Receptionist", "Administrator"],
      proc: [{ n: "1.1", t: "Register patient" }, { n: "1.2", t: "Create user account" }, { n: "1.3", t: "Maintain profile" }, { n: "1.4", t: "Authenticate and issue token" }],
      store: [{ t: "users" }, { t: "roles" }, { t: "patients" }],
      out: ["Patient profile", "Bearer token", "Registration summary"],
    } },

  // 15 ----------------------------------------------------------------
  { kind: "diagram", kicker: "Data Flow", title: "DFD Level 2 — Appointments and Scheduling",
    source: "dfd2_b", draw: "dfd2", data: {
      ext: ["Patient", "Receptionist", "Doctor"],
      proc: [{ n: "2.1", t: "Query doctor availability" }, { n: "2.2", t: "Validate requested slot" }, { n: "2.3", t: "Book appointment" }, { n: "2.4", t: "Reschedule or cancel" }, { n: "2.5", t: "List booked slots" }],
      store: [{ t: "appointments" }, { t: "doctor_schedules" }, { t: "doctors" }],
      out: ["Confirmation", "Day schedule", "Cancellation notice"],
    } },

  // 16 ----------------------------------------------------------------
  { kind: "diagram", kicker: "Data Flow", title: "DFD Level 2 — Clinical Records and Vitals",
    source: "dfd2_c", draw: "dfd2", data: {
      ext: ["Doctor", "Nurse", "Patient"],
      proc: [{ n: "3.1", t: "Admit patient" }, { n: "3.2", t: "Record vitals" }, { n: "3.3", t: "Write medical record" }, { n: "3.4", t: "Assign nurse" }, { n: "3.5", t: "Discharge patient" }],
      store: [{ t: "admissions" }, { t: "medical_records" }, { t: "vitals" }, { t: "nurse_assignments" }],
      out: ["Clinical timeline", "Discharge summary", "Vitals history"],
    } },

  // 17 ----------------------------------------------------------------
  { kind: "diagram", kicker: "Data Flow", title: "DFD Level 2 — Pharmacy and Inventory",
    source: "dfd2_d", draw: "dfd2", data: {
      ext: ["Pharmacist", "Doctor", "Reception"],
      proc: [{ n: "4.1", t: "Receive prescription" }, { n: "4.2", t: "Select medicines" }, { n: "4.3", t: "Check batch and expiry" }, { n: "4.4", t: "Issue stock" }, { n: "4.5", t: "Raise low-stock alert" }],
      store: [{ t: "prescriptions" }, { t: "prescription_medicines" }, { t: "medicines" }, { t: "medicine_batches" }, { t: "pharmacy_stock" }],
      out: ["Dispensed items", "Stock warning", "Batch traceability"],
    } },

  // 18 ----------------------------------------------------------------
  { kind: "diagram", kicker: "Data Flow", title: "DFD Level 2 — Laboratory",
    source: "dfd2_e", draw: "dfd2", data: {
      ext: ["Lab Technician", "Doctor", "Patient"],
      proc: [{ n: "5.1", t: "Order lab test" }, { n: "5.2", t: "Assign test type" }, { n: "5.3", t: "Process sample" }, { n: "5.4", t: "Enter result" }, { n: "5.5", t: "Publish result" }],
      store: [{ t: "test_types" }, { t: "lab_tests" }, { t: "lab_results" }],
      out: ["Result report", "Order confirmation", "Test status"],
    } },

  // 19 ----------------------------------------------------------------
  { kind: "diagram", kicker: "Data Flow", title: "DFD Level 2 — Billing and Payments",
    source: "dfd2_f", draw: "dfd2", data: {
      ext: ["Accountant", "Receptionist", "Patient"],
      proc: [{ n: "6.1", t: "Collect chargeable item" }, { n: "6.2", t: "Assemble invoice" }, { n: "6.3", t: "Review invoice lines" }, { n: "6.4", t: "Record payment" }, { n: "6.5", t: "Reconcile invoice" }],
      store: [{ t: "invoices" }, { t: "invoice_items" }, { t: "payments" }],
      out: ["Invoice document", "Payment receipt", "Outstanding balance"],
    } },

  // 20 ----------------------------------------------------------------
  { kind: "diagram", kicker: "Data Flow", title: "DFD Level 2 — Infrastructure and Support",
    draw: "dfd2", data: {
      ext: ["Administrator", "Nurse", "Receptionist"],
      proc: [{ n: "7.1", t: "Register hospital and department" }, { n: "7.2", t: "Manage rooms and beds" }, { n: "7.3", t: "Maintain employees and doctors" }, { n: "7.4", t: "Publish dashboards" }, { n: "7.5", t: "Serve assistant queries" }],
      store: [{ t: "hospitals" }, { t: "departments" }, { t: "rooms" }, { t: "beds" }, { t: "employees" }, { t: "dashboard stats" }],
      out: ["Availability view", "Headcount summary", "Assistant answer"],
    } },

  // 21 ----------------------------------------------------------------
  { kind: "diagram", kicker: "Data Design", title: "ERD — Identity, Access and Setup", sub: "Seven entities: who exists, what they may do, and where they sit",
    source: "erd1", draw: "erd", data: {
      cols: 4, gapX: 0.62, gapY: 0.34, top: 2.16, bottom: 6.5,
      entities: [
        { id: "hospitals", keys: ["*id PK", "name", "address"] },
        { id: "departments", keys: ["*id PK", "*hospital_id FK", "name"] },
        { id: "roles", keys: ["*id PK", "name"] },
        { id: "users", keys: ["*id PK", "*role_id FK", "email", "password_hash"] },
        { id: "employees", keys: ["*id PK", "*role_id FK", "*department_id FK"] },
        { id: "doctors", keys: ["*id PK", "*employee_id FK", "specialization"] },
        { id: "patients", keys: ["*id PK", "*user_id FK", "blood_group"] },
      ],
      rels: [
        { from: "hospitals", to: "departments", fromCard: "1", toCard: "N" },
        { from: "departments", to: "employees", fromCard: "1", toCard: "N" },
        { from: "roles", to: "users", fromCard: "1", toCard: "N" },
        { from: "roles", to: "employees", fromCard: "1", toCard: "N" },
        { from: "employees", to: "doctors", fromCard: "1", toCard: "1" },
        { from: "users", to: "patients", fromCard: "1", toCard: "1" },
      ],
    } },

  // 22 ----------------------------------------------------------------
  { kind: "diagram", kicker: "Data Design", title: "ERD — Clinical Workflow", sub: "Ten entities linking a patient to every clinical event",
    source: "erd2", draw: "erd", data: {
      cols: 5, gapX: 0.62, gapY: 0.5, top: 2.3, bottom: 6.5,
      entities: [
        { id: "patients", keys: ["*id PK", "*user_id FK", "blood_group"] },
        { id: "doctors", keys: ["*id PK", "*employee_id FK", "specialization"] },
        { id: "rooms", keys: ["*id PK", "*hospital_id FK", "room_number"] },
        { id: "beds", keys: ["*id PK", "*room_id FK", "bed_number", "status"] },
        { id: "appointments", keys: ["*id PK", "*patients_id FK", "*doctors_id FK", "status"] },
        { id: "doctor_schedules", keys: ["*id PK", "*doctors_id FK", "day_of_week", "start_time"] },
        { id: "admissions", keys: ["*id PK", "*patients_id FK", "*doctors_id FK", "*bed_id FK"] },
        { id: "nurse_assignments", keys: ["*id PK", "*admissions_id FK", "*employees_id FK", "assigned_at"] },
        { id: "medical_records", keys: ["*id PK", "*patients_id FK", "*doctors_id FK", "diagnosis"] },
        { id: "vitals", keys: ["*id PK", "*patients_id FK", "*employees_id FK", "bp"] },
      ],
      rels: [
        { from: "rooms", to: "beds", fromCard: "1", toCard: "N" },
        { from: "beds", to: "admissions", fromCard: "1", toCard: "N" },
        { from: "admissions", to: "nurse_assignments", fromCard: "1", toCard: "N" },
        { from: "doctors", to: "appointments", fromCard: "1", toCard: "N" },
        { from: "doctors", to: "doctor_schedules", fromCard: "1", toCard: "N" },
        { from: "patients", to: "appointments", fromCard: "1", toCard: "N" },
        { from: "patients", to: "medical_records", fromCard: "1", toCard: "N" },
        { from: "patients", to: "vitals", fromCard: "1", toCard: "N" },
      ],
    } },

  // 23 ----------------------------------------------------------------
  { kind: "diagram", kicker: "Data Design", title: "ERD — Diagnostics, Pharmacy and Finance", sub: "Twelve entities closing the prescription-to-payment chain",
    draw: "erd", data: {
      cols: 4, gapX: 0.62, gapY: 0.3, top: 2.06, bottom: 6.66,
      entities: [
        { id: "test_types", keys: ["*id PK", "name", "price"] },
        { id: "lab_tests", keys: ["*id PK", "*test_types_id FK", "*patients_id FK", "*doctors_id FK"] },
        { id: "lab_results", keys: ["*id PK", "*lab_tests_id FK", "result_value", "reported_at"] },
        { id: "prescriptions", keys: ["*id PK", "*patients_id FK", "*doctors_id FK", "*pharmacies_id FK"] },
        { id: "medicines", keys: ["*id PK", "name", "unit", "unit_price"] },
        { id: "medicine_batches", keys: ["*id PK", "*medicines_id FK", "batch_no", "expiry_date"] },
        { id: "pharmacies", keys: ["*id PK", "*hospitals_id FK", "name"] },
        { id: "pharmacy_stock", keys: ["*id PK", "*pharmacies_id FK", "*medicine_batches_id FK", "quantity"] },
        { id: "prescription_medicines", keys: ["*prescriptions_id FK", "*medicines_id FK", "dosage"] },
        { id: "invoices", keys: ["*id PK", "*patients_id FK", "total_amount", "status"] },
        { id: "invoice_items", keys: ["*id PK", "*invoices_id FK", "description", "amount"] },
        { id: "payments", keys: ["*id PK", "*invoices_id FK", "amount", "method"] },
      ],
      rels: [
        { from: "test_types", to: "lab_tests", fromCard: "1", toCard: "N" },
        { from: "lab_tests", to: "lab_results", fromCard: "1", toCard: "N" },
        { from: "prescriptions", to: "prescription_medicines", fromCard: "1", toCard: "N" },
        { from: "medicines", to: "prescription_medicines", fromCard: "1", toCard: "N" },
        { from: "medicines", to: "medicine_batches", fromCard: "1", toCard: "N" },
        { from: "medicine_batches", to: "pharmacy_stock", fromCard: "1", toCard: "N" },
        { from: "pharmacies", to: "pharmacy_stock", fromCard: "1", toCard: "N" },
        { from: "pharmacies", to: "prescriptions", fromCard: "1", toCard: "N" },
        { from: "invoices", to: "invoice_items", fromCard: "1", toCard: "N" },
        { from: "invoices", to: "payments", fromCard: "1", toCard: "N" },
      ],
    } },

  // 24 ----------------------------------------------------------------
  { kind: "schematable", kicker: "Data Design", title: "Database Schema Overview", sub: "All 27 tables grouped into eight domains",
    groups: SCHEMA, total: 27,
    notes: "Every table is declared in SQLAlchemy and materialised by a single Alembic migration, so the deployed schema matches the model definitions exactly.",
  },

  // 25-32 -------------------------------------------------------------
  { kind: "diagram", kicker: "Use Cases", title: "Use Case Diagram — Patient", sub: "Self-service on the patient's own record", draw: "usecase",
    data: { actors: ["Patient"], uc: UC.patient, cols: 2, map: { Patient: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10] } } },
  { kind: "diagram", kicker: "Use Cases", title: "Use Case Diagram — Doctor", sub: "Clinical workspace for a practising doctor", draw: "usecase",
    data: { actors: ["Doctor"], uc: UC.doctor, cols: 2, map: { Doctor: [0, 1, 2, 3, 4, 5] } } },
  { kind: "diagram", kicker: "Use Cases", title: "Use Case Diagram — Nurse", sub: "Focused on ward assignment and vitals capture", draw: "usecase",
    data: { actors: ["Nurse"], uc: UC.nurse, cols: 1, map: { Nurse: [0, 1, 2] } } },
  { kind: "diagram", kicker: "Use Cases", title: "Use Case Diagram — Receptionist", sub: "Front-desk operations from registration to admission", draw: "usecase",
    data: { actors: ["Receptionist"], uc: UC.receptionist, cols: 2, map: { Receptionist: [0, 1, 2, 3, 4] } } },
  { kind: "diagram", kicker: "Use Cases", title: "Use Case Diagram — Pharmacist", sub: "Dispensing and stock control", draw: "usecase",
    data: { actors: ["Pharmacist"], uc: UC.pharmacist, cols: 2, map: { Pharmacist: [0, 1, 2, 3, 4, 5] } } },
  { kind: "diagram", kicker: "Use Cases", title: "Use Case Diagram — Lab Technician", sub: "Test catalogue, processing and result entry", draw: "usecase",
    data: { actors: ["Lab Technician"], uc: UC.lab_technician, cols: 2, map: { "Lab Technician": [0, 1, 2, 3, 4] } } },
  { kind: "diagram", kicker: "Use Cases", title: "Use Case Diagram — Accountant", sub: "Invoice and payment settlement", draw: "usecase",
    data: { actors: ["Accountant"], uc: UC.accountant, cols: 2, map: { Accountant: [0, 1, 2, 3] } } },
  { kind: "diagram", kicker: "Use Cases", title: "Use Case Diagram — Administrator", sub: "Configuration authority across all 21 master screens", draw: "usecase",
    data: { actors: ["Administrator"], uc: UC.admin, cols: 3, fs: 8.5, map: { Administrator: UC.admin.map((_, i) => i) } } },

  // 33 ----------------------------------------------------------------
  {
    kind: "apitable", kicker: "API and AI", title: "REST API Design", sub: "Thirty routers exposing 168 endpoints under consistent verbs",
    rows: [
      ["/patients", "GET, POST, PUT, DELETE", "7", "Profile, staff listings, self view"],
      ["/appointments", "GET, POST, PUT, DELETE", "8", "Booking, doctor slots, cancel"],
      ["/admissions", "GET, POST, PATCH, DELETE", "8", "Admit, discharge, by patient or doctor"],
      ["/medical-records", "GET, POST, PATCH, DELETE", "7", "Records by patient or doctor"],
      ["/vitals", "GET, POST, PATCH, DELETE", "7", "Vitals by patient or employee"],
      ["/lab-results", "GET, POST, PATCH, DELETE", "6", "Result entry and patient view"],
      ["/prescriptions", "GET, POST, PATCH, DELETE", "6", "Issue by doctor, view by patient"],
      ["/pharmacy-stock", "GET, POST, PATCH, DELETE", "5", "Stock by pharmacy and batch"],
      ["/invoices", "GET, POST, PATCH, DELETE", "6", "Invoice master, own-invoice view"],
      ["/payments", "GET, POST, PATCH, DELETE", "5", "Settlement against an invoice"],
      ["/auth", "POST", "2", "Patient registration and login"],
      ["/dashboard, /chat", "GET, POST", "3", "Aggregate statistics, assistant query"],
    ],
    foot: "Every route carries an explicit FastAPI prefix, and protected routes declare a require_patient, require_member, require_admin or require_role dependency.",
  },

  // 34 ----------------------------------------------------------------
  { kind: "diagram", kicker: "API and AI", title: "AI Assistant Architecture", sub: "Role-gated tool calling over live database state",
    draw: "aiArch", data: {
      lanes: [
        { t: "USER MESSAGE", fill: null, items: ["ChatBot.jsx widget", "Role-aware prompt", "Message history"] },
        { t: "API GATE", fill: null, items: ["get_current_user", "Role resolution", "Tool allow-list"] },
        { t: "LLM CLIENT", fill: null, items: ["OpenAI-compatible POST", "Model qwen2.5:3b", "Temp 0.3 · 850 tokens"] },
        { t: "TOOL DISPATCH", fill: null, items: ["14 registered tools", "JSON action parse", "Role permission map"] },
        { t: "DATABASE", fill: null, items: ["Live query execution", "Result passed back", "Answer composed"] },
      ],
      footTitle: "RESILIENCE",
      foot: [
        "Four retries with exponential backoff and respect for a Retry-After header on 429 responses.",
        "Backoff capped at thirty seconds to keep a chat turn responsive.",
        "Any OpenAI-compatible endpoint works: Ollama locally, or a hosted provider through environment variables.",
        "The assistant never generates clinical data; it only reports what the database returns.",
      ],
    } },

  // 35 ----------------------------------------------------------------
  {
    kind: "aitable", kicker: "API and AI", title: "Assistant Tools and Role Permissions",
    intro: "Fourteen tools are registered, but each is granted only to the roles that may legitimately call it. Confidential clinical data is restricted to doctors and administrators.",
    patient: [
      ["list_doctors", "List all doctors with specialisation and department"],
      ["doctor_schedule", "Get a doctor's weekly schedule"],
      ["book_appointment", "Book an appointment for the logged-in patient"],
      ["my_appointments", "List the logged-in patient's appointments"],
      ["cancel_appointment", "Cancel the logged-in patient's appointment"],
    ],
    staff: [
      ["doctor_info", "admin, doctor"],
      ["patient_lookup", "admin, doctor, nurse, receptionist, pharmacist, lab_technician"],
      ["patient_medical_history", "admin, doctor"],
      ["patient_vitals", "admin, doctor"],
      ["today_summary", "admin, doctor, nurse, receptionist, pharmacist, lab_technician"],
      ["bed_occupancy", "admin, doctor, nurse, receptionist"],
      ["low_stock", "admin, doctor, nurse, pharmacist"],
      ["department_summary", "admin, doctor, nurse, receptionist, pharmacist, lab_technician"],
      ["my_assignments", "admin, nurse"],
    ],
  },

  // 36 ----------------------------------------------------------------
  {
    kind: "rules", kicker: "Build and Delivery", title: "Business Rules Enforced by the System",
    rules: [
      { t: "Admission status lifecycle", d: "An admission may only be admitted, discharged or cancelled, enforced by a check constraint. Discharge date cannot precede the admission date." },
      { t: "Bed occupancy", d: "A bed belongs to exactly one room, and room availability is derived from the beds underneath it rather than stored separately." },
      { t: "Slot validity", d: "An appointment must fall inside the doctor's declared weekly schedule, and the slot must be free before the booking is written." },
      { t: "Patient identity", d: "A patient profile is one-to-one with a user account, so authentication identity and clinical identity cannot drift apart." },
      { t: "Prescribing chain", d: "A prescription links patient, doctor and pharmacy, and each line resolves through prescription_medicines to a medicine and its batch." },
      { t: "Billing integrity", d: "Payments reference an invoice and invoice items reference the same invoice, so a receipt can never exist without a bill." },
      { t: "Account activity", d: "A deactivated account is refused with 403 even when its token is still cryptographically valid." },
      { t: "Password ceiling", d: "bcrypt truncates beyond 72 bytes, so the application rejects longer passwords at hash time instead of silently weakening them." },
    ],
  },

  // 37 ----------------------------------------------------------------
  {
    kind: "columns", kicker: "Build and Delivery", title: "Frontend Architecture",
    left: { t: "Structure", items: ["Vite-driven React 19 single-page application", "React Router 7 with per-role route trees", "AuthContext providing account type and role id", "Thirty Axios modules mirroring the API domains", "Plain CSS design system with a dark pine and emerald palette"] },
    right: { t: "Role-aware navigation", items: ["Sidebar resolves the menu from the logged-in role", "Seven staff dashboards plus a patient dashboard", "A member fallback menu for unassigned accounts", "ChatBot widget mounted alongside the workspace", "Consistent loading and error states per screen"] },
  },

  // 38 ----------------------------------------------------------------
  {
    kind: "columns", kicker: "Build and Delivery", title: "Backend Architecture",
    left: { t: "Request pipeline", items: ["CORS restricted to configured origins", "Request validation handler returning 422", "HTTP, SQLAlchemy and general exception handlers", "Unified JSON success and error envelope", "Static mount for the compiled frontend bundle"] },
    right: { t: "Organisation", items: ["Thirty routers registered on the FastAPI app", "Pydantic schemas per domain in a schema package", "Dependency providers for database session and user", "Alembic revision history for schema versioning", "Settings object driven by pydantic-settings"] },
  },

  // 39 ----------------------------------------------------------------
  {
    kind: "cards", kicker: "Build and Delivery", title: "Security Features", cols: 3,
    cards: [
      { label: "01", title: "Password hashing", lines: ["Passlib CryptContext", "bcrypt scheme only", "72-byte hard limit"] },
      { label: "02", title: "Stateless tokens", lines: ["JWT signed with python-jose", "Subject claim holds the user id", "No server-side session store"] },
      { label: "03", title: "Request authentication", lines: ["HTTPBearer scheme", "401 with WWW-Authenticate on failure", "Token decoded before any query"] },
      { label: "04", title: "Role authorisation", lines: ["require_role allow-list", "require_patient and require_member", "require_admin for master data"] },
      { label: "05", title: "Account state", lines: ["is_active checked per request", "Inactive account returns 403", "Tokens stop working immediately"] },
      { label: "06", title: "Transport and origin", lines: ["CORS from configured origins", "Guarded SPA fallback path", "Validated request payloads"] },
    ],
  },

  // 40 ----------------------------------------------------------------
  { kind: "diagram", kicker: "Build and Delivery", title: "Deployment Architecture", sub: "Containerised single-origin delivery",
    draw: "deploy", data: {
      zones: [
        { t: "CLIENT", items: [{ t: "Browser", d: "React SPA bundle", fill: "FFFFFF" }] },
        { t: "APPLICATION", items: [{ t: "Uvicorn worker", d: "ASGI event loop", fill: "FFFFFF" }, { t: "FastAPI app", d: "30 routers mounted", fill: "FFFFFF" }, { t: "Static mount", d: "assets and SPA fallback", fill: "FFFFFF" }] },
        { t: "DATA", items: [{ t: "PostgreSQL", d: "27 tables", fill: "FFFFFF" }, { t: "Alembic", d: "migration runner", fill: "FFFFFF" }] },
        { t: "EXTERNAL", items: [{ t: "LLM endpoint", d: "Ollama or hosted API", fill: "FFFFFF" }] },
      ],
    } },

  // 41 ----------------------------------------------------------------
  {
    kind: "qa", kicker: "Build and Delivery", title: "Testing and Quality Assurance",
    cols: 2,
    groups: [
      { t: "Verification utilities", items: ["flow_test.py exercises end-to-end request flows", "check_contract.py asserts the API contract", "check_schema.py validates the database schema", "verify_models.py confirms ORM definitions", "audit_data.py reviews stored data", "scan_frontend.py checks the frontend surface"] },
      { t: "Discipline applied", items: ["Every router declares an explicit prefix and tag", "Schemas separate create, update and response shapes", "Check constraints encode status vocabularies", "Indexes cover patient, doctor, bed and status lookups", "Alembic keeps the deployed schema in step", "Oxlint runs over the frontend sources"] },
    ],
  },

  // 42 ----------------------------------------------------------------
  {
    kind: "columns", kicker: "Build and Delivery", title: "Challenges and Resolutions",
    left: { t: "Problem", items: ["Clinical data was readable by any authenticated account", "One user identity and one patient identity could disagree", "Slot booking could double-allocate a doctor", "Invoice lines could outlive their invoice", "Bed availability was asked for far more often than it was updated", "An assistant could be tempted to invent clinical values"] },
    right: { t: "Resolution", items: ["Role allow-lists on every protected route and every assistant tool", "A one-to-one foreign key from patients to users", "Slot validated against the doctor's schedule before the write", "A mandatory invoice foreign key on items and payments", "Availability derived from beds by query instead of cached", "Tools return database rows; the model only narrates them"] },
  },

  // 43 ----------------------------------------------------------------
  {
    kind: "cards", kicker: "Build and Delivery", title: "Future Enhancements", cols: 3,
    cards: [
      { label: "01", title: "Patient mobile client", lines: ["Native application on the same REST surface", "Push reminders for appointments"] },
      { label: "02", title: "Insurance claims", lines: ["Insurer entities and claim lifecycle", "Third-party payer reconciliation"] },
      { label: "03", title: "Device integration", lines: ["Direct vitals capture from bedside monitors", "Barcode scan on medicine batches"] },
      { label: "04", title: "Analytics", lines: ["Admission and occupancy trend reporting", "Revenue and department dashboards"] },
      { label: "05", title: "Notification service", lines: ["Email and SMS on appointment and result events", "Escalation for critical results"] },
      { label: "06", title: "Audit and compliance", lines: ["Immutable access log for clinical reads", "Retention policy per record class"] },
    ],
  },

  // 44 ----------------------------------------------------------------
  {
    kind: "conclusion", kicker: "Closing", title: "Conclusion",
    lead: "The Hospital Management System delivers a complete, role-aware digital workflow for hospital operations, implemented as a single containerised service with a three-tier architecture.",
    points: [
      "Twenty-seven normalised tables capture identity, hospital, clinical, inpatient, laboratory, pharmacy and finance data with enforced referential integrity.",
      "Thirty routers and 168 endpoints give eight roles exactly the surface each of them needs, enforced server-side rather than in the interface.",
      "Six Level-1 and Level-2 data flow processes plus a normalised relational design make the data lifecycle auditable end to end.",
      "A fourteen-tool assistant grounded in live database state adds conversational access without widening the security boundary.",
    ],
    stats: [["27", "tables"], ["168", "endpoints"], ["8", "roles"], ["45", "slides"]],
  },

  // 45 ----------------------------------------------------------------
  { kind: "thanks" },
];

module.exports = { SLIDES, TOTAL: SLIDES.length };

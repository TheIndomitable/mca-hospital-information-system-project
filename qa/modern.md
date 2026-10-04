<!-- Slide number: 1 -->
MINOR PROJECT PRESENTATION

Hospital Management System

A role-aware web application for the complete hospital cycle — registration, appointments, clinical records, pharmacy, laboratory and settlement.

PROJECT GUIDES
Dr Jay Kumar Jain

Dr Kuldeep Singh Yadav

TEAM

Ashutosh Sharma
Bhavishya Sisodiya
Nitish Kumar

25204031148
25204031140
25204031115

MANIT BHOPAL  ·  Department of Mathematics, Bioinformatics and Computer Application

### Notes:
Minor project presentation for the Hospital Management System.

<!-- Slide number: 2 -->
ROADMAP

Presentation Outline

Foundations
Architecture

01

02
Introduction · Problem · Scope · Objectives
System architecture · Technology stack · Modules

Access Control
Data Flow

03

04
Roles · Authentication and security flow
DFD Level 0 · Level 1 · seven Level 2 diagrams

Data Design
Use Cases

05

06
ERD across three domains · Database schema
Eight role-specific use case diagrams

API & AI
Build & Delivery

07

08
REST design · Assistant pipeline · Tool permissions
Frontend · Backend · Security · Deployment · QA
Hospital Management System
2 / 45

<!-- Slide number: 3 -->
FOUNDATIONS

Introduction
The Hospital Management System is a role-aware web application that digitises the complete operational cycle of a hospital — from patient registration and appointment booking through admission, treatment, prescribing, laboratory investigation, dispensing and final settlement.
At a glance

27
database tables

168

One connected record

Eight distinct viewpoints
A patient's identity, visits, vitals, records, prescriptions, results and bills stay linked through foreign keys.
Admin, doctor, nurse, receptionist, pharmacist, lab technician, accountant and patient each see only their own workspace.
API endpoints

30
API routers

Single deployable process

Assistive intelligence

FastAPI serves the API and the compiled React bundle from the same origin.
A role-gated LLM assistant answers scheduling and operational questions through 14 database-backed tools.
8
user roles
Hospital Management System
3 / 45

<!-- Slide number: 4 -->
FOUNDATIONS

Problem Statement

Fragmented paper records
Repeated manual entry
No unified availability view

01

02

03
Patient history spread across files and registers.
Clinical decisions without a complete longitudinal view.
The same demographic captured at reception, ward and billing.
Every hand-off a fresh transcription of the same data.
Bed and slot occupancy not visible while booking.
Patients discover conflicts only at the counter.

Untraceable clinical history
Slow settlement
Uncontrolled data access

04

05

06
Records, vitals, results and prescriptions held apart.
No single timeline per patient.
Manual invoice assembly across departments.
Payment status not visible to the patient.
One shared login could reach every record.
No role boundary between clinical and administrative data.
Hospital Management System
4 / 45

<!-- Slide number: 5 -->
FOUNDATIONS

Project Scope
The system covers eleven functional domains served by thirty API routers. Every domain is modelled in PostgreSQL and exposed through role-gated REST endpoints.

Identity & access

Hospital setup

Staff & doctors

Patients

Appointments

Admissions & wards

Clinical records

Laboratory

Pharmacy & inventory

Billing & payments

Dashboards & AI

Deployment model
Integration style
Intelligence layer
A single FastAPI process serves the JSON API, the compiled frontend bundle and the SPA fallback route.
Frontend and backend communicate over a documented REST surface consumed through 30 Axios service modules.
An OpenAI-compatible LLM endpoint, Ollama by default, is wrapped by a tool dispatcher gated on role.
Hospital Management System
5 / 45

<!-- Slide number: 6 -->
FOUNDATIONS

Objectives

1

5
Digitise the hospital workflow
Expose a clean API
Replace register-based operation with a single relational model covering every stage of care.
Thirty routers and 168 endpoints following consistent REST verbs with Pydantic request and response schemas.

2

6
Enforce role-based access control
Deliver usable dashboards
Eight roles, two account types, and server-side guards on every protected endpoint.
Seven staff dashboards plus a patient dashboard, each fed by scoped aggregate queries.

3

7
Guarantee data integrity
Add assistive intelligence
Foreign keys, check constraints and indexes on hot lookup columns such as patient, doctor, bed and status.
A conversational assistant grounded in live database state rather than free-form generation.

4

8
Model the domain explicitly
Keep deployment simple
Twenty-seven tables capturing identity, hospital, clinical, inpatient, laboratory, pharmacy and finance data.
One container image serving API, static assets and a guarded SPA fallback route.
Hospital Management System
6 / 45

<!-- Slide number: 7 -->
ARCHITECTURE

System Architecture
Three-tier architecture served from a single process

PRESENTATION LAYER

01
02
03
04
05
React 19 SPA
React Router 7 client routing
Role-aware Sidebar & Navbar
Axios API service layer
ChatBot assistant widget

APPLICATION LAYER

01
02
03
04
05
06
FastAPI REST API
JWT auth + role guards
30 routers / 168 endpoints
Pydantic validation
Global exception handlers
AI chat router

DATA LAYER

01
02
03
04
05
PostgreSQL
SQLAlchemy 2.0 ORM
27 relational tables
Alembic migrations
bcrypt password hashing
HTTPS / JSON  request  +  response
Hospital Management System
7 / 45

<!-- Slide number: 8 -->
ARCHITECTURE

Technology Stack
Frontend and tooling
Backend, data and AI

Technology

Version

Purpose

Technology

Version

Purpose

React

19.2.8

Component-based SPA

FastAPI

0.141.1

REST API framework

Vite

8.2.2

Dev server and bundler

Uvicorn

0.52.4

ASGI server

React Router DOM

7.18.3

Client-side routing

SQLAlchemy

2.0.52

ORM and data access

Axios

1.20.0

HTTP service layer

psycopg2-binary

2.9.13

PostgreSQL driver

Oxlint

1.79.0

Static analysis

Alembic

1.19.2

Schema migrations

python-jose

3.5.0

JWT encode and decode

Passlib / bcrypt

1.7.4 / 4.0.1

Password hashing

Pydantic

2.13.5

Request validation

pydantic-settings

2.15.0

Environment configuration

HTTPX

0.28.1

OpenAI-compatible LLM client
Hospital Management System
8 / 45

<!-- Slide number: 9 -->
ARCHITECTURE

Functional Modules

Identity & Access
Hospital Setup
Staff & Doctors
Patients

01

02

03

04
Patient self-registration
Login and JWT issue
Role master
Hospitals and departments
Rooms and beds
Availability queries
Employee directory
Doctor profiles
Weekly schedules
Registration and profile
Patient and staff views

3 routers

4 routers

3 routers

1 router

Appointments
Admissions & Wards
Clinical Records
Laboratory

05

06

07

08
Slot booking and cancel
Booked-slot views
Admit and discharge
Nurse assignment
Medical records
Vitals capture
Prescriptions
Test type catalogue
Test orders
Result entry

1 router

2 routers

3 routers

3 routers

Pharmacy
Billing & Payments
Dashboards & AI
30 routers

09

10

11
Medicine master
Batch and expiry
Stock by pharmacy
Invoices and items
Payment capture
Aggregate statistics
Tool-gated assistant
Every module exposed over
consistent REST verbs

6 routers

3 routers

2 routers

168 endpoints
Hospital Management System
9 / 45

<!-- Slide number: 10 -->
ACCESS CONTROL

Roles and Access Model
Accounts are split into two types. A patient account can only ever address patient-scoped routes; a member account must additionally carry one of seven staff roles, checked on every protected request.

account_type = patient
account_type = member

require_patient guard. Self-service on own appointments, records, results, prescriptions, vitals, admissions, invoices and payments.
require_member or require_role guard. Staff workspaces for admin, doctor, nurse, receptionist, pharmacist, lab_technician and accountant.

Administrator
Doctor
Nurse
Receptionist

1

2

3

4
admin
doctor
nurse
receptionist
Full control of every master record and dashboard
Appointments, patients, records, prescriptions, schedule
Assigned patients and vitals recording
Patients, appointments, admissions, billing

Pharmacist
Lab Technician
Accountant
Patient

5

6

7

8
pharmacist
lab_technician
accountant
patient
Prescription billing and stock control
Test types, lab tests and result entry
Invoices, invoice items and payments
Own records, results, prescriptions, vitals, bills
Hospital Management System
10 / 45

<!-- Slide number: 11 -->
ACCESS CONTROL

Authentication and Security Flow
Bearer token issued at login, validated on every request

01
02
03
04
POST /auth/login
bcrypt verify
JWT signed by python-jose
Client sends Authorization: Bearer

05
06
07
HTTPBearer extracts token
Resolve user, check is_active
require_role gate

Password storage
Passlib CryptContext with the bcrypt scheme. Hashing rejects any password longer than 72 bytes, and verification refuses the same.

Token contents
The subject claim carries the numeric user id. A missing, malformed or undecodable token is rejected before any database access.

Failure responses
Missing or invalid credentials return 401 with a WWW-Authenticate: Bearer header. An inactive account or a failed role check returns 403.

Hospital Management System
11 / 45

<!-- Slide number: 12 -->
DATA FLOW

DFD Level 0 — Context Diagram
The entire hospital function represented as a single process

![E:\minor project HMS\deck-build\assets\diagrams\dfd0.png](Image0.jpg)
Hospital Management System
12 / 45

<!-- Slide number: 13 -->
DATA FLOW

DFD Level 1
Six major processes over the supporting data stores

![E:\minor project HMS\deck-build\assets\diagrams\dfd1.png](Image0.jpg)
Hospital Management System
13 / 45

<!-- Slide number: 14 -->
DATA FLOW

DFD Level 2 — Patient and Registration

![E:\minor project HMS\deck-build\assets\diagrams\dfd2_a.png](Image0.jpg)
Hospital Management System
14 / 45

<!-- Slide number: 15 -->
DATA FLOW

DFD Level 2 — Appointments and Scheduling

![E:\minor project HMS\deck-build\assets\diagrams\dfd2_b.png](Image0.jpg)
Hospital Management System
15 / 45

<!-- Slide number: 16 -->
DATA FLOW

DFD Level 2 — Clinical Records and Vitals

![E:\minor project HMS\deck-build\assets\diagrams\dfd2_c.png](Image0.jpg)
Hospital Management System
16 / 45

<!-- Slide number: 17 -->
DATA FLOW

DFD Level 2 — Pharmacy and Inventory

![E:\minor project HMS\deck-build\assets\diagrams\dfd2_d.png](Image0.jpg)
Hospital Management System
17 / 45

<!-- Slide number: 18 -->
DATA FLOW

DFD Level 2 — Laboratory

![E:\minor project HMS\deck-build\assets\diagrams\dfd2_e.png](Image0.jpg)
Hospital Management System
18 / 45

<!-- Slide number: 19 -->
DATA FLOW

DFD Level 2 — Billing and Payments

![E:\minor project HMS\deck-build\assets\diagrams\dfd2_f.png](Image0.jpg)
Hospital Management System
19 / 45

<!-- Slide number: 20 -->
DATA FLOW

DFD Level 2 — Infrastructure and Support
EXTERNAL ENTITIES
PROCESSES
DATA STORES
OUTPUTS

Administrator

hospitals

Availability view

Register hospital and department

Manage rooms and beds
7.1
7.2

departments

Nurse

rooms

Headcount summary

Maintain employees and doctors

Publish dashboards
7.3
7.4

beds

Receptionist

employees

Assistant answer

Serve assistant queries
7.5

dashboard stats
External entity
Process
Data store
Output / report

Hospital Management System
20 / 45

<!-- Slide number: 21 -->
DATA DESIGN

ERD — Identity, Access and Setup
Seven entities: who exists, what they may do, and where they sit

![E:\minor project HMS\deck-build\assets\diagrams\erd1.png](Image0.jpg)
Hospital Management System
21 / 45

<!-- Slide number: 22 -->
DATA DESIGN

ERD — Clinical Workflow
Ten entities linking a patient to every clinical event

![E:\minor project HMS\deck-build\assets\diagrams\erd2.png](Image0.jpg)
Hospital Management System
22 / 45

<!-- Slide number: 23 -->
DATA DESIGN

ERD — Diagnostics, Pharmacy and Finance
Twelve entities closing the prescription-to-payment chain

test_types

lab_tests

lab_results

prescriptions
*id PK
*id PK
*id PK
*id PK

1
name
*test_types_id FK
*lab_tests_id FK
*patients_id FK

1

1

price
*patients_id FK
result_value
*doctors_id FK

N

N
*doctors_id FK
reported_at
*pharmacies_id FK

medicines

medicine_batches

pharmacies

pharmacy_stock

1
*id PK
*id PK
*id PK
*id PK

1
name
*medicines_id FK
*hospitals_id FK
*pharmacies_id FK

1

1

unit
batch_no
name
*medicine_batches_id FK

N
unit_price
expiry_date
quantity

1

prescription_medicines

invoices

invoice_items

payments
*prescriptions_id FK
*id PK
*id PK
*id PK

N
*medicines_id FK
*patients_id FK
*invoices_id FK
*invoices_id FK

1

dosage
total_amount
description
amount

1
status
amount
method
Hospital Management System
23 / 45

<!-- Slide number: 24 -->
DATA DESIGN

Database Schema Overview
All 27 tables grouped into eight domains

Identity & Access

Hospital Setup

Clinical

Inpatient

users

hospitals

appointments

admissions

roles

departments

doctor_schedules

nurse_assignments

patients

rooms

medical_records

employees

beds

vitals

doctors

Laboratory

Pharmacy

Prescribing

Finance

test_types

medicines

prescriptions

invoices

lab_tests

medicine_batches

prescription_medicines

invoice_items

lab_results

pharmacies

payments

pharmacy_stock
Hospital Management System
24 / 45

### Notes:
Every table is declared in SQLAlchemy and materialised by a single Alembic migration, so the deployed schema matches the model definitions exactly.

<!-- Slide number: 25 -->
USE CASES

Use Case Diagram — Patient
Self-service on the patient's own record

HOSPITAL MANAGEMENT SYSTEM

Patient

Dashboard

Profile

Appointments

Doctors

Medical Records

Lab Results

Prescriptions

Vitals

Admissions

Billing

Payments
Hospital Management System
25 / 45

<!-- Slide number: 26 -->
USE CASES

Use Case Diagram — Doctor
Clinical workspace for a practising doctor

HOSPITAL MANAGEMENT SYSTEM

Doctor

Dashboard

Appointments

Patients

Medical Records

Prescriptions

Doctor Schedule
Hospital Management System
26 / 45

<!-- Slide number: 27 -->
USE CASES

Use Case Diagram — Nurse
Focused on ward assignment and vitals capture

HOSPITAL MANAGEMENT SYSTEM

Nurse

Dashboard

Assigned Patients

Record Vitals
Hospital Management System
27 / 45

<!-- Slide number: 28 -->
USE CASES

Use Case Diagram — Receptionist
Front-desk operations from registration to admission

HOSPITAL MANAGEMENT SYSTEM

Receptionist

Dashboard

Patients

Appointments

Admissions

Billing
Hospital Management System
28 / 45

<!-- Slide number: 29 -->
USE CASES

Use Case Diagram — Pharmacist
Dispensing and stock control

HOSPITAL MANAGEMENT SYSTEM

Pharmacist

Dashboard

Prescriptions & Billing

Medicines

Medicine Batches

Pharmacies

Pharmacy Stock
Hospital Management System
29 / 45

<!-- Slide number: 30 -->
USE CASES

Use Case Diagram — Lab Technician
Test catalogue, processing and result entry

HOSPITAL MANAGEMENT SYSTEM

Lab Technician

Dashboard

Lab Prescriptions & Billing

Test Types

Lab Tests

Lab Results
Hospital Management System
30 / 45

<!-- Slide number: 31 -->
USE CASES

Use Case Diagram — Accountant
Invoice and payment settlement

HOSPITAL MANAGEMENT SYSTEM

Accountant

Dashboard

Invoices

Invoice Items

Payments
Hospital Management System
31 / 45

<!-- Slide number: 32 -->
USE CASES

Use Case Diagram — Administrator
Configuration authority across all 21 master screens

HOSPITAL MANAGEMENT SYSTEM

Administrator

Dashboard

Hospitals

Employees

Doctors

Patients

Departments

Appointments

Admissions

Rooms

Beds

Nurse Assignments

Test Types

Lab Tests

Lab Results

Medicines

Medicine Batches

Pharmacies

Pharmacy Stock

Invoices

Invoice Items

Payments
Hospital Management System
32 / 45

<!-- Slide number: 33 -->
API AND AI

REST API Design
Thirty routers exposing 168 endpoints under consistent verbs

Router

Verbs

Ops

Responsibility

/patients

GET, POST, PUT, DELETE

7

Profile, staff listings, self view

/appointments

GET, POST, PUT, DELETE

8

Booking, doctor slots, cancel

/admissions

GET, POST, PATCH, DELETE

8

Admit, discharge, by patient or doctor

/medical-records

GET, POST, PATCH, DELETE

7

Records by patient or doctor

/vitals

GET, POST, PATCH, DELETE

7

Vitals by patient or employee

/lab-results

GET, POST, PATCH, DELETE

6

Result entry and patient view

/prescriptions

GET, POST, PATCH, DELETE

6

Issue by doctor, view by patient

/pharmacy-stock

GET, POST, PATCH, DELETE

5

Stock by pharmacy and batch

/invoices

GET, POST, PATCH, DELETE

6

Invoice master, own-invoice view

/payments

GET, POST, PATCH, DELETE

5

Settlement against an invoice

/auth

POST

2

Patient registration and login

/dashboard, /chat

GET, POST

3

Aggregate statistics, assistant query
Every route carries an explicit FastAPI prefix, and protected routes declare a require_patient, require_member, require_admin or require_role dependency.
Hospital Management System
33 / 45

<!-- Slide number: 34 -->
API AND AI

AI Assistant Architecture
Role-gated tool calling over live database state

USER MESSAGE

API GATE

LLM CLIENT

TOOL DISPATCH

DATABASE

ChatBot.jsx widget

get_current_user

OpenAI-compatible POST

14 registered tools

Live query execution

Role-aware prompt

Role resolution

Model qwen2.5:3b

JSON action parse

Result passed back

Message history

Tool allow-list

Temp 0.3 · 850 tokens

Role permission map

Answer composed

RESILIENCE
Four retries with exponential backoff and respect for a Retry-After header on 429 responses.
Backoff capped at thirty seconds to keep a chat turn responsive.
Any OpenAI-compatible endpoint works: Ollama locally, or a hosted provider through environment variables.
The assistant never generates clinical data; it only reports what the database returns.
Hospital Management System
34 / 45

<!-- Slide number: 35 -->
API AND AI

Assistant Tools and Role Permissions
Fourteen tools are registered, but each is granted only to the roles that may legitimately call it. Confidential clinical data is restricted to doctors and administrators.
PATIENT TOOLS  ·  5
STAFF TOOLS  ·  9

doctor_info
admin, doctor
list_doctors
List all doctors with specialisation and department

patient_lookup
admin, doctor, nurse, receptionist, pharmacist, lab_technician

doctor_schedule

patient_medical_history
admin, doctor
Get a doctor's weekly schedule

patient_vitals
admin, doctor

book_appointment

today_summary
admin, doctor, nurse, receptionist, pharmacist, lab_technician
Book an appointment for the logged-in patient

bed_occupancy
admin, doctor, nurse, receptionist

my_appointments

low_stock
admin, doctor, nurse, pharmacist
List the logged-in patient's appointments

department_summary
admin, doctor, nurse, receptionist, pharmacist, lab_technician

cancel_appointment
Cancel the logged-in patient's appointment

my_assignments
admin, nurse
Hospital Management System
35 / 45

<!-- Slide number: 36 -->
BUILD AND DELIVERY

Business Rules Enforced by the System

Admission status lifecycle
Prescribing chain

1

5
An admission may only be admitted, discharged or cancelled, enforced by a check constraint. Discharge date cannot precede the admission date.
A prescription links patient, doctor and pharmacy, and each line resolves through prescription_medicines to a medicine and its batch.

Bed occupancy
Billing integrity

2

6
A bed belongs to exactly one room, and room availability is derived from the beds underneath it rather than stored separately.
Payments reference an invoice and invoice items reference the same invoice, so a receipt can never exist without a bill.

Slot validity
Account activity

3

7
An appointment must fall inside the doctor's declared weekly schedule, and the slot must be free before the booking is written.
A deactivated account is refused with 403 even when its token is still cryptographically valid.

Patient identity
Password ceiling

4

8
A patient profile is one-to-one with a user account, so authentication identity and clinical identity cannot drift apart.
bcrypt truncates beyond 72 bytes, so the application rejects longer passwords at hash time instead of silently weakening them.
Hospital Management System
36 / 45

<!-- Slide number: 37 -->
BUILD AND DELIVERY

Frontend Architecture

Structure

Role-aware navigation
Vite-driven React 19 single-page application
React Router 7 with per-role route trees
AuthContext providing account type and role id
Thirty Axios modules mirroring the API domains
Plain CSS design system with a dark pine and emerald palette
Sidebar resolves the menu from the logged-in role
Seven staff dashboards plus a patient dashboard
A member fallback menu for unassigned accounts
ChatBot widget mounted alongside the workspace
Consistent loading and error states per screen
Hospital Management System
37 / 45

<!-- Slide number: 38 -->
BUILD AND DELIVERY

Backend Architecture

Request pipeline

Organisation
CORS restricted to configured origins
Request validation handler returning 422
HTTP, SQLAlchemy and general exception handlers
Unified JSON success and error envelope
Static mount for the compiled frontend bundle
Thirty routers registered on the FastAPI app
Pydantic schemas per domain in a schema package
Dependency providers for database session and user
Alembic revision history for schema versioning
Settings object driven by pydantic-settings
Hospital Management System
38 / 45

<!-- Slide number: 39 -->
BUILD AND DELIVERY

Security Features

Password hashing
Stateless tokens
Request authentication

01

02

03
Passlib CryptContext
bcrypt scheme only
72-byte hard limit
JWT signed with python-jose
Subject claim holds the user id
No server-side session store
HTTPBearer scheme
401 with WWW-Authenticate on failure
Token decoded before any query

Role authorisation
Account state
Transport and origin

04

05

06
require_role allow-list
require_patient and require_member
require_admin for master data
is_active checked per request
Inactive account returns 403
Tokens stop working immediately
CORS from configured origins
Guarded SPA fallback path
Validated request payloads
Hospital Management System
39 / 45

<!-- Slide number: 40 -->
BUILD AND DELIVERY

Deployment Architecture
Containerised single-origin delivery

CLIENT
APPLICATION

Browser

Uvicorn worker

FastAPI app

Static mount

DATA

PostgreSQL

Alembic

EXTERNAL

LLM endpoint
Hospital Management System
40 / 45

<!-- Slide number: 41 -->
BUILD AND DELIVERY

Testing and Quality Assurance

Verification utilities
Discipline applied
flow_test.py exercises end-to-end request flows
Every router declares an explicit prefix and tag

check_contract.py asserts the API contract
Schemas separate create, update and response shapes

check_schema.py validates the database schema
Check constraints encode status vocabularies

verify_models.py confirms ORM definitions
Indexes cover patient, doctor, bed and status lookups

audit_data.py reviews stored data
Alembic keeps the deployed schema in step

scan_frontend.py checks the frontend surface
Oxlint runs over the frontend sources

Hospital Management System
41 / 45

<!-- Slide number: 42 -->
BUILD AND DELIVERY

Challenges and Resolutions

Problem

Resolution
Clinical data was readable by any authenticated account
One user identity and one patient identity could disagree
Slot booking could double-allocate a doctor
Invoice lines could outlive their invoice
Bed availability was asked for far more often than it was updated
An assistant could be tempted to invent clinical values
Role allow-lists on every protected route and every assistant tool
A one-to-one foreign key from patients to users
Slot validated against the doctor's schedule before the write
A mandatory invoice foreign key on items and payments
Availability derived from beds by query instead of cached
Tools return database rows; the model only narrates them
Hospital Management System
42 / 45

<!-- Slide number: 43 -->
BUILD AND DELIVERY

Future Enhancements

Patient mobile client
Insurance claims
Device integration

01

02

03
Native application on the same REST surface
Push reminders for appointments
Insurer entities and claim lifecycle
Third-party payer reconciliation
Direct vitals capture from bedside monitors
Barcode scan on medicine batches

Analytics
Notification service
Audit and compliance

04

05

06
Admission and occupancy trend reporting
Revenue and department dashboards
Email and SMS on appointment and result events
Escalation for critical results
Immutable access log for clinical reads
Retention policy per record class
Hospital Management System
43 / 45

<!-- Slide number: 44 -->
CLOSING

Conclusion
The Hospital Management System delivers a complete, role-aware digital workflow for hospital operations, implemented as a single containerised service with a three-tier architecture.

27
168
tables
endpoints
Twenty-seven normalised tables capture identity, hospital, clinical, inpatient, laboratory, pharmacy and finance data with enforced referential integrity.

Thirty routers and 168 endpoints give eight roles exactly the surface each of them needs, enforced server-side rather than in the interface.

8
45
Six Level-1 and Level-2 data flow processes plus a normalised relational design make the data lifecycle auditable end to end.

roles
slides
A fourteen-tool assistant grounded in live database state adds conversational access without widening the security boundary.

Hospital Management System
44 / 45

<!-- Slide number: 45 -->

PROJECT PRESENTATION

Thank You

Questions and suggestions are welcome.

Ashutosh Sharma
Bhavishya Sisodiya
Nitish Kumar

25204031148
25204031140
25204031115

Dr Jay Kumar Jain  ·  Dr Kuldeep Singh Yadav

MANIT BHOPAL  ·  Department of Mathematics, Bioinformatics and Computer Application

### Notes:
Close the presentation and invite questions.
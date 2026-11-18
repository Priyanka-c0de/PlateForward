# Project Audit

## Repository Overview
The current repository **Food-Waste-Analysis-in-Urban-Areas** is primarily a data‑science exploratory project. It contains:

- **README.md** – high‑level description of the food‑waste analysis study.
- **dataset/** – CSV files with raw and processed food‑waste data (e.g., `Food Waste data and research - by country.csv`).
- **documentation/** – PDFs and presentation slides describing the problem, methodology, and results.
- **notebooks/** – Jupyter notebooks (`Urban_Food_Waste_Reduction.ipynb`) that perform data cleaning, exploratory analysis, and predictive modelling using pandas, scikit‑learn, etc.
- **visualisations (results)/** – PNG images generated from the notebooks.
- **requirements.txt** – Python package list for the notebooks.

There is **no existing web application**, backend API, database schema, or front‑end code. The project is a static analysis workflow rather than an interactive decision‑support system.

## Current Technology Stack
- **Python 3.x** (assumed) with libraries: pandas, numpy, matplotlib, seaborn, scikit‑learn, statsmodels, jupyter.
- No framework such as Flask, Django, FastAPI, or a JavaScript front‑end.
- Data stored as CSV files in the `dataset/` folder.
- Visualisations are static PNGs.

## Working Components
- The notebooks run successfully when the required packages are installed.
- Data files are present and can be loaded.
- Documentation and results already exist.

## Missing / Incomplete Components (relative to the requested capstone)
| Area | Missing / Incomplete |
|------|----------------------|
| **Backend/API** | No server, no database, no REST endpoints.
| **Frontend UI** | No web UI; only static notebooks.
| **Persistent Storage** | CSV files only; no relational DB or ORM.
| **Data Import UI** | No file‑upload UI; data ingestion is manual via notebooks.
| **Analytics Dashboard** | Only static images; no interactive dashboards.
| **Matching & Decision Engine** | Not implemented; notebooks contain predictive models unrelated to surplus‑to‑need matching.
| **Authentication / Roles** | None.
| **Testing Suite** | No unit or integration tests.
| **Documentation for an application** | README pertains to a research project, not an end‑user system.

## Immediate Risks / Considerations
1. **Architecture Change** – To satisfy the capstone requirements we need to add a full web stack (backend + frontend). This will be a substantial addition but can be built on top of the existing data assets.
2. **Data Model Gaps** – The current CSV contains country‑level waste statistics, not the surplus‑offer / need records described in the specification. We will need to create new dataset templates and a demo dataset.
3. **Scope** – Since there is no existing code to refactor, the implementation will be largely new. The audit preserves all current files unchanged.

## Planned Implementation Approach
1. **Create a Git checkpoint** – (Will be done automatically by version control within the workspace).
2. **Add a lightweight backend** using **FastAPI** and **SQLite** (via SQLModel) to store the required entities (SurplusOffer, RecipientNeed, WasteObservation, Match).
3. **Develop a React (Create‑React‑App) frontend** that consumes the FastAPI endpoints. The UI will include the screens listed in the specification.
4. **Implement data‑import utilities** (CSV/Excel upload) on the backend with validation.
5. **Build the analytics dashboard** using a charting library (e.g., Recharts or Chart.js) for interactive visualisations.
6. **Create the rule‑based matching engine** (module 2) and expose it via an API endpoint.
7. **Add demo dataset** and a script to load it.
8. **Write unit tests** for backend logic and integration tests for the matching engine.
9. **Compose documentation** (README, PROJECT_AUDIT, etc.) reflecting the new architecture.

All existing files will be left untouched; new code will be added in new directories (`backend/`, `frontend/`, `demo_data/`).

---
*Audit completed on 2026‑10‑23.*
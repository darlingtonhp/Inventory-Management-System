# Smart Inventory Management System (SIMS) 🚀

Smart Inventory Management System (SIMS) is an enterprise-grade, module-based inventory logistics engine designed for high-performance warehouse catalog tracking, purchase orders, sales dispatch, and AI-powered auditing. 

Built with **Laravel 11**, **React JS**, and **Inertia.js**, SIMS delivers a smooth Single Page Application (SPA) experience with a premium animated glassmorphic interface and a visual styling engine.

---

## 🎨 Visual Upgrades & Landing Pages
* **Harare Cockpit Welcome Page:** A high-end cockpit console landing screen featuring ambient glow backlights, Zimbabwe node status details, live ping latency indicators, and glassmorphic card grids.
* **Glassmorphic Auth Pipeline:** Stunning, translucent login, registration, recovery, and password reset frames overlaid on a blur-filtered hero backplate. Includes a toggleable password visibility button (`ri-eye-line` / `ri-eye-off-line`) using Remix Icons.
* **Timeframe Statistics Dashboard:** General KPIs (Valuations, alert count, dispatches, and revenues) and module metrics adapt in real time to timeframe filters (*Today*, *This Week*, *This Month*).
* **Live Notifications Alert Bell:** A stateful top navigation notification bell that fetches and displays real-time low-stock product details, links to product sheets, and animates when levels drop below critical thresholds.

---

## 🧠 Core System Modules (8 Active Modules)
1. **Catalog Overview:** Hierarchical category trees mapping, unit measures, active products tracking, soft deletions, and barcode SKU generation.
2. **Supplier Management:** Comprehensive partner directories, contact management, trade terms, and partner logs.
3. **Purchasing Module:** Purchase order pipelines (Draft, Submitted, Received), order cost calculations, and automatic intake ingestion.
4. **Sales & Dispatch:** Customer order tracking, stock reservation, invoice lines, and dispatching.
5. **Stock Engine:** Real-time stock levels (On Hand vs Reserved), transaction journals, manual stock count adjustments, and audit histories.
6. **Reports & Analytics:** Ledger logs, valuation spreadsheets, and exports.
7. **AI Analytics Auditor (New):** Natural language cognitive agent querying. Supports:
   - **DeepSeek R1:** Reasoning models for supplier risks and anomaly tracking.
   - **OpenAI GPT-4o:** Fast context analyses and financial margins auditing.
   - **Local Rule Engine:** Secure fallback that executes localized auditing checks and outputs structured markdown tables directly from database ledgers.
8. **Admin Settings:** Global configurations, user directories, role permissions mapping, and full audit logs.

---

## ⚙️ How to Run Locally

### 1. Requirements
Ensure you have **PHP 8.2+**, **Composer**, and **NodeJS (v18+)** installed.

### 2. Environment Configuration
Copy the configuration template:
```bash
cp .env.example .env
```
Generate an application key:
```bash
php artisan key:generate --ansi
```
*(Optional)* Add AI API keys in your `.env` to enable conversational audits:
```env
OPENAI_API_KEY=your_openai_key
DEEPSEEK_API_KEY=your_deepseek_key
```

### 3. Dependency Ingestion
Install Composer and Node modules:
```bash
composer install
npm install
```

### 4. Database Seeding
Execute database migrations and feed seeders:
```bash
php artisan migrate --seed
```

### 5. Start Run Servers
Launch the Vite asset compiler and the artisan server in separate terminal screens:
```bash
# Terminal A
npm run dev

# Terminal B
php artisan serve
```

### 6. Authentication Credentials
Login to the system with the default administrator credentials:
* **Email:** `test@user.com`
* **Password:** `Test123*`

---

## 🗄️ System Architecture
* **Frontend:** React JS, Tailwind CSS, Remix Icons, Axios.
* **Backend:** Laravel Eloquent ORM, Inertia Controllers, Guzzle HTTP (API client).
* **Database:** SQLite (default for initial seeding) / MySQL ready.




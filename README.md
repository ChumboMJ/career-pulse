# 🚀 CareerPulse - AI Job Search, Skill Matcher & Unemployment Audit Assistant

**CareerPulse** is an intelligent web application designed to help candidates parse their resumes (DOCX, PDF, TXT), extract technical and professional skills, aggregate job postings from custom employer ATS feeds and top job boards, tailor resumes & cover letters, and maintain verified work search logs for state/federal unemployment benefit compliance.

---

## 🌟 Key Features

- **🔍 Multi-Source Job Discovery Engine**: Aggregates open positions from custom employer ATS feeds (Greenhouse, Lever, Ashby, Workday), remote job APIs, and curated repos.
- **🎯 Top 5 Job Boards Launchpad**: 1-click prefilled search launcher for **LinkedIn Jobs**, **Indeed**, **Glassdoor**, **ZipRecruiter**, and **Google Jobs**.
- **📄 Native DOCX & PDF Resume Parser**: Client-side text extraction using `mammoth.js` ArrayBuffer parsing for Word documents and text files.
- **👤 Multi-Profile Candidate Switcher**: Manage multiple resume profiles (*Senior Software Engineer*, *AI/Data Specialist*, *DevOps/Cloud Engineer*) with instant match score recalculations.
- **⭐ Core Skills Designation (Up to 10 Max)**: Designate up to 10 Core Skills that carry double weight (2.0x) in job matching algorithms.
- **✍️ Job-Tailored Resume & Cover Letter Studio**: Generates ATS-optimized resume variants and custom cover letters with tone controls (*Professional*, *Enthusiastic*, *Executive*).
- **🛡️ Unemployment Work Search Audit Log**: Track date applied, employer, contact person, confirmation details, and status. Includes bi-weekly claim grouping and **CSV / Printable PDF** compliance reports.
- **⚙️ Automated CI/CD Pipeline**: GitHub Actions workflow deploying to **GitHub Pages** upon successful merge into `main`.

---

## 🧮 Weighted Match Score Algorithm

The **CareerPulse Job Match Engine** evaluates every job posting against the candidate's active profile using a weighted mathematical scoring algorithm that prioritizes designated **Core Skills** while keeping all **Secondary Skills** fully included.

### 1. Skill Point Assignment
Each required skill in a job posting is categorized based on the candidate's profile:
- **Matched Core Skill** ($S_{core}$): Candidate has marked this as a Core Skill (up to 10 max). **Weight = 2.0 Points**.
- **Matched Secondary Skill** ($S_{sec}$): Candidate possesses this skill as a secondary competency. **Weight = 1.0 Point**.
- **Unmatched Skill**: Candidate does not possess this required skill. **Weight = 0 Points**.

### 2. Weighted Score Formula

$$\text{Base Score \%} = \left( \frac{\sum (M_{core} \times 2.0) + \sum (M_{sec} \times 1.0)}{\sum (R_{core} \times 2.0) + \sum (R_{sec} \times 1.0)} \right) \times 100$$

Where:
- $M_{core}$ = Number of matched Core Skills
- $M_{sec}$ = Number of matched Secondary Skills
- $R_{core}$ = Total required skills matching candidate Core Skills
- $R_{sec}$ = Total required skills matching candidate Secondary Skills

### 3. Role Title Alignment Bonus
If the job posting title contains key words matching the candidate's target job title (e.g. *Senior Software Engineer* vs. *Senior Software Engineer*), a **+8% bonus** is added to the base score.

### 4. Final Score & Alignment Letter Grade
The final score is capped between a lower floor of **20%** and an upper ceiling of **98%**:

$$\text{Final Score} = \min\left(98, \max\left(20, \text{Base Score \%} + \text{Title Bonus}\right)\right)$$

| Match Score Range | Grade | Alignment Status | Recommended Action |
| :--- | :---: | :--- | :--- |
| **88% – 98%** | **S** | **Exceptional Alignment** | Apply immediately; high probability of screening pass. |
| **75% – 87%** | **A** | **Strong Fit** | Good match; highlight missing secondary skills in cover letter. |
| **60% – 74%** | **B** | **Moderate Fit** | Consider tailoring resume keywords for target role. |
| **20% – 59%** | **C** | **Low Alignment** | Add missing core competencies before applying. |

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 + Vite
- **Styling**: Modern Glassmorphic CSS Design System (Custom CSS Tokens)
- **Icons**: Lucide React
- **Document Parser**: Mammoth.js (Client-Side `.docx` ArrayBuffer Text Extraction)
- **CI/CD & Hosting**: GitHub Actions (`pipeline.yml`) + GitHub Pages

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ChumboMJ/career-pulse.git
   cd career-pulse
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## ⚙️ CI/CD Pipeline Architecture

The project features a unified GitHub Actions workflow ([`.github/workflows/pipeline.yml`](.github/workflows/pipeline.yml)):

```
[ Push to develop / PR ] ──► [ Job 1: build-and-test ] ──► (Verify build)

[ Merge into main ]      ──► [ Job 1: build-and-test ] ──► [ Job 2: deploy ] ──► (Live on GitHub Pages 🚀)
```

- **Job 1 (`build-and-test`)**: Runs on pushes to `develop` and `main` as well as Pull Requests to verify dependencies and compilation.
- **Job 2 (`deploy`)**: Runs sequentially after `build-and-test` passes on `main` to deploy the site to **GitHub Pages**.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

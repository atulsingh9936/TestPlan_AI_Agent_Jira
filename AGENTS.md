# AitesterBlueprint - Project Overview

This directory contains a collection of test automation and AI-assisted development projects. Each project demonstrates different technology stacks and testing approaches.

---

## Project Structure

```
Documents/AitesterBlueprint/
├── Project3-RICE_POT_PROMPT_SeleniumFramework/    # Java Selenium TestNG Framework
├── Project4-LocalLLM_Prompt_Template/             # TypeScript Playwright Test Suite
├── Project5-ClaudeCodeJobAssistantBoard/          # React Job Board Application
└── Project7-TestPlan_AI_Agent_Jira/               # B.L.A.S.T. AI Agent Protocol
```

---

## Project 3: Salesforce Selenium Automation Framework

**Location:** `Project3-RICE_POT_PROMPT_SeleniumFramework/`

### Overview
Enterprise-grade Selenium WebDriver automation framework built with Java, Maven, and TestNG for testing Salesforce login functionality.

### Technology Stack
- **Language:** Java 11+
- **Build Tool:** Maven 3.8+
- **Test Framework:** TestNG 7.8.1
- **Selenium:** 4.15.2
- **WebDriverManager:** 5.6.2 (automatic driver management)

### Project Structure
```
src/
├── main/java/
│   ├── base/
│   │   └── BaseTest.java          # TestNG base class with ThreadLocal driver
│   ├── pages/
│   │   └── LoginPage.java         # Page Object Model for Salesforce login
│   └── utils/
│       └── WaitHelper.java        # Explicit wait utilities
├── test/java/
│   └── tests/
│       └── LoginTest.java         # TestNG test cases
├── pom.xml                        # Maven configuration
└── testng.xml                     # TestNG suite configuration
```

### Build Commands
```bash
# Install dependencies
mvn clean install -DskipTests

# Run all tests
mvn clean test

# Run with specific browser
mvn test -Dbrowser=chrome
mvn test -Dbrowser=firefox
mvn test -Dbrowser=edge

# Run specific test
mvn test -Dtest=LoginTest#testValidLogin

# Run with custom credentials
mvn test -Dusername=your-email@domain.com -Dpassword=your-password
```

### Code Conventions
- **Page Object Model (POM)** with PageFactory
- **XPath-only locators** (no CSS selectors)
- **Explicit Waits only** - No Thread.sleep()
- **ThreadLocal<WebDriver>** for thread-safe parallel execution
- **Comprehensive Exception Handling** with try-catch blocks
- **@FindBy annotations** for element declaration

### Test Cases
| Test | Description |
|------|-------------|
| verifyLoginPageUI | Validates all UI elements are displayed |
| testValidLogin | Tests login with valid credentials |
| testInvalidLogin | Tests error message for invalid credentials |
| testEmptyUsername | Validates empty username handling |
| testEmptyPassword | Validates empty password handling |
| testSpecialCharactersInCredentials | XSS/SQL injection security testing |
| testRememberMeFunctionality | Tests remember me checkbox |
| testForgotPasswordLink | Validates forgot password navigation |

---

## Project 4: VWO Playwright Test Suite

**Location:** `Project4-LocalLLM_Prompt_Template/`

### Overview
Comprehensive automated test suite for VWO (Visual Website Optimizer) using Playwright with TypeScript. Implements Page Object Model for maintainability.

### Technology Stack
- **Language:** TypeScript 5.3+
- **Test Framework:** Playwright 1.40+
- **Node.js:** 16+
- **Package Manager:** npm

### Project Structure
```
src/
├── config/
│   ├── playwright.config.ts       # Playwright configuration
│   └── .env.example               # Environment variables template
├── pages/
│   ├── BasePage.ts                # Base page class with common actions
│   ├── LoginPage.ts               # Login page object
│   ├── DashboardPage.ts           # Dashboard page object
│   ├── CampaignPage.ts            # Campaign creation page object
│   ├── InsightsPage.ts            # Insights page object
│   └── PersonalizePage.ts         # Personalize module page object
├── tests/
│   ├── smoke.spec.ts              # Critical path tests
│   ├── functional.spec.ts         # Core module tests
│   ├── integration.spec.ts        # Third-party integration tests
│   ├── ui_ux.spec.ts              # Visual and responsive tests
│   ├── api.spec.ts                # Backend REST endpoint tests
│   └── edge_cases.spec.ts         # Boundary and security tests
└── utils/
    └── testData.ts                # Test data generators
```

### Build Commands
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npx playwright test

# Run specific suite
npx playwright test tests/smoke.spec.ts

# Run tests by tag
npm run test:smoke
npm run test:functional

# Run in UI Mode
npx playwright test --ui

# Generate and show report
npx playwright show-report
```

### Code Conventions
- **Page Object Model** - Each page has its own class
- **Async/Await** for all asynchronous operations
- **Environment Variables** for credentials (`.env` file)
- **Selectors marked with `[NEEDS CLARIFICATION]`** are assumptions that need verification
- **Test tags:** @smoke, @functional for test categorization

### Configuration
- **Base URL:** Configurable via `BASE_URL` env variable (default: https://app.vwo.com)
- **Browsers:** Chromium, Firefox, WebKit (Safari)
- **Parallel Execution:** Enabled by default
- **Retries:** 2 retries in CI, 0 locally
- **Artifacts:** Screenshots and videos on failure

---

## Project 5: Job Board Assistant

**Location:** `Project5-ClaudeCodeJobAssistantBoard/job-board-assistant/`

### Overview
Kanban-style React application for organizing and tracking job applications. Built with Vite for fast development and LocalStorage for data persistence.

### Technology Stack
- **Framework:** React 19.2+
- **Build Tool:** Vite 7.3+
- **Language:** JavaScript (ES6+) with JSX
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **Styling:** Pure CSS with CSS variables

### Project Structure
```
job-board-assistant/
├── src/
│   ├── assets/
│   │   └── react.svg              # React logo asset
│   ├── App.jsx                    # Main application component
│   ├── App.css                    # Application styles
│   ├── index.css                  # Global styles
│   └── main.jsx                   # Entry point
├── public/                        # Static assets
├── package.json                   # Dependencies and scripts
├── index.html                     # HTML template
└── README.md                      # Project documentation
```

### Build Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Features
- **Interactive Kanban Board** with 5 stages: Wishlist, Applied, Interview, Offer, Rejected
- **Drag-and-Drop** interface for moving applications
- **Real-time Dashboard** with application statistics
- **LocalStorage Persistence** - no server required
- **Search & Filtering** by company, position, or status

### Development Server
- **URL:** http://localhost:5173
- **Hot Module Replacement** enabled

---

## Project 7: B.L.A.S.T. Master System Prompt

**Location:** `Project7-TestPlan_AI_Agent_Jira/`

### Overview
Documentation for the B.L.A.S.T. (Blueprint, Link, Architect, Stylize, Trigger) protocol and A.N.T. 3-layer architecture for building deterministic AI automation systems.

### Key Concepts
- **Protocol 0: Initialization** - Project memory setup with task_plan.md, findings.md, progress.md
- **Phase 1: Blueprint** - Discovery, Data-First Rule, JSON Schema definition
- **Phase 2: Link** - API verification and credential testing
- **Phase 3: Architect** - 3-layer architecture (Architecture/Navigation/Tools)
- **Phase 4: Stylize** - Payload refinement and UI/UX
- **Phase 5: Trigger** - Cloud deployment and automation setup

### Operating Principles
1. **Data-First Rule** - Define schemas before coding
2. **Self-Annealing** - Repair loop for tool failures
3. **Deliverables vs. Intermediates** - Cloud payload is the final goal

---

## Common Development Guidelines

### Git Workflow
All projects use Git for version control:
```bash
# Check status
git status

# Add changes
git add .

# Commit with descriptive message
git commit -m "Description of changes"

# Push to remote
git push origin main
```

### Code Style
- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing indentation patterns
- Handle exceptions gracefully

### Testing Strategy
- **Project 3:** TestNG with Maven Surefire plugin
- **Project 4:** Playwright with HTML reporter
- **Project 5:** Manual testing via UI

### CI/CD Integration
- **Project 3:** Jenkins pipeline and GitHub Actions examples in README
- **Project 4:** Playwright CI configuration ready
- **Project 5:** Static site deployment ready

---

## Security Considerations

1. **Never commit credentials** - Use `.env` files (already in `.gitignore`)
2. **Sensitive test data** - Use placeholder values in test files
3. **API keys** - Store in environment variables only
4. **LocalStorage data** - Job Board Assistant stores data locally only

---

## Troubleshooting

### Maven Projects (Project 3)
- If `mvn test` fails with driver errors: WebDriverManager should auto-download drivers
- For proxy issues: Configure proxy in Maven settings.xml

### Node.js Projects (Projects 4, 5)
- If `npm install` fails: Check Node.js version (v16+ required)
- For Playwright browser issues: Run `npx playwright install` again

### Port Conflicts
- Project 5 uses port 5173 by default (Vite)
- If port is in use, Vite will automatically use the next available port

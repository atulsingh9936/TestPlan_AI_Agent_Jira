@echo off
echo Starting Test Plan AI Agent...
echo.

:: Start Backend
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d C:\Users\Apex\Documents\AitesterBlueprint\Project7-TestPlan_AI_Agent_Jira\test-plan-agent\backend && npm start"

:: Wait a moment
timeout /t 3 /nobreak > nul

:: Start Frontend
echo Starting Frontend Dev Server...
start "Frontend Server" cmd /k "cd /d C:\Users\Apex\Documents\AitesterBlueprint\Project7-TestPlan_AI_Agent_Jira\test-plan-agent\frontend && npm run dev"

:: Wait a moment
timeout /t 5 /nobreak > nul

:: Open Browser
echo Opening Browser...
start http://localhost:5173

echo.
echo Test Plan AI Agent is starting up!
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
pause

#!/usr/bin/env bash

# Hospital Daily Wage Salary System (MERN Stack)
# Startup Script

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=========================================================="
echo "🏥 Starting Hospital Administration Daily Wage Payroll System"
echo "=========================================================="

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not found. Please install Node.js (v18+)."
    exit 1
fi

echo "1. Checking dependencies..."
if [ ! -d "server/node_modules" ]; then
    echo "   Installing server packages..."
    cd "$DIR/server" && npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "   Installing client packages..."
    cd "$DIR/client" && npm install
fi

cd "$DIR"

echo "2. Launching Backend Server on port 5000..."
cd "$DIR/server" && npm start &
SERVER_PID=$!

echo "3. Launching React Frontend on port 3000..."
cd "$DIR/client" && npm run dev &
CLIENT_PID=$!

trap "kill $SERVER_PID $CLIENT_PID; echo 'Shutting down services...'; exit" INT TERM

sleep 2
echo "=========================================================="
echo "✅ Hospital Wage System is Online!"
echo "   - Web UI: http://localhost:3000"
echo "   - API:    http://localhost:5000"
echo "=========================================================="
echo "Press Ctrl+C to stop all servers."

wait

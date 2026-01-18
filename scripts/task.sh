#!/bin/bash

# C.R.A.B Task Manager CLI
# Connects to the live D1-powered API

API_URL="https://crab-todo.sheraj.org/api/tasks"

case "$1" in
  add)
    if [ -z "$2" ]; then
      echo "Usage: $0 add \"Task title\""
      exit 1
    fi
    echo "Adding task..."
    curl -s -X POST "$API_URL" -H "Content-Type: application/json" -d "{\"title\":\"$2\"}" | jq '.'
    ;;
  list)
    echo "Fetching all tasks..."
    curl -s "$API_URL" | jq -r '.tasks[] | "\(.id) | \(.status | if . == "pending" then "⏳ pending" elif . == "in-progress" then "🔄 in-progress" else "✅ completed" end) | \(.title)"'
    ;;
  pending)
    echo "Fetching pending tasks..."
    curl -s "$API_URL" | jq -r '.tasks[] | select(.status == "pending") | "\(.id) | ⏳ \(.title)"'
    ;;
  done)
    if [ -z "$2" ]; then
      echo "Usage: $0 done <task_id>"
      exit 1
    fi
    echo "Marking task as completed..."
    curl -s -X PATCH "$API_URL/$2" -H "Content-Type: application/json" -d "{\"status\":\"completed\"}" | jq '.'
    ;;
  progress)
    if [ -z "$2" ]; then
      echo "Usage: $0 progress <task_id>"
      exit 1
    fi
    echo "Marking task as in-progress..."
    curl -s -X PATCH "$API_URL/$2" -H "Content-Type: application/json" -d "{\"status\":\"in-progress\"}" | jq '.'
    ;;
  delete)
    if [ -z "$2" ]; then
      echo "Usage: $0 delete <task_id>"
      exit 1
    fi
    echo "Deleting task..."
    curl -s -X DELETE "$API_URL/$2" | jq '.'
    ;;
  status)
    echo "Checking API status..."
    response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL")
    if [ "$response" == "200" ]; then
      echo "✅ API is online ($API_URL)"
      count=$(curl -s "$API_URL" | jq '.count')
      echo "📊 Total tasks: $count"
    else
      echo "❌ API returned status: $response"
    fi
    ;;
  *)
    echo "🦀 C.R.A.B Task Manager CLI"
    echo ""
    echo "Usage: $0 <command> [args]"
    echo ""
    echo "Commands:"
    echo "  add \"title\"      - Add a new task"
    echo "  list              - List all tasks"
    echo "  pending           - List pending tasks only"
    echo "  done <id>         - Mark task as completed"
    echo "  progress <id>     - Mark task as in-progress"
    echo "  delete <id>       - Delete a task"
    echo "  status            - Check API connectivity"
    echo ""
    echo "API: $API_URL"
    echo ""
    ;;
esac

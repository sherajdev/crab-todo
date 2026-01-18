#!/bin/bash

API_URL="http://localhost:3000/api/tasks"
TASKS_FILE="$(dirname "$0")/../.tasks/tasks.json"

case "$1" in
  add)
    if [ -z "$2" ]; then
      echo "Usage: $0 add \"Task title\""
      exit 1
    fi
    curl -s -X POST "$API_URL" -H "Content-Type: application/json" -d "{\"title\":\"$2\"}"
    echo ""
    ;;
  list)
    curl -s "$API_URL" | jq '.tasks[] | "\(.id) | \(.status) | \(.title)"'
    ;;
  pending)
    curl -s "$API_URL" | jq '.tasks[] | select(.status == "pending") | "\(.id) | \(.title)"'
    ;;
  done)
    if [ -z "$2" ]; then
      echo "Usage: $0 done <task_id>"
      exit 1
    fi
    curl -s -X PATCH "$API_URL/$2" -H "Content-Type: application/json" -d "{\"status\":\"completed\"}"
    echo ""
    ;;
  progress)
    if [ -z "$2" ]; then
      echo "Usage: $0 progress <task_id>"
      exit 1
    fi
    curl -s -X PATCH "$API_URL/$2" -H "Content-Type: application/json" -d "{\"status\":\"in-progress\"}"
    echo ""
    ;;
  delete)
    if [ -z "$2" ]; then
      echo "Usage: $0 delete <task_id>"
      exit 1
    fi
    curl -s -X DELETE "$API_URL/$2"
    echo ""
    ;;
  *)
    echo "Task Manager CLI"
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
    echo ""
    ;;
esac

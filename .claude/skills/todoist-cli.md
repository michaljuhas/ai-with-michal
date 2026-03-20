---
name: todoist-cli
description: Use when the user wants to interact with Todoist from the CLI — manage tasks, projects, sections, labels, comments, activities, and reminders using the local todoist-cli wrapper.
---

# Todoist CLI

A lightweight CLI wrapper for the Todoist REST API v1. Run it with:

```bash
node --env-file=.env scripts/todoist/index.mjs <resource> <command> [options]
```

## Setup

Required environment variable (add to `.env`):

| Variable | Description | Example |
|---|---|---|
| `TODOIST_API_TOKEN` | Todoist API token (from Todoist Settings → Integrations → API token) | `0123456789abcdef...` |

No build step needed — pure `.mjs`.

## Tasks

```bash
# List all tasks
node --env-file=.env scripts/todoist/index.mjs tasks list

# List tasks in a project
node --env-file=.env scripts/todoist/index.mjs tasks list --project-id <proj-id>

# Pretty table output
node --env-file=.env scripts/todoist/index.mjs tasks list --pretty

# Filter by label
node --env-file=.env scripts/todoist/index.mjs tasks list --label home

# Get a specific task
node --env-file=.env scripts/todoist/index.mjs tasks get <id>

# Add a task
node --env-file=.env scripts/todoist/index.mjs tasks add --content "Buy milk" --due-string "tomorrow"

# Add a high-priority task in a project
node --env-file=.env scripts/todoist/index.mjs tasks add --content "Review PR" --priority 1 --project-id <proj-id>

# Update a task
node --env-file=.env scripts/todoist/index.mjs tasks update <id> --content "Buy oat milk" --due-string "friday"

# Delete a task
node --env-file=.env scripts/todoist/index.mjs tasks delete <id>

# Close (complete) a task
node --env-file=.env scripts/todoist/index.mjs tasks close <id>

# Reopen a completed task
node --env-file=.env scripts/todoist/index.mjs tasks reopen <id>

# Move a task to a different project
node --env-file=.env scripts/todoist/index.mjs tasks move <id> --project-id <proj-id>

# Move a task to a section
node --env-file=.env scripts/todoist/index.mjs tasks move <id> --section-id <section-id>

# Filter tasks using Todoist filter syntax
node --env-file=.env scripts/todoist/index.mjs tasks filter --filter "today & p1"
node --env-file=.env scripts/todoist/index.mjs tasks filter --filter "overdue | tomorrow"

# Quick add (natural language, like typing in Todoist)
node --env-file=.env scripts/todoist/index.mjs tasks quick --text "Buy milk tomorrow p1 @home"
```

## Projects

```bash
# List all projects
node --env-file=.env scripts/todoist/index.mjs projects list

# Pretty table output
node --env-file=.env scripts/todoist/index.mjs projects list --pretty

# Get a specific project
node --env-file=.env scripts/todoist/index.mjs projects get <id>

# Add a project
node --env-file=.env scripts/todoist/index.mjs projects add --name "My Project"

# Add a project with color and set as favorite
node --env-file=.env scripts/todoist/index.mjs projects add --name "Work" --color blue --is-favorite true

# Update a project
node --env-file=.env scripts/todoist/index.mjs projects update <id> --name "Renamed Project" --color red

# Delete a project
node --env-file=.env scripts/todoist/index.mjs projects delete <id>

# Archive a project
node --env-file=.env scripts/todoist/index.mjs projects archive <id>

# Unarchive a project
node --env-file=.env scripts/todoist/index.mjs projects unarchive <id>
```

## Sections

```bash
# List all sections
node --env-file=.env scripts/todoist/index.mjs sections list

# List sections in a specific project
node --env-file=.env scripts/todoist/index.mjs sections list --project-id <proj-id>

# Get a specific section
node --env-file=.env scripts/todoist/index.mjs sections get <id>

# Add a section
node --env-file=.env scripts/todoist/index.mjs sections add --name "In Progress" --project-id <proj-id>

# Update a section
node --env-file=.env scripts/todoist/index.mjs sections update <id> --name "Done"

# Delete a section
node --env-file=.env scripts/todoist/index.mjs sections delete <id>
```

## Labels

```bash
# List all labels
node --env-file=.env scripts/todoist/index.mjs labels list

# Get a specific label
node --env-file=.env scripts/todoist/index.mjs labels get <id>

# Add a label
node --env-file=.env scripts/todoist/index.mjs labels add --name "home"

# Add a label with color
node --env-file=.env scripts/todoist/index.mjs labels add --name "urgent" --color red --order 1

# Update a label
node --env-file=.env scripts/todoist/index.mjs labels update <id> --name "home-errands" --color orange

# Delete a label
node --env-file=.env scripts/todoist/index.mjs labels delete <id>
```

## Comments

```bash
# List comments on a task
node --env-file=.env scripts/todoist/index.mjs comments list --task-id <id>

# List comments on a project
node --env-file=.env scripts/todoist/index.mjs comments list --project-id <proj-id>

# Get a specific comment
node --env-file=.env scripts/todoist/index.mjs comments get <id>

# Add a comment to a task
node --env-file=.env scripts/todoist/index.mjs comments add --task-id <id> --content "This is done, pending review"

# Add a comment to a project
node --env-file=.env scripts/todoist/index.mjs comments add --project-id <proj-id> --content "Kickoff meeting scheduled"

# Update a comment
node --env-file=.env scripts/todoist/index.mjs comments update <id> --content "Updated comment text"

# Delete a comment
node --env-file=.env scripts/todoist/index.mjs comments delete <id>
```

## Activities

```bash
# List all activity events
node --env-file=.env scripts/todoist/index.mjs activities list

# Filter by object type (item, project, note, etc.)
node --env-file=.env scripts/todoist/index.mjs activities list --object-type item

# Filter by a specific object ID
node --env-file=.env scripts/todoist/index.mjs activities list --object-id <id>

# Filter by event type (added, updated, completed, deleted, etc.)
node --env-file=.env scripts/todoist/index.mjs activities list --event-type completed

# Limit results and paginate
node --env-file=.env scripts/todoist/index.mjs activities list --limit 20 --offset 0

# Filter by parent project
node --env-file=.env scripts/todoist/index.mjs activities list --parent-project-id <proj-id>

# Filter by time range
node --env-file=.env scripts/todoist/index.mjs activities list --since "2026-01-01T00:00:00" --until "2026-03-01T00:00:00"

# Pretty table
node --env-file=.env scripts/todoist/index.mjs activities list --pretty
```

## Reminders

```bash
# List all reminders
node --env-file=.env scripts/todoist/index.mjs reminders list

# List reminders for a specific task
node --env-file=.env scripts/todoist/index.mjs reminders list --task-id <id>

# Get a specific reminder
node --env-file=.env scripts/todoist/index.mjs reminders get <id>

# Add an absolute reminder (at a specific date/time)
node --env-file=.env scripts/todoist/index.mjs reminders add --task-id <id> --type absolute --due-date "2026-04-01T09:00:00"

# Add a relative reminder (N minutes before due)
node --env-file=.env scripts/todoist/index.mjs reminders add --task-id <id> --type relative --minute-offset 30

# Update a reminder
node --env-file=.env scripts/todoist/index.mjs reminders update <id> --minute-offset 60

# Delete a reminder
node --env-file=.env scripts/todoist/index.mjs reminders delete <id>
```

## Output Format

Default output is pretty-printed JSON (pipeable to `jq`):

```bash
node --env-file=.env scripts/todoist/index.mjs tasks list | jq '.results[] | {id, content}'
```

Use `--pretty` for a human-readable ASCII table:

```bash
node --env-file=.env scripts/todoist/index.mjs tasks list --pretty
node --env-file=.env scripts/todoist/index.mjs projects list --pretty
```

## Error Handling

Errors print to stderr:
```
[TODOIST ERROR] code=403 Forbidden
```

- Exit code `0` on success, `1` on error
- If `TODOIST_API_TOKEN` is not set, exits immediately with code `1` and a message on stderr

## Running Tests

```bash
# All tests
node --test scripts/todoist/tests/client.test.mjs scripts/todoist/tests/pagination.test.mjs scripts/todoist/tests/output.test.mjs scripts/todoist/tests/tasks.test.mjs scripts/todoist/tests/projects.test.mjs scripts/todoist/tests/sections.test.mjs scripts/todoist/tests/labels.test.mjs scripts/todoist/tests/comments.test.mjs scripts/todoist/tests/activities.test.mjs scripts/todoist/tests/reminders.test.mjs scripts/todoist/tests/integration.test.mjs

# Integration tests only
node --test scripts/todoist/tests/integration.test.mjs
```

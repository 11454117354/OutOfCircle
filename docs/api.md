# API Overview

## User

POST /api/register
- Get users registered

POST /api/login
- User login

GET /api/me
- Get users' info for frontend

POST /api/logout
- User logout

## Weeks

POST /api/week/create
- Create a new "week"
    ```json
    {
    "name": "week1",
    "start_time": "2025-12-26T15:30:00",
    "end_time": "2025-12-26T16:30:00",
    }
    
GET /api/weeks/current
- Get current week name and info

## Tasks

POST /api/tasks
- Create a new task in specific week

GET /api/weeks/<week_id>/tasks
- Get tasks for a week

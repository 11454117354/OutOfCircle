# Weekly Time Manager

A weekly-based time management tool for tracking deadlines and scheduling work time.

This project was built as my CS50 Final Project.
I wanted to create a tool that fits my own study habits: managing deadlines and planning word on a weekly basis rather than daily task lists.

## Features

- User authentication
- View tasks and deadlines by week
- Add deadlines with due dates and estimated time
- Create categories of your own to classify tasks

## Tech Stack

- Backend: Flask(Python)
- Database: SQLite(local) and PostgreSQL(render)
- Frontend: HTML, CSS, Javascript, Jinja2
- API: RESTful API

## How to Run

1. Clone the repository
2. Create a virtual environment and install dependencies:
    ```bash
    pip install -r requirements.txt
3. Initialize the database:
    ```bash
    python3 ./create_db.py
4. Run the application:
    ```bash
    python3 ./app.py
5. Open the browser at http://127.0.0.1:5000
   
## Future Improvememts
- Tear down the app.py into smaller ones
- Change username, password.etc
- Change pages, soft delete, logging...
- Auto-delaying for unfinished work to the next week
- iOS client using the same API
- Visually-appealing calender with task blocks and class schedule
- A build-in focus timer 
  

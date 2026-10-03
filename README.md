# Task Manager

A small task manager built with Django REST Framework and React. You can add, edit, finish, and delete tasks.

## Project folders

- `backend/` contains the Django API.
- `frontend/` contains the React app.

## Start the backend

You need Python 3.10 or newer.

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment.

Windows:

```bash
.venv\Scripts\activate
```

macOS or Linux:

```bash
source .venv/bin/activate
```

Install the packages, set up the SQLite database, and start the server:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API runs at `http://127.0.0.1:8000/`.

## Start the frontend

Open another terminal. You need Node.js 18 or newer.

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173/` in your browser.

## API endpoints

| Method | URL | What it does |
| --- | --- | --- |
| GET | `/tasks/` | Lists all tasks |
| POST | `/tasks/` | Creates a task |
| GET | `/tasks/{id}/` | Gets one task |
| PUT | `/tasks/{id}/` | Updates its title and description |
| PATCH | `/tasks/{id}/` | Switches completed on or off |
| DELETE | `/tasks/{id}/` | Deletes a task |

## Run the backend tests

From the `backend` folder:

```bash
python manage.py test
```

## Notes

- SQLite is used, so no separate database setup is needed.
- The frontend expects the API at `http://127.0.0.1:8000/tasks/`.
- To use a different API address, set `VITE_API_URL` before starting the frontend. The value should end with `/tasks/`.


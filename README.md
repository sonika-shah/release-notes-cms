# Release Notes CMS

A modern Content Management System built with Python FastAPI and React.

## Project Structure

```
release-notes-cms/
├── backend/           # Python FastAPI backend
│   ├── app/          # Application code
│   ├── tests/        # Backend tests
│   └── requirements.txt
├── frontend/         # React frontend
│   ├── src/          # Source code
│   ├── public/       # Static files
│   └── package.json
└── docker/           # Docker configuration
```

## Prerequisites

- Python 3.9+
- Node.js 16+
- PostgreSQL 13+
- Docker (optional)

## Setup Instructions

### Backend Setup

1. Create and activate virtual environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the backend:

```bash
uvicorn app.main:app --reload
```

### Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the development server:

```bash
npm start
```

## Development

- Backend API docs: http://localhost:8000/docs
- Frontend: http://localhost:3000

## License

MIT

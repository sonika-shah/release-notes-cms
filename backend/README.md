# Backend Setup

## Environment Variables

Create a `.env` file in the root of the backend directory with the following variables:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/release_notes_cms
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Database Setup

1. Make sure PostgreSQL is installed and running
2. Create a new database:

```sql
CREATE DATABASE release_notes_cms;
```

3. Initialize the database tables:

```bash
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## Running the Application

1. Create and activate virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the application:

```bash
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000
API documentation will be available at http://localhost:8000/docs

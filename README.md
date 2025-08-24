
Sabco Backend (Django + DRF + CKEditor) - README
===============================================

This is the Django backend for the Sabco Multi Trade LTD website.
It uses SQLite for development and includes DRF APIs and CKEditor for rich text fields.

Quick start:

1. Create a virtualenv and install dependencies
   python -m venv .venv
   source .venv/bin/activate   # Windows: .venv\Scripts\activate
   pip install -r requirements.txt

2. Copy `.env.example` to `.env` and update the SENDGRID_API_KEY and emails:
   cp .env.example .env
   # Edit .env and add SENDGRID_API_KEY

3. Run migrations and create a superuser:
   python manage.py migrate
   python manage.py createsuperuser

4. (Optional) Load sample data (fixtures provided):
   python manage.py loaddata fixtures/sample_data.json

5. Run the dev server:
   python manage.py runserver

Notes:
- CKEditor requires static files; in production configure STATIC_ROOT and run collectstatic.
- SendGrid: set SENDGRID_API_KEY in your .env and ensure DEFAULT_FROM_EMAIL is verified in SendGrid.
- The API is available at /api/ (services, projects, posts, certifications, team, contact)

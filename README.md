# Support Ticket Management System

A web-based support ticket management system built with Flask and SQLite, featuring AI-powered response generation and Telegram notifications.

## Features

- Create and manage support tickets
- AI-powered response generation
- Telegram notifications for ticket updates
- Multiple entry types (SE Note, My Note, My Answer, Customer's Reply)
- Status tracking (investigating, waiting, closed)
- Automatic status updates
- Summary generation for closed tickets

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Git

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd [repository-name]
```

2. Create and activate a virtual environment:
```bash
# On macOS/Linux
python3 -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
venv\Scripts\activate
```

3. Install required packages:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the project root directory with the following content:
```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

## Running the Application

1. Start the Flask server:
```bash
# On macOS/Linux
flask run

# On Windows
set FLASK_APP=app.py
flask run
```

2. Open your web browser and navigate to:
```
http://127.0.0.1:5000
```

## Usage

1. Create a new ticket:
   - Click "New Ticket" button
   - Fill in the ticket details
   - Add entries using the "+" button
   - Save the ticket

2. Manage tickets:
   - View ticket list at the main page
   - Click on a ticket to view/edit details
   - Use "Ask AI" to generate AI responses
   - Use "Ask Summary" to generate a summary and close the ticket

3. Notifications:
   - Configure Telegram notifications in settings
   - Receive updates when ticket status changes

## Project Structure

```
project/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── .env               # Environment variables
├── frontend/          # Frontend files
│   ├── index.html     # Main page
│   ├── list.html      # Ticket list page
│   └── script.js      # Frontend JavaScript
└── database.db        # SQLite database
```

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
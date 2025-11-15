# Kichi Recipe - Dish Name Generator

A minimalist web app that suggests creative names for dishes based on uploaded photos. The app learns your naming preferences over time to provide increasingly personalized suggestions.

## Features

- **Creative Name Generation**: Uses a rule-based algorithm to generate unique, creative dish names
- **Personalized Learning**: Tracks your selections to understand your preferred naming style
- **Minimalist Design**: Clean, text-only interface with no distractions
- **Privacy-First**: Photos are deleted immediately after processing
- **History Tracking**: View all previously named dishes
- **No API Keys Required**: Works completely offline with built-in name generation

## Prerequisites

- Node.js (v14 or higher)

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the App

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The app will be available at `http://localhost:3000`

## How to Use

1. **Upload a Photo**: Click or drag-and-drop a photo of your dish (JPG or PNG)
2. **Generate Names**: Click the "Generate Dish Names" button
3. **Select a Name**: Choose one of the three suggested names
4. **View History**: Click "History" to see all your previously named dishes

## Project Structure

```
├── public/
│   ├── index.html      # Main HTML file with all three pages
│   ├── style.css       # Minimalist CSS styling
│   └── app.js          # Front-end JavaScript
├── data/
│   ├── history.json    # Stored dish history
│   └── preferences.json # User preference data
├── server.js           # Express server with API endpoints
├── .env                # Environment variables (create from .env.example)
└── package.json        # Project dependencies
```

## API Endpoints

- `POST /api/generate-names` - Generate 3 dish name suggestions from uploaded image
- `POST /api/save-selection` - Save selected dish name and update preferences
- `GET /api/history` - Retrieve all previously named dishes

## Learning System

The app learns your preferences by:
- Tracking selected name lengths (short vs. long)
- Identifying frequently chosen keywords
- Analyzing naming style patterns
- Incorporating learned keywords into future name suggestions

The more you use it, the better it gets at suggesting names you'll love!

## How It Works

The name generator uses creative templates combining:
- **Elegant style**: "The [Adjective] [Noun]" (e.g., "The Golden Symphony")
- **Playful style**: "[Playful Prefix] [Food]" (e.g., "Ode to Weekend Curry")
- **Descriptive style**: "[Adjective] [Adjective] [Food]" (e.g., "Savory Roasted Delight")

As you select names, the app learns your favorite keywords and incorporates them into future suggestions.

## Privacy

- Uploaded photos are stored temporarily and deleted immediately after processing
- Only selected dish names and metadata are stored locally
- No personal data is collected or shared
- No external API calls - everything runs locally

## Technology Stack

- **Front-end**: Vanilla JavaScript, HTML5, CSS3
- **Back-end**: Node.js, Express
- **Name Generation**: Rule-based algorithm with learning
- **Storage**: Local JSON files

## License

MIT

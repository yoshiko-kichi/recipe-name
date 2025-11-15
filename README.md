# Kichi Recipe - Dish Name Generator

A minimalist web app that suggests creative names for dishes based on uploaded photos. The app learns your naming preferences over time to provide increasingly personalized suggestions.

## Features

- **AI-Powered Name Generation**: Uses OpenAI GPT-4 Vision to analyze dish photos and generate creative, relevant names
- **Personalized Learning**: Tracks your selections to understand your preferred naming style
- **Minimalist Design**: Clean, text-only interface with no distractions
- **Privacy-First**: Photos are deleted immediately after processing
- **History Tracking**: View all previously named dishes
- **Intelligent Fallback**: Works with random generation if AI is unavailable

## Prerequisites

- Node.js (v14 or higher)
- OpenAI API key (get one at https://platform.openai.com/api-keys)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

3. Add your OpenAI API key to the `.env` file:
```
OPENAI_API_KEY=your_openai_api_key_here
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

1. **Image Analysis**: When you upload a dish photo, GPT-4 Vision analyzes the image to identify ingredients, cooking methods, colors, textures, and cuisine type
2. **Name Generation**: Based on the analysis, GPT-4 generates 3 creative dish names in different styles:
   - **Elegant/Poetic**: Evocative and artistic names
   - **Playful/Fun**: Whimsical and approachable names
   - **Descriptive/Straightforward**: Clear and informative names
3. **Learning**: As you select names, the app learns your preferences and incorporates your favorite keywords and styles into future suggestions
4. **Fallback**: If the AI service is unavailable, the app falls back to a creative template-based system

## Privacy

- Uploaded photos are stored temporarily and deleted immediately after name generation
- Only selected dish names and metadata are stored locally
- No personal data is collected or shared
- Images are sent to OpenAI for analysis (see OpenAI's privacy policy)

## Technology Stack

- **Front-end**: Vanilla JavaScript, HTML5, CSS3
- **Back-end**: Node.js, Express
- **AI**: OpenAI GPT-4 Vision for image analysis and name generation
- **Storage**: Local JSON files

## License

MIT

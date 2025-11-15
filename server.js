const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        try {
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false); // Reject file silently, handle in route
        }
    }
});

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');
const PREFERENCES_FILE = path.join(DATA_DIR, 'preferences.json');

// Initialize data directory
async function initializeDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });

        // Initialize history file if it doesn't exist
        try {
            await fs.access(HISTORY_FILE);
        } catch {
            await fs.writeFile(HISTORY_FILE, JSON.stringify([]));
        }

        // Initialize preferences file if it doesn't exist
        try {
            await fs.access(PREFERENCES_FILE);
        } catch {
            await fs.writeFile(PREFERENCES_FILE, JSON.stringify({
                selectedNames: [],
                keywords: {},
                tonePreferences: {}
            }));
        }
    } catch (error) {
        console.error('Error initializing data directory:', error);
    }
}

// Load preferences
async function loadPreferences() {
    try {
        const data = await fs.readFile(PREFERENCES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {
            selectedNames: [],
            keywords: {},
            tonePreferences: {}
        };
    }
}

// Save preferences
async function savePreferences(preferences) {
    try {
        await fs.writeFile(PREFERENCES_FILE, JSON.stringify(preferences, null, 2));
    } catch (error) {
        console.error('Error saving preferences:', error);
    }
}

// Load history
async function loadHistory() {
    try {
        const data = await fs.readFile(HISTORY_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Save history
async function saveHistory(history) {
    try {
        await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
    } catch (error) {
        console.error('Error saving history:', error);
    }
}

// Random name generation templates
const nameTemplates = {
    adjectives: [
        'Golden', 'Crimson', 'Sunset', 'Emerald', 'Savory', 'Spicy', 'Delicate',
        'Rustic', 'Garden', 'Summer', 'Winter', 'Autumn', 'Spring', 'Roasted',
        'Grilled', 'Sizzling', 'Tender', 'Crunchy', 'Creamy', 'Zesty', 'Tangy',
        'Smoky', 'Fragrant', 'Aromatic', 'Herb-Kissed', 'Glazed', 'Caramelized',
        'Pan-Seared', 'Oven-Baked', 'Slow-Cooked', 'Charred', 'Buttery'
    ],
    nouns: [
        'Delight', 'Symphony', 'Medley', 'Fusion', 'Feast', 'Creation', 'Dream',
        'Harvest', 'Melody', 'Paradise', 'Wonder', 'Celebration', 'Journey',
        'Adventure', 'Masterpiece', 'Treasure', 'Magic', 'Bliss', 'Fantasy',
        'Rhapsody', 'Serenade', 'Enchantment', 'Odyssey', 'Harmony'
    ],
    descriptors: [
        'Weekend', 'Sunday', 'Saturday', 'Evening', 'Morning', 'Midnight',
        'Homestyle', 'Classic', 'Traditional', 'Modern', 'Fusion', 'Artisan',
        'Gourmet', 'Comfort', 'Elegant', 'Simple', 'Rustic', 'Urban', 'Countryside'
    ],
    foods: [
        'Curry', 'Stir-Fry', 'Roast', 'Pasta', 'Rice Bowl', 'Noodles', 'Soup',
        'Salad', 'Gratin', 'Casserole', 'Skillet', 'Platter', 'Bowl', 'Plate',
        'Dish', 'Feast', 'Medley', 'Mix', 'Blend'
    ],
    playful: [
        'The Happy', 'The Lazy', 'The Cozy', 'The Merry', 'The Jolly',
        'Love Letter to', 'Ode to', 'Symphony of', 'Dance of', 'Tales of'
    ]
};

// Analyze dish image using OpenAI Vision
async function analyzeDishImage(imagePath) {
    try {
        // Read the image and convert to base64
        const imageBuffer = await fs.readFile(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Describe this dish in detail. Focus on: main ingredients, cooking method, colors, texture, cuisine type, and overall appearance. Be concise but descriptive."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`
                            }
                        }
                    ]
                }
            ],
            max_tokens: 300
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error analyzing image:', error);
        throw error;
    }
}

// Generate dish names using AI based on image analysis
async function generateDishNames(imagePath) {
    const preferences = await loadPreferences();

    // Check if we have learned preferences
    const hasPreferences = preferences.selectedNames.length > 0;
    let preferenceContext = '';

    if (hasPreferences) {
        // Get top favorite keywords
        const favoriteKeywords = Object.entries(preferences.keywords)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([word]) => word);

        const recentNames = preferences.selectedNames.slice(-5);

        preferenceContext = `\n\nUser's naming preferences (incorporate these styles if appropriate):
- Frequently used words: ${favoriteKeywords.join(', ')}
- Recent selected names: ${recentNames.join(', ')}`;
    }

    try {
        // Analyze the dish image
        const dishDescription = await analyzeDishImage(imagePath);

        // Generate creative names based on the description
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a creative dish naming expert. Generate exactly 3 unique, creative, and appealing dish names. Names should be concise (2-5 words), evocative, and match the dish's characteristics. Use varied styles: one elegant/poetic, one playful/fun, and one descriptive/straightforward."
                },
                {
                    role: "user",
                    content: `Based on this dish description, generate 3 creative dish names:\n\n${dishDescription}${preferenceContext}\n\nProvide ONLY the 3 names, one per line, without numbering or explanation.`
                }
            ],
            max_tokens: 150,
            temperature: 0.9
        });

        const namesText = response.choices[0].message.content.trim();
        const names = namesText.split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0)
            .slice(0, 3);

        // Ensure we have exactly 3 names
        if (names.length < 3) {
            throw new Error('Failed to generate 3 names');
        }

        return names;
    } catch (error) {
        console.error('Error generating names with AI:', error);
        // Fallback to random generation if API fails
        return generateRandomDishNames();
    }
}

// Fallback: Generate random dish names (used if AI fails)
async function generateRandomDishNames() {
    const preferences = await loadPreferences();
    const names = [];

    // Check if we have learned preferences
    const hasPreferences = preferences.selectedNames.length > 0;
    let favoriteKeywords = [];

    if (hasPreferences) {
        // Get top 3 favorite keywords
        favoriteKeywords = Object.entries(preferences.keywords)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
    }

    // Generate 3 different styles of names

    // Style 1: Elegant - "The [Adjective] [Noun]"
    const adj1 = randomFrom(nameTemplates.adjectives);
    const noun1 = randomFrom(nameTemplates.nouns);
    names.push(`The ${adj1} ${noun1}`);

    // Style 2: Playful - "[Playful Prefix] [Descriptor] [Food]"
    const playful = randomFrom(nameTemplates.playful);
    const descriptor = randomFrom(nameTemplates.descriptors);
    const food = randomFrom(nameTemplates.foods);

    if (hasPreferences && favoriteKeywords.length > 0 && Math.random() > 0.5) {
        // Use learned preferences
        names.push(`${playful} ${randomFrom(favoriteKeywords)}`);
    } else {
        names.push(`${playful} ${descriptor} ${food}`);
    }

    // Style 3: Descriptive - "[Adjective] [Adjective] [Food]"
    const adj2 = randomFrom(nameTemplates.adjectives);
    const adj3 = randomFrom(nameTemplates.adjectives);
    const food2 = randomFrom(nameTemplates.foods);

    // Make sure we don't use the same adjective twice
    while (adj2 === adj3) {
        adj3 = randomFrom(nameTemplates.adjectives);
    }

    if (hasPreferences && favoriteKeywords.length > 1 && Math.random() > 0.3) {
        // Incorporate learned preferences
        names.push(`${randomFrom(favoriteKeywords)} ${randomFrom(nameTemplates.nouns)}`);
    } else {
        names.push(`${adj2} ${adj3} ${food2}`);
    }

    return names;
}

// Helper function to get random element from array
function randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Update preferences based on selection
async function updatePreferences(selectedName, allSuggestions) {
    const preferences = await loadPreferences();

    // Add to selected names
    preferences.selectedNames.push(selectedName);

    // Extract and count keywords (words longer than 3 characters)
    const words = selectedName.toLowerCase().split(/\s+/)
        .filter(word => word.length > 3 && !/^(the|and|with|for)$/.test(word));

    words.forEach(word => {
        preferences.keywords[word] = (preferences.keywords[word] || 0) + 1;
    });

    await savePreferences(preferences);
}

// API Routes

// Error handling middleware for multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, error: err.message });
    } else if (err) {
        return res.status(400).json({ success: false, error: err.message });
    }
    next();
});

// Generate names endpoint
app.post('/api/generate-names', upload.single('image'), async (req, res) => {
    let imagePath = null;
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No valid image file uploaded. Please upload a JPEG, PNG, GIF, or WebP image.' });
        }

        imagePath = req.file.path;

        // Generate names using AI vision
        const names = await generateDishNames(imagePath);

        // Delete the uploaded file (privacy requirement)
        await fs.unlink(imagePath);

        res.json({ success: true, names });
    } catch (error) {
        console.error('Error in generate-names:', error);

        // Clean up uploaded file if it exists
        if (imagePath) {
            try {
                await fs.unlink(imagePath);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }

        res.status(500).json({ success: false, error: error.message });
    }
});

// Save selection endpoint
app.post('/api/save-selection', async (req, res) => {
    try {
        const { name, image, suggestions } = req.body;

        // Load history
        const history = await loadHistory();

        // Add new entry
        history.push({
            name,
            image,
            date: new Date().toISOString()
        });

        // Save history
        await saveHistory(history);

        // Update preferences
        await updatePreferences(name, suggestions);

        res.json({ success: true });
    } catch (error) {
        console.error('Error in save-selection:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get history endpoint
app.get('/api/history', async (req, res) => {
    try {
        const history = await loadHistory();
        res.json({ success: true, history: history.reverse() }); // Most recent first
    } catch (error) {
        console.error('Error in history:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
async function startServer() {
    await initializeDataDir();

    app.listen(PORT, () => {
        console.log(`Dish Name Generator running on http://localhost:${PORT}`);
        console.log('No API key needed - using built-in name generation!');
    });
}

startServer();

const fs = require('fs');
const https = require('https');

const API_BASE = 'https://questions.aloc.com.ng/api/v2';
const SUBJECTS = ['english', 'mathematics', 'physics', 'chemistry', 'biology'];
const OUTPUT_FILE = 'src/lib/data.new.js'; // Write to a new file for safety
const QUESTIONS_PER_SUBJECT = 30; // Total questions to aim for

const token = process.argv[2];

if (!token) {
    console.error('Usage: node scripts/fetch_questions.js <YOUR_ACCESS_TOKEN>');
    process.exit(1);
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchBatchQuestions = (subject, limit = 5) => {
    return new Promise((resolve, reject) => {
        // Use the /m endpoint for batches
        const url = `${API_BASE}/m?subject=${subject}&limit=${limit}`;
        const options = {
            headers: {
                'AccessToken': token,
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (compatible; GiftedHands/1.0)'
            },
            timeout: 90000 // Increased timeout to 90s for slow batch response
        };

        const req = https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    console.log(`Failed with status ${res.statusCode}`);
                    resolve(null);
                    return;
                }
                try {
                    const json = JSON.parse(data);
                    // Handle if API returns array directly OR { data: [...] }
                    const questions = Array.isArray(json) ? json : (json.data || null);
                    resolve(questions);
                } catch (e) {
                    console.error(`Error parsing ${subject}:`, e.message);
                    resolve(null);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Network error for ${subject}: ${e.message}`);
            resolve(null);
        });

        req.on('timeout', () => {
            console.log(`Request timed out for ${subject}`);
            req.destroy();
            resolve(null);
        });
    });
};

(async () => {
    console.log('Fetching questions in batches of 5 (5x more efficient)...');

    // Load existing data if possible, or start fresh
    let questionsBySubject = {};

    // Try to load existing data from data.js (source of truth) or data.new.js to append
    const SOURCE_FILE = 'src/lib/data.js';
    if (fs.existsSync(SOURCE_FILE)) {
        try {
            const fileContent = fs.readFileSync(SOURCE_FILE, 'utf8');
            // Extract the JSON object string using regex
            const match = fileContent.match(/export const questionsBySubject = ({[\s\S]*?});/);
            if (match && match[1]) {
                questionsBySubject = JSON.parse(match[1]);
                console.log(`Loaded existing data from ${SOURCE_FILE}`);
            }
        } catch (e) {
            console.error('Error reading existing data:', e.message);
        }
    }

    // Ensure all subjects exist
    SUBJECTS.forEach(s => {
        if (!questionsBySubject[s]) questionsBySubject[s] = {};
    });

    const BATCH_SIZE = 5;
    const ITERATIONS = Math.ceil(QUESTIONS_PER_SUBJECT / BATCH_SIZE);

    for (const subject of SUBJECTS) {
        console.log(`\nStarting ${subject}...`);

        for (let i = 0; i < ITERATIONS; i++) {
            process.stdout.write(`  Fetching Batch ${i + 1}/${ITERATIONS}... `);
            const questions = await fetchBatchQuestions(subject, BATCH_SIZE);

            if (questions && Array.isArray(questions)) {

                let addedCount = 0;

                questions.forEach(q => {
                    // Determine exam type (WAEC, UTME, etc.) - default to 'General' if missing
                    const examType = (q.examtype || 'General').toUpperCase();

                    // Initialize array for this exam type if not exists
                    if (!questionsBySubject[subject][examType]) {
                        questionsBySubject[subject][examType] = [];
                    }

                    const existing = questionsBySubject[subject][examType];

                    // Create standardized question object
                    const newQ = {
                        id: q.id || `${subject.substring(0, 2)}${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
                        question: q.question,
                        options: Object.values(q.option),
                        correctAnswer: ['a', 'b', 'c', 'd'].indexOf(q.answer) !== -1 ? ['a', 'b', 'c', 'd'].indexOf(q.answer) : 0,
                        explanation: q.solution || '',
                        image: q.image || '',
                        section: q.section || '',
                        examType: examType,
                        examYear: q.examyear || ''
                    };

                    // Deduplicate based on ID
                    if (!existing.find(ex => ex.id === newQ.id)) {
                        existing.push(newQ);
                        addedCount++;
                    }
                });

                console.log(`OK (Added ${addedCount} new)`);
            } else {
                console.log('Failed/Empty (Skipping)');
            }
            await wait(2000); // 2s delay between batches to be polite
        }

        // Log stats for this subject
        console.log(`  Stats for ${subject}:`);
        Object.keys(questionsBySubject[subject]).forEach(type => {
            console.log(`    - ${type}: ${questionsBySubject[subject][type].length} questions`);
        });
    }

    // Generate the file content
    const fileContent = `
export const subjects = [
  { id: 'mathematics', name: 'Mathematics', icon: '🔢', color: '#2563eb' },
  { id: 'english', name: 'English Language', icon: '📝', color: '#3b82f6' },
  { id: 'physics', name: 'Physics', icon: '⚛️', color: '#1d4ed8' },
  { id: 'chemistry', name: 'Chemistry', icon: '🧪', color: '#2563eb' },
  { id: 'biology', name: 'Biology', icon: '🧬', color: '#3b82f6' },
];

export const questionsBySubject = ${JSON.stringify(questionsBySubject, null, 2)};
  `;

    fs.writeFileSync(OUTPUT_FILE, fileContent);
    console.log(`\nDone! Saved ${Object.keys(questionsBySubject).length} subjects to ${OUTPUT_FILE}`);
})();

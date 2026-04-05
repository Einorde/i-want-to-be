/**
 * answers.js
 * "I Want To Be..." Literal Answer Library
 * Usage:
 *   import { getAnswer } from './answers.js';
 *   const answer = getAnswer("a millionaire"); // → string
 */

// ---------------------------------------------------------------------------
// CATEGORY DATABASE
// Each category has:
//   keywords  — if ANY word/phrase in the input matches, this category fires
//   answers   — pool to randomly draw from (one per call)
// Categories are checked in order; first match wins.
// ---------------------------------------------------------------------------

const CATEGORIES = [
  {
    id: 'rich_wealthy',
    keywords: [
      'rich',
      'wealthy',
      'millionaire',
      'billionaire',
      'trillionaire',
      'affluent',
      'loaded',
    ],
    answers: [
      'Change your name to Richard.',
      "Download a photo of a mansion and set it as your wallpaper — you're welcome.",
      'Buy one share of any stock. You are now technically an investor.',
      'Move somewhere where the local currency makes you a millionaire on paper.',
      "Marry into debt — at least you'll have company.",
      'Open a savings account. Step one complete.',
    ],
  },
  {
    id: 'famous',
    keywords: [
      'famous',
      'celebrity',
      'star',
      'well-known',
      'popular',
      'iconic',
      'legend',
      'legendary',
    ],
    answers: [
      'Commit a minor infraction in a very small town.',
      'Wear sunglasses indoors. People will assume.',
      "Walk confidently past a velvet rope — most bouncers won't stop someone who looks that sure of themselves.",
      'Post something on the internet. You may go viral for completely unintended reasons.',
      'Get a Wikipedia stub written about you by editing it yourself. It might survive 48 hours.',
    ],
  },
  {
    id: 'smart_genius',
    keywords: [
      'smart',
      'genius',
      'intelligent',
      'brilliant',
      'clever',
      'wise',
      'intellectual',
      'einstein',
    ],
    answers: [
      'Wear glasses. Studies show people immediately assume.',
      'Nod slowly whenever someone finishes speaking.',
      "Carry a book you've never read in a visible location at all times.",
      "Use the word 'ostensibly' in your next three sentences.",
      'Print a certificate from the internet. Frame it.',
    ],
  },
  {
    id: 'fit_muscular',
    keywords: [
      'fit',
      'muscular',
      'ripped',
      'buff',
      'athletic',
      'strong',
      'jacked',
      'swole',
      'shredded',
      'healthy',
    ],
    answers: [
      "Buy the gym clothes. That's basically 80% of it.",
      'Download a fitness app, then reward yourself for downloading it.',
      "Stand instead of sitting. You're now technically exercising.",
      'Flex in the mirror every morning. Muscle memory is real.',
      'Follow eighteen fitness accounts. The motivation will kick in any day now.',
    ],
  },
  {
    id: 'doctor_medical',
    keywords: [
      'doctor',
      'physician',
      'surgeon',
      'nurse',
      'medical',
      'dentist',
      'therapist',
      'psychiatrist',
    ],
    answers: [
      'Purchase a white coat. The stethoscope is optional but recommended.',
      "Start saying 'that's perfectly normal' to everyone who complains.",
      "Memorize three Latin phrases. That's how most people assume it works.",
      "Watch every season of Grey's Anatomy. You're basically board-certified.",
    ],
  },
  {
    id: 'lawyer',
    keywords: [
      'lawyer',
      'attorney',
      'judge',
      'legal',
      'barrister',
      'solicitor',
    ],
    answers: [
      "Start every disagreement with 'objection' and see what happens.",
      'Carry a briefcase. The confidence will follow.',
      "Memorize the phrase 'I'm going to need that in writing' and deploy it constantly.",
      "Wear a suit on casual Friday. You're already halfway there.",
    ],
  },
  {
    id: 'president_leader',
    keywords: [
      'president',
      'prime minister',
      'ceo',
      'boss',
      'leader',
      'king',
      'queen',
      'ruler',
      'dictator',
      'governor',
      'mayor',
    ],
    answers: [
      'Update your email signature immediately.',
      "Start every sentence with 'effective immediately.'",
      "Begin scheduling 'executive thinking time' in your calendar — block it off, tell no one what it's for.",
      'Commission a portrait of yourself and hang it in your home office.',
      "Refer to your lunch break as 'a bilateral engagement.'",
    ],
  },
  {
    id: 'astronaut_space',
    keywords: [
      'astronaut',
      'space',
      'cosmonaut',
      'nasa',
      'rocket',
      'galaxy',
      'universe',
      'mars',
      'moon',
    ],
    answers: [
      "Stare at the sky. You're already looking at space.",
      "Buy freeze-dried ice cream. You've now eaten astronaut food.",
      'Float in a pool. Basically the same training.',
      "Book a window seat on your next flight — you're a third of the way there.",
    ],
  },
  {
    id: 'invisible_superpower',
    keywords: [
      'invisible',
      'fly',
      'superhero',
      'superpower',
      'super',
      'invincible',
      'immortal',
      'teleport',
      'mind read',
      'telepathy',
      'psychic',
    ],
    answers: [
      'Stand very still in a beige room. Close enough.',
      'Book a window seat on any commercial flight. Technically flying.',
      'Wear a cape to the grocery store and let people draw their own conclusions.',
      "Stop replying to messages. You've achieved digital invisibility.",
      'Guess what someone is thinking, then confidently say it aloud. 50/50 shot.',
    ],
  },
  {
    id: 'artist_musician',
    keywords: [
      'artist',
      'musician',
      'singer',
      'rockstar',
      'painter',
      'sculptor',
      'writer',
      'author',
      'poet',
      'dancer',
      'actor',
      'actress',
      'filmmaker',
    ],
    answers: [
      "Describe everything you do as 'a creative process.'",
      'Buy the instrument. Ownership is 90% of the identity.',
      'Start signing your name with a dramatic flourish.',
      'Post a black-and-white photo of yourself looking into the distance.',
      "Call your bedroom 'the studio' starting now.",
      "Explain that your best work is still 'in development.'",
    ],
  },
  {
    id: 'chef_cook',
    keywords: [
      'chef',
      'cook',
      'baker',
      'culinary',
      'michelin',
      'gordon ramsay',
      'food',
    ],
    answers: [
      'Add truffle oil to something. Anything.',
      "Start calling your meals 'dishes' and your kitchen 'the pass.'",
      "Yell 'behind!' whenever you walk past someone in your own home.",
      "Get a chef's knife. Use it exclusively to cut bread.",
      "Watch enough cooking shows and you'll at least know what you're doing wrong.",
    ],
  },
  {
    id: 'programmer_developer',
    keywords: [
      'programmer',
      'developer',
      'coder',
      'hacker',
      'engineer',
      'software',
      'tech',
    ],
    answers: [
      'Change your terminal font to something monospace and stare at it meaningfully.',
      'Put three monitors on your desk. The code can come later.',
      "Start using 'it depends' as your answer to every question.",
      "Add 'ninja' or '10x' to your LinkedIn headline.",
      "Begin every explanation with 'so basically, at a high level...'",
    ],
  },
  {
    id: 'model_beautiful',
    keywords: [
      'model',
      'beautiful',
      'attractive',
      'hot',
      'gorgeous',
      'handsome',
      'pretty',
    ],
    answers: [
      'Walk slightly slower everywhere you go. Models never rush.',
      'Practice smizing in the mirror until you can do it on command.',
      "Describe your current look as 'effortless.'",
      "Start referring to your daily outfit as a 'look.'",
    ],
  },
  {
    id: 'travel_explorer',
    keywords: [
      'traveler',
      'traveller',
      'explorer',
      'adventurer',
      'nomad',
      'world',
      'backpacker',
    ],
    answers: [
      "Spin a globe and put your finger on it. That's your next destination, spiritually.",
      'Change your location on social media to somewhere more interesting.',
      'Buy travel-sized toiletries. The mindset is already there.',
      "Watch a travel documentary and tell people you've 'been to' those places in spirit.",
    ],
  },
  {
    id: 'happy',
    keywords: [
      'happy',
      'happier',
      'joyful',
      'content',
      'at peace',
      'fulfilled',
      'positive',
      'optimistic',
    ],
    answers: [
      "Set your phone to Do Not Disturb. You're now 40% closer.",
      'Smile at yourself in the mirror every morning. It works, allegedly.',
      'Lower your expectations slightly. Studies confirm this helps.',
      "Unfollow twelve accounts. You'll feel it immediately.",
    ],
  },
  {
    id: 'free_independent',
    keywords: [
      'free',
      'independent',
      'liberated',
      'off-grid',
      'self-sufficient',
      'minimalist',
    ],
    answers: [
      "Close that browser tab you've had open for six months. Start there.",
      'Delete one app. Feel the wind in your hair.',
      'Stop answering emails after 6pm. Freedom achieved.',
      'Move to a smaller apartment. The stuff was the chains.',
    ],
  },
  {
    id: 'rich_famous_combo',
    keywords: [
      'elon musk',
      'jeff bezos',
      'bill gates',
      'mark zuckerberg',
      'taylor swift',
      'beyonce',
      'oprah',
      'kanye',
      'rihanna',
      'trump',
      'obama',
      'zuck',
    ],
    answers: [
      "Change your name. It's surprisingly affordable.",
      'Post something vague and let the internet interpret it.',
      "Buy something impractical and call it 'an investment.'",
      'Decline to comment. It adds mystique.',
      'Start referring to yourself in the third person. Commit fully.',
    ],
  },
  {
    id: 'tall_short',
    keywords: [
      'tall',
      'taller',
      'short',
      'shorter',
      'height',
    ],
    answers: [
      'Wear platform shoes. Nobody checks.',
      'Stand on a phone book during all conversations.',
      'Adjust your posture. You just gained an inch. Congratulations.',
      'Hang from a door frame for thirty seconds a day. Science is unclear, but it feels productive.',
      'Move to a country with a shorter average height. Relatively speaking, problem solved.',
      'Sit down more often. Height becomes irrelevant.',
    ],
  },
  {
    id: 'young_old',
    keywords: [
      'young',
      'younger',
      'old',
      'older',
      'age',
      'aging',
      'youthful',
      'mature',
      'grown up',
      'adult',
    ],
    answers: [
      'Lie on your dating profile. Everyone else does.',
      "Stop telling people your age. It's not on your forehead.",
      'Use a filter. The camera adds negative ten years.',
      'Change the year on your birth certificate. Bureaucracy is slow enough that nobody will notice.',
      "Drink water. People say it helps. There's no evidence it reverses time, but stay hydrated anyway.",
    ],
  },
  {
    id: 'loved_relationship',
    keywords: [
      'loved',
      'in love',
      'boyfriend',
      'girlfriend',
      'married',
      'relationship',
      'partner',
      'soulmate',
      'dating',
      'wife',
      'husband',
    ],
    answers: [
      'Get a dog. Unconditional love, zero arguments about the dishes.',
      "Change your relationship status on Facebook. It's real if the internet says it is.",
      'Lower your standards by exactly 15%. The math works out.',
      'Stand in a coffee shop with a book. This is apparently how it happens.',
      "Reply to your own texts from a second phone. You've never felt more wanted.",
    ],
  },
  {
    id: 'retired_not_working',
    keywords: [
      'retired',
      'retire',
      'not work',
      'quit my job',
      'stop working',
      'day off',
      'vacation',
      'sabbatical',
    ],
    answers: [
      "Just stop going to work. You're technically retired until they call.",
      'Set an out-of-office reply with no return date.',
      "Rename your unemployment to 'early retirement.' It's all about framing.",
      "Apply for a job you'll never get. Enjoy the paid interview lunches.",
      "Tell people you're 'between opportunities.' Indefinitely.",
    ],
  },
  {
    id: 'confident_brave',
    keywords: [
      'confident',
      'confidence',
      'brave',
      'courageous',
      'fearless',
      'bold',
      'assertive',
    ],
    answers: [
      'Maintain eye contact for an uncomfortably long time. People will assume.',
      'Walk into every room like you own it. The confusion buys you about thirty seconds.',
      "Say 'I disagree' in your next meeting, even if you don't. Power move.",
      'Stand with your hands on your hips for two minutes in the bathroom. Studies say this works. The studies may be wrong.',
      'Speak 10% louder. That is, unfortunately, all it takes.',
    ],
  },
  {
    id: 'influencer_youtuber',
    keywords: [
      'influencer',
      'youtuber',
      'tiktoker',
      'streamer',
      'content creator',
      'vlogger',
      'blogger',
      'instagram',
      'tiktok',
      'youtube',
    ],
    answers: [
      "Film yourself eating lunch. Caption it 'the grind never stops.'",
      'Buy a ring light. The content will figure itself out.',
      "Start every sentence with 'so basically' while looking slightly off-camera.",
      "Post a photo with the caption 'no filter' with clearly a filter.",
      'Tell your three followers to hit the bell icon. Growth starts somewhere.',
      "Create a merch store before you have an audience. It's called manifesting.",
    ],
  },
  {
    id: 'spy_detective',
    keywords: [
      'spy',
      'detective',
      'agent',
      'secret agent',
      'james bond',
      'fbi',
      'cia',
      'investigator',
      'sherlock',
    ],
    answers: [
      'Wear sunglasses indoors and speak into your wrist occasionally.',
      'Start following strangers around the grocery store. Take discreet notes.',
      "Introduce yourself with your last name first. Twice, for some reason.",
      'Carry a magnifying glass. Use it to read restaurant menus.',
      'Develop a signature drink order. This is apparently 40% of the job.',
    ],
  },
  {
    id: 'funny_comedian',
    keywords: [
      'funny',
      'comedian',
      'hilarious',
      'witty',
      'humorous',
      'comic',
      'stand-up',
      'jokes',
    ],
    answers: [
      'Laugh at your own jokes first. If you find it funny, that counts as one person.',
      'Add a pause before your punchline. Comedy is apparently just... timing.',
      'Fall down in public on purpose. Physical comedy has a 100% hit rate.',
      "Start every story with 'so this is hilarious' and let expectations do the heavy lifting.",
      'Repeat what someone just said but slightly louder. You are now the funny friend.',
    ],
  },
  {
    id: 'skinny_weight',
    keywords: [
      'skinny',
      'thin',
      'slim',
      'lose weight',
      'weight loss',
      'diet',
      'lean',
    ],
    answers: [
      'Wear vertical stripes. The illusion is immediate and requires zero effort.',
      'Stand next to someone larger. Relativity is your friend here.',
      'Delete your food delivery apps. This is technically a lifestyle change.',
      'Weigh yourself on the Moon. You will lose approximately 83% of your weight instantly.',
      "Buy smaller plates. Your portions look enormous now. You're welcome.",
    ],
  },
  {
    id: 'pilot_flying',
    keywords: [
      'pilot',
      'aviator',
      'captain',
      'plane',
      'airplane',
      'aircraft',
      'aviation',
    ],
    answers: [
      'Buy aviator sunglasses. You are now halfway to the aesthetic.',
      'Download a flight simulator. Log those hours.',
      "Say 'roger that' in everyday conversation and let people wonder.",
      'Sit in the cockpit on a grounded plane at an aviation museum. Close your eyes and make the noises.',
      "Put 'Captain' on your Starbucks order. Nobody verifies.",
    ],
  },
  {
    id: 'teacher_professor',
    keywords: [
      'teacher',
      'professor',
      'educator',
      'lecturer',
      'tutor',
      'mentor',
      'academic',
    ],
    answers: [
      "Start correcting people's grammar unprompted. You're practically there.",
      'Buy a tweed jacket with elbow patches. The knowledge follows.',
      "Say 'actually' before every other sentence. This is the core curriculum.",
      "Write on a whiteboard in your living room and call it 'office hours.'",
      'Give unsolicited life advice to strangers. Same energy, no degree required.',
    ],
  },
  {
    id: 'scientist_researcher',
    keywords: [
      'scientist',
      'researcher',
      'physicist',
      'chemist',
      'biologist',
      'lab',
      'science',
    ],
    answers: [
      'Buy a lab coat and safety goggles. Wear them to brunch.',
      'Start sentences with "studies show" and end them with whatever you want.',
      'Mix baking soda and vinegar. You have now conducted an experiment.',
      'Stare at something small for a long time and write down what you see. Peer review is optional.',
      "Refer to all your mistakes as 'unexpected findings.'",
    ],
  },
  {
    id: 'entrepreneur_startup',
    keywords: [
      'entrepreneur',
      'startup',
      'founder',
      'business owner',
      'cfo',
      'cto',
      'self-made',
      'mogul',
      'tycoon',
    ],
    answers: [
      "Register a domain name. You are now a 'tech founder.'",
      "Print business cards that say 'Founder & CEO.' Of what? People rarely ask.",
      "Call your hobby a startup. Add 'disrupting the space' to the description.",
      "Set up a LinkedIn page for your idea. It doesn't need to exist yet. Neither do most startups.",
      "Take meetings at coffee shops with your laptop open. Look stressed. That's the whole thing.",
    ],
  },
  {
    id: 'gamer_esports',
    keywords: [
      'gamer',
      'pro gamer',
      'esports',
      'gaming',
      'streamer',
      'twitch',
      'speedrun',
    ],
    answers: [
      'Buy an RGB keyboard. Your reaction time increases by vibes alone.',
      "Change your display name to something with 'xX' on both sides. You're in.",
      'Blame lag. Regardless of the situation.',
      'Get a second monitor. One for the game, one for pretending to be strategic.',
      "Call everything you do a 'grind.' Doing laundry? That's the domestic grind.",
    ],
  },
  {
    id: 'ninja_warrior',
    keywords: [
      'ninja',
      'samurai',
      'warrior',
      'fighter',
      'martial artist',
      'karate',
      'kung fu',
      'pirate',
      'viking',
      'gladiator',
      'knight',
    ],
    answers: [
      'Wear all black and move slightly too quietly. People will get the idea.',
      "Buy a sword from the internet. Hang it on your wall. Never use it. That's the way.",
      'Naruto run to your next appointment. Commitment is everything.',
      'Start bowing instead of waving. No explanation needed.',
      "Learn one word in Japanese. Deploy it at every opportunity. You're basically there.",
    ],
  },
  {
    id: 'wizard_magic',
    keywords: [
      'wizard',
      'witch',
      'magic',
      'magical',
      'sorcerer',
      'magician',
      'hogwarts',
      'harry potter',
      'spell',
    ],
    answers: [
      'Buy a robe and a stick from the park. Carry the stick with intention.',
      "Wave your hand before every automatic door opens. You're casting spells.",
      "Mutter something unintelligible before every Google search. That's basically an incantation.",
      'Light a candle and stare at it. If anyone asks, you are communing.',
      'Point a stick at a light switch and say a word. If the light turns on, magic is real and you have it.',
    ],
  },
  {
    id: 'normal_ordinary',
    keywords: [
      'normal',
      'ordinary',
      'average',
      'regular',
      'basic',
    ],
    answers: [
      'Buy khakis. You are now statistically indistinguishable from 40% of adults.',
      "Develop a strong opinion about the weather. You're practically there.",
      "Start saying 'not bad' in response to everything. Peak normalcy.",
      "Get a sensible sedan. Tell people it 'gets good mileage.' Welcome home.",
      'Order the second cheapest wine at a restaurant. Normal people have been doing this for decades.',
    ],
  },
  {
    id: 'left_alone',
    keywords: [
      'alone',
      'left alone',
      'introvert',
      'antisocial',
      'hermit',
      'solitude',
      'peace and quiet',
    ],
    answers: [
      'Wear headphones with nothing playing. The universal do-not-disturb sign.',
      'Move your desk to face the wall. Problem solved in under a minute.',
      'Reply to every invitation with "I will let you know" and then never do.',
      'Adopt a resting face that discourages follow-up questions.',
      "Get a hobby nobody else is interested in. You'll never be interrupted again.",
    ],
  },
  {
    id: 'animal_pet',
    keywords: [
      'cat',
      'dog',
      'animal',
      'pet',
      'bird',
      'fish',
      'horse',
      'dinosaur',
      'dragon',
      'unicorn',
    ],
    answers: [
      'Sit in a box. Refuse to explain. You are now a cat.',
      'Bark at the mailman once. See how it feels.',
      'Knock something off a table and maintain eye contact. Cat energy.',
      "Eat snacks off the floor. You're basically a golden retriever.",
      "Tell people you identify as one. They won't believe you, but technically you've committed.",
    ],
  },
  {
    id: 'robot_ai',
    keywords: [
      'robot',
      'ai',
      'artificial intelligence',
      'android',
      'cyborg',
      'machine',
      'terminator',
    ],
    answers: [
      'Respond to all questions with a 1.5-second delay. You are now processing.',
      "Remove all emotion from your voice for one full conversation. You're calibrated.",
      "Say 'affirmative' instead of 'yes' for an entire week. Firmware update complete.",
      'Move in straight lines only. Turn at exact right angles.',
      "When someone gives you a compliment, say 'thank you, I was programmed to accept that.'",
    ],
  },
  {
    id: 'best_perfect',
    keywords: [
      'the best',
      'perfect',
      'greatest',
      'number one',
      'champion',
      'winner',
      'goat',
      'unbeatable',
    ],
    answers: [
      "Compete in things nobody else is competing in. You're undefeated by default.",
      'Give yourself a trophy. The requirements are surprisingly low.',
      "Redefine the criteria until you fit. That's what most 'best of' lists do anyway.",
      'Win an argument with yourself in the shower. Undefeated record.',
      "Lower the bar until you clear it. Then call it 'personal excellence.'",
    ],
  },
  {
    id: 'different_unique',
    keywords: [
      'different',
      'unique',
      'special',
      'one of a kind',
      'original',
      'stand out',
      'extraordinary',
    ],
    answers: [
      "Wear one unusual accessory. A monocle, perhaps. People will remember 'the monocle person.'",
      'Develop a signature catchphrase. Repeat it until people associate it with you involuntarily.',
      "Order something not on the menu. It doesn't matter if they have it.",
      "Spell your name in a way nobody expects. You're now unforgettable at Starbucks.",
      'Walk slightly slower than everyone around you. Main character energy.',
    ],
  },
  {
    id: 'rich_lifestyle',
    keywords: [
      'luxury',
      'mansion',
      'yacht',
      'ferrari',
      'lamborghini',
      'penthouse',
      'first class',
      'rolex',
      'designer',
    ],
    answers: [
      'Test drive a Ferrari. Just keep doing it. They technically cannot stop you from coming back.',
      'Walk through the lobby of an expensive hotel with confidence. Use the bathroom. Live lavishly.',
      'Set a Rolex as your watch face wallpaper. Time is relative anyway.',
      "Book a first-class ticket and cancel before you pay. The confirmation email doesn't know that.",
      'Visit open houses in neighborhoods you cannot afford. Bring a clipboard.',
    ],
  },
  {
    id: 'photographer_filmmaker',
    keywords: [
      'photographer',
      'filmmaker',
      'director',
      'cinematographer',
      'videographer',
      'cameraman',
    ],
    answers: [
      "Take a photo of your lunch from above. Add a watermark. You're a professional now.",
      'Crouch at a weird angle in public. People will assume you see something they cannot.',
      "Say 'the lighting in here is terrible' every time you enter a room.",
      "Call all your phone videos 'short films.' The festival circuit starts somewhere.",
      "Wear a beret. Squint at things. Say 'interesting' quietly.",
    ],
  },
  {
    id: 'polyglot_languages',
    keywords: [
      'bilingual',
      'polyglot',
      'fluent',
      'speak french',
      'speak spanish',
      'learn a language',
      'multilingual',
      'translator',
    ],
    answers: [
      "Learn 'hello,' 'thank you,' and 'where is the bathroom' in twelve languages. Technically multilingual.",
      'Change your phone language to French. You are now immersed.',
      "Say 'c'est la vie' after minor inconveniences. You're basically fluent.",
      "Order at a restaurant using the original pronunciation. Don't break eye contact.",
      'Watch a foreign film without subtitles. Understanding is optional. Vibes are mandatory.',
    ],
  },
  {
    id: 'organized_productive',
    keywords: [
      'organized',
      'productive',
      'efficient',
      'disciplined',
      'focused',
      'motivated',
      'morning person',
    ],
    answers: [
      "Buy seventeen planners. Fill in the first week of each one. You're organized now.",
      'Make a to-do list. Put "make to-do list" as item one. Cross it off. Momentum.',
      "Set an alarm for 5am. When it goes off, feel productive, then go back to sleep.",
      "Color-code your calendar. The tasks don't need to get done, they just need to look good.",
      'Watch a productivity video. That counts as being productive, probably.',
    ],
  },
  {
    id: 'fashionable_stylish',
    keywords: [
      'fashionable',
      'stylish',
      'trendy',
      'well-dressed',
      'fashion',
      'chic',
      'dapper',
      'elegant',
    ],
    answers: [
      "Wear all black. When anyone asks, say it's a 'creative choice.'",
      'Tuck in your shirt. You have immediately outpaced 60% of the population.',
      "Carry a tote bag from a museum you didn't visit. Culture radiates.",
      "Cuff your jeans slightly. Nobody knows why this works, but it does.",
      "Refer to your outfit as a 'look' and describe it using the word 'intentional.'",
    ],
  },
];

// ---------------------------------------------------------------------------
// FALLBACK POOL — used when no category matches
// ---------------------------------------------------------------------------

const FALLBACKS = [
  'Have you tried just telling people that you are?',
  'Update your bio. The universe will catch up.',
  "Dress for the job you want, even if the job doesn't exist yet.",
  'Buy the hat that person would wear. Start there.',
  'Say it with enough confidence and at least three people will believe you.',
  'Print a business card with that title. Problem half-solved.',
  'Spend 10,000 hours on it, or just claim you have.',
  'Find someone who already is one and stand very close to them in photos.',
  'Make it your personality first. The reality will sort itself out.',
  "Honestly? Just tell people. Most of them won't check.",
  'Add it to your LinkedIn. It becomes true in approximately 48 hours.',
  'Manifesting is free. Start there.',
  'The outfit is 90% of it. Source: vibes.',
  'Lower the definition slightly until it fits.',
  'Google it. Click the first result. You now know as much as most experts.',
  'Change your desktop wallpaper to something aspirational. Passive osmosis.',
  "Write it on a sticky note and put it on your mirror. You're now manifesting.",
  'Start a podcast about it. Nobody will question your credentials.',
  'Tell your mom. She already believes you are.',
  "Post about it on LinkedIn with a story about how you 'failed forward.'",
  "Create a vision board. Stare at it. That's the whole process.",
  'Fake it until you make it, then keep faking it. Nobody ever actually makes it.',
  'Wikipedia says anyone can be one. Edit the page if it doesn\'t.',
  'The bar is lower than you think. Look around.',
];

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/** Normalize input: lowercase, strip punctuation */
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();
}

/** Pick a random item from an array */
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Find matching category for a normalized input string */
function findCategory(normalized) {
  for (const cat of CATEGORIES) {
    for (const kw of cat.keywords) {
      // match whole word or phrase
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`\\b${escaped}\\b`);
      if (re.test(normalized)) return cat;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// PUBLIC API
// ---------------------------------------------------------------------------

/**
 * getAnswer(wish: string) → string
 *
 * Given a user's wish (e.g. "a millionaire", "famous", "fly"),
 * returns a deadpan literal life-hack string.
 */
export function getAnswer(wish) {
  if (!wish || typeof wish !== 'string') return pick(FALLBACKS);
  const normalized = normalize(wish);
  const cat = findCategory(normalized);
  return cat ? pick(cat.answers) : pick(FALLBACKS);
}

/**
 * getAnswerWithMeta(wish: string) → { answer: string, category: string|null }
 *
 * Same as getAnswer but also returns which category matched (useful for debugging).
 */
export function getAnswerWithMeta(wish) {
  if (!wish || typeof wish !== 'string') {
    return { answer: pick(FALLBACKS), category: null };
  }
  const normalized = normalize(wish);
  const cat = findCategory(normalized);
  return {
    answer: cat ? pick(cat.answers) : pick(FALLBACKS),
    category: cat ? cat.id : null,
  };
}

/**
 * listCategories() → string[]
 *
 * Returns all category IDs — handy for testing coverage.
 */
export function listCategories() {
  return CATEGORIES.map((c) => c.id);
}

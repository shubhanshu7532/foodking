/**
 * Unique Username Generator
 * @module utils/username.util
 * @category utils
 * @subcategory username
 * 
 * This file exports two functions: `uniqueUsernameGenerator` and `isUsernameUnique`.
 * `uniqueUsernameGenerator` generates a unique username by combining random words and a random 4-digit number.
 * It ensures that the generated username is not already taken by any user in the database.
 * `isUsernameUnique` checks if a given username is unique by querying the database.
 */

import db from "../models";
// import { logger } from "../app.js";
import logger from "./logger.util.js"

const { User } = db;

/**
 * Generate a unique username that is not taken by any user in the database.
 * @returns {Promise<string>} The unique username.
 * @throws {Error} If an error occurs during the username generation process.
 * @example
 * const username = await uniqueUsernameGenerator();
 * console.log(username); // "gamingplayer1234"
 */
export const uniqueUsernameGenerator = async () => {
    try {
        // array of random words. Gaming words for this project.
        const words = [
            'gaming', 'sports', 'competition', 'team', 'player', 'tournament', 'esports',
            'controller', 'gamepad', 'console', 'PC', 'online', 'offline', 'multiplayer',
            'single', 'player', 'RPG', 'MMORPG', 'FPS', 'MOBA', 'strategy', 'adventure',
            'action', 'shooter', 'racing', 'platformer', 'simulation', 'roleplay', 'fighting',
            'sportsmanship', 'victory', 'achievement', 'skill', 'tactics', 'league',
            'championship', 'world', 'champion', 'fan', 'stadium', 'arena', 'ball', 'field',
            'court', 'teamwork', 'athletics', 'fitness', 'exercise', 'workout', 'training',
            'athlete', 'coach', 'referee', 'match', 'game', 'play', 'event', 'equipment',
            'gear', 'jersey', 'uniform', 'bat', 'glove', 'helmet', 'shoes', 'cleats', 'racket',
            'net', 'season', 'medal', 'podium', 'record', 'speed', 'strength', 'endurance',
            'win', 'scoreboard', 'spectator', 'crowd', 'cheer', 'sportsmanship', 'fairness',
            'passion', 'practice', 'dedication', 'victory', 'teamwork', 'discipline',
            'perseverance', 'healthy', 'competition', 'performance', 'skill', 'talent',
            'sportsman', 'athleticism', 'athlete', 'champion', 'fitness', 'exercise', 'workout',
            'coach', 'training', 'determination', 'motivation', 'inspiration', 'fans',
            'supporters', 'stadium', 'arena', 'field', 'court', 'track', 'pitch', 'rink', 'pool',
            'gym', 'weightlifting', 'soccer', 'football', 'basketball', 'tennis', 'baseball',
            'golf', 'hockey', 'volleyball', 'rugby', 'cricket', 'swimming', 'running', 'cycling',
            'boxing', 'skating', 'surfing', 'skiing', 'snowboarding', 'wrestling', 'karate',
            'martial', 'arts', 'energy', 'enthusiasm', 'passionate', 'positive', 'uplifting',
            'joy', 'celebration', 'progress', 'success', 'excellence', 'vibrant', 'thrilling',
            'vitality', 'dynamic', 'empowering', 'inspiring', 'resilience', 'perseverance',
            'victory', 'achievement', 'passion', 'determination', 'dedication', 'ambition',
            'growth', 'mastery', 'transform', 'champion', 'brave', 'strong', 'adventure',
            'explore', 'create', 'innovate', 'challenge', 'fun', 'elevate', 'winning',
            'motivate', 'entertain', 'optimism', 'unity', 'friendship', 'together', 'kindness',
            'encourage', 'support', 'dream', 'inspire', 'courage', 'triumph', 'noble', 'grace',
            'vitality', 'glory', 'vigor', 'exhilarate', 'success', 'thrive', 'vibrant',
            'dazzle', 'excellent', 'spectacular', 'joyful', 'bliss', 'cheerful', 'radiant',
            'upbeat', 'vibrant', 'dynamic', 'extraordinary', 'adrenaline', 'epic', 'legendary',
            'fabulous', 'marvelous', 'awesome', 'fantastic', 'wonderful', 'superb', 'brilliant',
            'amazing', 'remarkable', 'inspiring', 'fascinating', 'electrifying', 'stunning',
            'exciting', 'breathtaking', 'thrilling', 'sensational', 'astonishing', 'phenomenal',
            'incredible', 'unforgettable', 'exhilarating', 'memorable', 'unbeatable', 'unstoppable',
            'unreal', 'unbelievable', 'limitless', 'awe', 'inspiring', 'mighty', 'strong', 'invincible',
            'powerful', 'victorious', 'unshakable', 'dominant', 'supreme', 'triumphant',
            'fierce', 'challenging', 'unyielding', 'unwavering', 'unbreakable', 'undaunted',
            'tenacious', 'undaunted', 'dynamic', 'exceptional', 'unparalleled', 'outstanding',
            'unmatched', 'unrivaled', 'masterful', 'impressive', 'formidable', 'inspirational',
            'encouraging', 'motivating', 'uplifting', 'uplifting', 'positive', 'uplifting',
            'encouraging', 'supportive', 'heartwarming', 'invigorating', 'affirming',
            'empowering', 'inspirational', 'uplifting', 'positive', 'motivating',
            'encouraging', 'energizing', 'inspiring', 'optimistic', 'triumphant', 'successful',
            'vibrant', 'dynamic', 'exhilarating', 'joyful', 'celebratory', 'passionate',
            'enthusiastic', 'driven', 'dedicated', 'tenacious', 'resilient', 'ambitious',
            'goal', 'oriented', 'persistent', 'focused', 'disciplined', 'determined',
            'motivated', 'passionate', 'committed', 'driven', 'ambitious', 'inspired',
            'empowered', 'confident', 'courageous', 'fearless', 'brave', 'strong', 'bold',
            'fierce', 'persistent', 'dedicated', 'tenacious', 'resilient', 'vibrant',
            'energetic', 'dynamic', 'talented', 'skilled', 'gifted', 'creative', 'ingenious',
            'innovative', 'imaginative', 'visionary', 'resourceful', 'excellent', 'superior',
            'stellar', 'remarkable', 'exceptional', 'outstanding', 'extraordinary', 'unforgettable',
            'marvelous', 'astonishing', 'awe', 'inspiring', 'incredible', 'unbelievable',
            'phenomenal', 'awe', 'inspiring', 'unreal', 'spectacular', 'fantastic', 'wonderful',
            'amazing', 'breathtaking', 'thrilling', 'sensational', 'stunning', 'impressive',
            'fabulous', 'mind', 'blowing', 'jaw', 'dropping', 'captivating', 'electrifying',
            'mesmerizing', 'inspiring', 'encouraging', 'motivating', 'uplifting', 'positive',
            'heartwarming', 'supportive', 'cheerful', 'optimistic', 'exhilarating',
            'inspirational', 'empowering', 'invigorating', 'unstoppable', 'unbeatable',
            'unyielding', 'unshakable', 'unbreakable', 'undaunted', 'relentless',
            'tenacious', 'invincible', 'dominant', 'triumphant', 'mighty', 'supreme'
        ];

        let username = "";
        let unique = false;

        // In the loop, call until a unique username is found
        while (!unique) {
            // Get two random words from the array
            const randomIndex1 = Math.floor(Math.random() * words.length);
            const randomIndex2 = Math.floor(Math.random() * words.length);
            const word1 = words[randomIndex1];
            // const word2 = words[randomIndex2];

            // Concatenate the two words and remove any non-alphanumeric characters
            // const combinedWords = (word1 + word2).toLowerCase()
            const combinedWords = word1.toLowerCase() // using only one word for now

            // Generate a random 4-digit number
            const randomNumber = Math.floor(1000 + Math.random() * 9000);

            // Combine the combined words and the random number
            username = combinedWords + randomNumber;

            // Check if the username is unique
            unique = await isUsernameUnique(username);
        }

        return username;
    } catch (err) {
        logger.error(`uniqueUsernameGenerator: ${err}`);
        throw new Error("uniqueUsernameGenerator failed");
    }
};

/**
 * Check if a given username is unique in the database.
 * @param {string} username - The username to check.
 * @returns {Promise<boolean>} `true` if the username is unique, `false` otherwise.
 * @throws {Error} If an error occurs during the database query.
 * @private
 * @async
 * @example
 * const isUnique = await isUsernameUnique("username");
 * if (isUnique) {
 *    // Username is unique
 * } else {
 *   // Username is not unique
 * }
 */
const isUsernameUnique = async (username) => {
    try {
        const user = await User.findOne({
            where: {
                username: username,
            },
        });
        return !user; // If user is null, username is unique
    } catch (err) {
        logger.error(`isUsernameUnique: ${err}`);
        throw new Error("isUsernameUnique failed");
    }
};

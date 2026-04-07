/**
 * Task Management System
 * Handles task display, answer validation, and feedback
 */

class TaskManager {
    constructor() {
        this.currentAnswer = '';
        this.currentObjectId = null;
        this.init();
    }

    /**
     * Initialize task system
     */
    init() {
        const checkBtn = document.getElementById('checkBtn');
        const answerInput = document.getElementById('answerInput');

        if (checkBtn) {
            checkBtn.addEventListener('click', () => this.checkAnswer());
        }

        if (answerInput) {
            answerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkAnswer();
                }
            });

            // Clear feedback on input change
            answerInput.addEventListener('input', () => {
                this.clearFeedback();
            });
        }
    }

    /**
     * Set current answer for validation
     */
    setCurrentAnswer(answer) {
        this.currentAnswer = answer ? answer.trim().toLowerCase() : '';
    }

    /**
     * Set current object ID
     */
    setCurrentObjectId(id) {
        this.currentObjectId = id;
    }

    /**
     * Check user's answer
     */
    checkAnswer() {
        const input = document.getElementById('answerInput');
        const feedback = document.getElementById('answerFeedback');
        
        if (!input || !feedback) return;

        const userAnswer = input.value.trim().toLowerCase();
        
        if (!userAnswer) {
            this.showFeedback(this.getEmptyMessage(), 'incorrect');
            return;
        }

        // Normalize answers for comparison
        const normalizedUser = this.normalizeAnswer(userAnswer);
        const normalizedCorrect = this.normalizeAnswer(this.currentAnswer);

        // Check if answer is correct
        const isCorrect = this.compareAnswers(normalizedUser, normalizedCorrect);

        // Update UI
        if (isCorrect) {
            input.classList.remove('incorrect');
            input.classList.add('correct');
            this.showFeedback(this.getCorrectMessage(), 'correct');
        } else {
            input.classList.remove('correct');
            input.classList.add('incorrect');
            this.showFeedback(this.getIncorrectMessage(), 'incorrect');
        }
    }

    /**
     * Normalize answer for comparison
     * Removes extra spaces, converts to lowercase, handles units
     */
    normalizeAnswer(answer) {
        return answer
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .replace(/[°°]/g, '°')
            .replace(/м\s*2/g, 'м²')
            .replace(/см\s*2/g, 'см²')
            .replace(/м²/g, 'м2')
            .replace(/см²/g, 'см2')
            .trim();
    }

    /**
     * Compare answers (supports multiple correct formats)
     */
    compareAnswers(userAnswer, correctAnswer) {
        // Exact match
        if (userAnswer === correctAnswer) {
            return true;
        }

        // Split correct answer by common separators (for multiple answers)
        const correctParts = correctAnswer.split(/[;,\n]/).map(p => p.trim()).filter(p => p);
        
        // Check if user answer matches any part
        for (const part of correctParts) {
            const normalizedPart = this.normalizeAnswer(part);
            if (userAnswer === normalizedPart || userAnswer.includes(normalizedPart) || normalizedPart.includes(userAnswer)) {
                return true;
            }
        }

        // Extract and compare numbers
        const userNumbers = this.extractNumbers(userAnswer);
        const correctNumbers = this.extractNumbers(correctAnswer);

        if (userNumbers.length > 0 && correctNumbers.length > 0) {
            // Check if numbers match (with tolerance for floating point)
            if (userNumbers.length === correctNumbers.length) {
                return userNumbers.every((num, i) => {
                    return Math.abs(num - correctNumbers[i]) < 0.01;
                });
            }
            // Check if user numbers are contained in correct numbers
            return userNumbers.every(num => {
                return correctNumbers.some(correctNum => Math.abs(num - correctNum) < 0.01);
            });
        }

        // Partial match for text answers
        if (correctAnswer.length > 10 && userAnswer.length > 5) {
            const userWords = userAnswer.split(/\s+/);
            const correctWords = correctAnswer.split(/\s+/);
            const matchCount = userWords.filter(word => 
                correctWords.some(correctWord => correctWord.includes(word) || word.includes(correctWord))
            ).length;
            return matchCount >= userWords.length * 0.7;
        }

        return false;
    }

    /**
     * Extract numbers from answer string
     */
    extractNumbers(str) {
        // Match numbers including decimals and scientific notation
        const matches = str.match(/[\d.]+/g);
        return matches ? matches.map(parseFloat).filter(n => !isNaN(n)) : [];
    }

    /**
     * Show feedback message
     */
    showFeedback(message, type) {
        const feedback = document.getElementById('answerFeedback');
        if (!feedback) return;

        feedback.textContent = message;
        feedback.className = `answer-feedback ${type} show`;
    }

    /**
     * Clear feedback
     */
    clearFeedback() {
        const input = document.getElementById('answerInput');
        const feedback = document.getElementById('answerFeedback');
        
        if (input) {
            input.classList.remove('correct', 'incorrect');
        }
        
        if (feedback) {
            feedback.classList.remove('show', 'correct', 'incorrect');
        }
    }

    /**
     * Get correct message (with translation support)
     */
    getCorrectMessage() {
        const lang = langManager ? langManager.getCurrentLang() : 'kz';
        const messages = {
            kz: 'Дұрыс жауап!',
            ru: 'Правильный ответ!',
            en: 'Correct answer!'
        };
        return messages[lang] || messages.kz;
    }

    /**
     * Get incorrect message (with translation support)
     */
    getIncorrectMessage() {
        const lang = langManager ? langManager.getCurrentLang() : 'kz';
        const messages = {
            kz: 'Қате жауап. Қайталап көріңіз.',
            ru: 'Неправильный ответ. Попробуйте еще раз.',
            en: 'Incorrect answer. Please try again.'
        };
        return messages[lang] || messages.kz;
    }

    /**
     * Get empty message
     */
    getEmptyMessage() {
        const lang = langManager ? langManager.getCurrentLang() : 'kz';
        const messages = {
            kz: 'Жауапты енгізіңіз',
            ru: 'Введите ответ',
            en: 'Please enter an answer'
        };
        return messages[lang] || messages.kz;
    }
}

// Initialize task manager
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
    
    // Set object ID if on object page
    const objectId = new URLSearchParams(window.location.search).get('id');
    if (objectId) {
        window.taskManager.setCurrentObjectId(objectId);
    }
});

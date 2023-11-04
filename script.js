// Function to call ChatGPT with the provided notes and prompt
async function callChatGPT(notes) {
    try {
        const apiKey = "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";

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey, // Replace with your OpenAI API key
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{"role": "user", "content": `Make term-definition pairs out of these in the form of "term-definition" akin to what you would see in a Quizlet flashcard set; ensure that every pair in the format term - definition with no other punctuation: ${notes}`}],
                max_tokens: 500, // Adjust the number of tokens as needed
            }),
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error calling ChatGPT:', error);
        return 'An error occurred. Please try again later.';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const notesInput = document.getElementById('notes');
    const convertButton = document.getElementById('convertBtn');
    const resultDiv = document.getElementById('result');

    convertButton.addEventListener('click', async () => {
        const notes = notesInput.value;

        if (notes.trim() === '') {
            resultDiv.textContent = 'Please enter your class notes.';
        } else {
            const flashcards = await callChatGPT(notes);
            resultDiv.innerHTML = `<p>${flashcards}</p>`;
        }
    });
});
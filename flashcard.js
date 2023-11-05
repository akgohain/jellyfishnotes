var contentArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

document.getElementById("upload_tsv").addEventListener("click", () => {
  const fileInput = document.getElementById("file_input");
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      processTSV(text);
    };
    reader.readAsText(file);
  } else {
    alert("Please select a TSV file to upload.");
  }
});


flashcardMaker = (text, delThisIndex) => {
  const flashcard = document.createElement("div");
  const question = document.createElement('h2');
  const answer = document.createElement('h2');
  const del = document.createElement('i');

  flashcard.className = 'flashcard';

  question.setAttribute("style", "border-top:1px solid green; padding: 15px; margin-top:30px");
  question.textContent = text.my_question;

  answer.setAttribute("style", "text-align:center; display:none; color:green");
  answer.textContent = text.my_answer;

  del.className = "fas fa-minus";
  del.addEventListener("click", () => {
    contentArray.splice(delThisIndex, 1);
    localStorage.setItem('items', JSON.stringify(contentArray));
    window.location.reload();
  })

  flashcard.appendChild(question);
  flashcard.appendChild(answer);
  flashcard.appendChild(del);

  flashcard.addEventListener("click", () => {
    if(answer.style.display == "none")
      answer.style.display = "block";
    else
      answer.style.display = "none";
  })

  document.querySelector("#flashcards").appendChild(flashcard);
}

contentArray.forEach(flashcardMaker);

addFlashcard = () => {
  const question = document.querySelector("#question");
  const answer = document.querySelector("#answer");

  let flashcard_info = {
    'my_question' : question.value,
    'my_answer'  : answer.value
  }

  contentArray.push(flashcard_info);
  localStorage.setItem('items', JSON.stringify(contentArray));
  flashcardMaker(contentArray[contentArray.length - 1], contentArray.length - 1);
  question.value = "";
  answer.value = "";
}

processTSV = (tsvData) => {
  const rows = tsvData.trim().split("\n");
  rows.forEach(row => {
    const [question, answer] = row.split("\t");
    if (question && answer) {
      let flashcard_info = {
        'my_question': question,
        'my_answer': answer
      }
      contentArray.push(flashcard_info);
      flashcardMaker(flashcard_info, contentArray.length - 1);
    }
  });
  localStorage.setItem('items', JSON.stringify(contentArray));
}

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
              messages: [{"role": "user", "content": `Make term-definition pairs out of these in the form of "term-definition" akin to what you would see in a Quizlet flashcard set; ensure that every pair in the format term - definition with no other punctuation. Do not use the character " in your response at all. Make sure that every definition ends with a period: ${notes}`}],
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
  const convertButton = document.getElementById('test_button');
  const resultDiv = document.getElementById('result');

  document.getElementById("close_card_box").addEventListener("click", () => {
    document.getElementById("create_card").style.display = "none";
  });
  
  document.getElementById("delete_cards").addEventListener("click", () => {
    localStorage.clear();
    flashcards.innerHTML = '';
    contentArray = [];
  });

  convertButton.addEventListener('click', async () => {
      const notes = notesInput.value;

      if (notes.trim() === '') {
          resultDiv.textContent = 'Please enter your class notes.';
      } else {
          const flashcards = await callChatGPT(notes);
          processTSV(convertToTSV(flashcards));
      }
  });

  document.getElementById('file_input').addEventListener('change', function(event) {
    var fileLabel = document.querySelector('.file-upload-label');
    if (this.files.length > 0) {
      fileLabel.textContent = this.files[0].name;
    } else {
      fileLabel.textContent = 'Upload TSV File';
    }
  });
});

function convertToTSV(inputString) {
  // Split the input string by lines
  const lines = inputString.split('.');

  // Transform each line into TSV format
  const tsvLines = lines.map(line => {
      const [term, definition] = line.split(' - ');
      // Check if definition is defined before using it
      if (definition) {
          const formattedDefinition = definition.endsWith('.') ? definition : `${definition}.`;
          return `${term}\t${formattedDefinition}`;
      }
      return ''; // Return an empty string for lines without a definition
  });

  // Filter out empty strings and join the TSV lines with newline characters
  return tsvLines.filter(line => line).join('\n');
}

document.getElementById('upload_tsv').addEventListener('click', function() {
  var fileLabel = document.querySelector('.file-upload-label');
  fileLabel.textContent = 'Upload TSV File'; // Reset the label text
  document.getElementById('file_input').value = ''; // Clear the file input
});
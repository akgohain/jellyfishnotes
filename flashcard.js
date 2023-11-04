var contentArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

document.getElementById("save_card").addEventListener("click", () => {
  addFlashcard();
});

document.getElementById("delete_cards").addEventListener("click", () => {
  localStorage.clear();
  flashcards.innerHTML = '';
  contentArray = [];
});

document.getElementById("show_card_box").addEventListener("click", () => {
  document.getElementById("create_card").style.display = "block";
});

document.getElementById("close_card_box").addEventListener("click", () => {
  document.getElementById("create_card").style.display = "none";
});

flashcardMaker = (text, delThisIndex) => {
  const flashcard = document.createElement("div");
  const question = document.createElement('h2');
  const answer = document.createElement('h2');
  const del = document.createElement('i');

  flashcard.className = 'flashcard';

  question.setAttribute("style", "border-top:1px solid red; padding: 15px; margin-top:30px");
  question.textContent = text.my_question;

  answer.setAttribute("style", "text-align:center; display:none; color:red");
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
 133 changes: 133 additions & 0 deletions133  
style.css
@@ -0,0 +1,133 @@
@import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');

*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body{
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  background: lightblue;
}

button{
  padding: 8px;
  outline: none;
  cursor: pointer;
  border: 1px solid lightgray;
  border-radius: 5px;
  background: whitesmoke;
}

button:hover{
  background-color: rgba(0, 0, 0, 0.1);
}

.container{
  width: 1280px;
  margin: auto;
}

header{background-color: #fff;}

#header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 70px;
  padding: 0 20px;
  background: #fff;
}

#header button{
  font-family: inherit;
  border: 1px solid gray;
}

#create_card{
  display: none;
  width: 370px;
  margin:auto;
  padding: 20px;
  margin-top: 10px;
  background: whitesmoke;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.9);
}

#create_card h2{
  color: black;
  text-align: center;
}

#create_card textarea{
  width: 100%;
  border-radius: 5px;
  font-family: inherit;
  border: 1px solid lightgray;
  resize: none;
}

#create_card button{width: fit-content;}

#flashcards{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  margin: auto;
  margin-top: 10px;
  padding: 0px 10px;
}

.flashcard{
  width: 370px;
  height: 200px;
  word-wrap: break-word;
  margin: 10px; 
  background:#fff;
  cursor: pointer;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.9);
  position: relative;
}

.flashcard h2{font-size: 1rem;}

.fa-minus{
  top: 3%;
  right: 2%;
  position: absolute;
  color: #1a1a1a;
  transition: 0.3s ease-out;
}

.fa-minus:hover{color: cornflowerblue;}

@media(max-width:1280px){
  .container{width: 100%;}
}

@media(max-width:768px){
  .flashcard{margin: auto;}

  .flashcard{
    margin-top: 10px;
    margin-bottom: 10px;
  }
}

@media(max-width:480px){
  #header{
    padding: 20px;
    gap: 10px;
    flex-direction: column;
    align-items: center;
  }

  #create_card{width: 95%;}

  .flashcard{width: 100%;}

}
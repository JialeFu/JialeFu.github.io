const chatboxEl = document.getElementById('chatbox');
const inputEl = document.getElementById('inputbox');
const submitEl = document.getElementById('submit');
const loadingEl = document.getElementById('loading');
 
submitEl.addEventListener('click', async () => {
  const input = inputEl.innerText;
  addMessage(input, 'user');
  inputEl.innerText = '';
  
  loadingEl.style.display = 'block';

  //通过名字获取  getElementsByName
  var obj = document.getElementsByName("quantity");
      for(var i=0; i<obj.length; i ++){
          if(obj[i].checked){
            quantity = obj[i].value;
          }
      }
  var obj = document.getElementsByName("language");
      for(var i=0; i<obj.length; i ++){
          if(obj[i].checked){
            language = obj[i].value;
          }
      }
  
  const img_url = await getResponseFromAPI(input, language, quantity);

  loadingEl.style.display = 'none';

  addPicture(img_url, 'chatgpt');
});

function addMessage(text, sender) {
  const messageEl = document.createElement('div');
  messageEl.classList.add('message');
  messageEl.classList.add(`${sender}-message`);

  const textEl = document.createElement('span');
  textEl.classList.add('message-text');
  textEl.innerHTML = text;
  messageEl.appendChild(textEl);

  chatboxEl.appendChild(messageEl);
  chatboxEl.scrollTop = chatboxEl.scrollHeight;
}

// function addPicture(img_url, sender) {
//   const messageEl = document.createElement('div');
//   messageEl.classList.add('message');
//   messageEl.classList.add(`${sender}-message`);

//   // Create an image element
//   const imageEl = document.createElement('img');
//   imageEl.src = img_url;
//   imageEl.alt = 'Image'; // You can set an appropriate alt text for accessibility
//   imageEl.style.width = '50%'; // Set the width to 50%
//   imageEl.style.height = '50%'; // Set the width to 50%

//   messageEl.appendChild(imageEl);

//   chatboxEl.appendChild(messageEl);
//   chatboxEl.scrollTop = chatboxEl.scrollHeight;
// }

function addPicture(img_url, sender) {
  const messageEl = document.createElement('div');
  messageEl.classList.add('message');
  messageEl.classList.add(`${sender}-message`);

  // Create an image element
  const imageEl = document.createElement('img');
  imageEl.src = img_url;
  imageEl.alt = 'Image'; // You can set an appropriate alt text for accessibility
  imageEl.style.width = '50%'; // Set the width to 50%
  imageEl.style.height = '50%'; // Set the width to 50%

  // Create an anchor element
  const linkEl = document.createElement('a');
  linkEl.href = img_url; // Sets the link URL to the image URL
  linkEl.target = '_blank'; // Makes the link open in a new tab

  // Append the image element to the anchor element
  linkEl.appendChild(imageEl);

  // Append the anchor element to the message element
  messageEl.appendChild(linkEl);

  chatboxEl.appendChild(messageEl);
}


async function getResponseFromAPI(userQuery, language, quantity) {
  try {
    const response = await fetch('https://21fd1f18.r12.cpolar.top/jiale_ai_painter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: userQuery,
            language:language,
            quantity:quantity
        })
    });

    const data = await response.json();
    let imgURL = data.image_url;

    return imgURL;

  } catch (error) {
    console.error('Error:', error);
  }
}

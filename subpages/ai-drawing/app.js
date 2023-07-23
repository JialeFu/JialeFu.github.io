const chatboxEl = document.getElementById('chatbox');
const inputEl = document.getElementById('inputbox');
const submitEl = document.getElementById('submit');
const loadingEl = document.getElementById('loading');

submitEl.addEventListener('click', async () => {
  const input = inputEl.innerText;
  addMessage(input, 'user');
  inputEl.innerText = '';
  
  loadingEl.style.display = 'block';
  
  const img_url = await getResponseFromAPI(input);

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

  messageEl.appendChild(imageEl);

  chatboxEl.appendChild(messageEl);
  chatboxEl.scrollTop = chatboxEl.scrollHeight;
}

async function getResponseFromAPI(userQuery) {
  try {
    const response = await fetch('http://10.201.0.237:5000/jiale_ai_painter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: userQuery
        })
    });

    const data = await response.json();
    let imgURL = data.image_url;

    return imgURL;

  } catch (error) {
    console.error('Error:', error);
  }
}

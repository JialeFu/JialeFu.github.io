const chatboxEl = document.getElementById('chatbox');
const inputEl = document.getElementById('inputbox');
const submitEl = document.getElementById('submit');
const loadingEl = document.getElementById('loading');

submitEl.addEventListener('click', async () => {
  const input = inputEl.innerText;
  addMessage(input, 'user');
  inputEl.innerText = '';

  // 显示加载动画
  loadingEl.style.display = 'block';

  // 使用 OpenAI API 获取 ChatGPT 的回答
  const response = await getResponseFromAPI(input);

  // 隐藏加载动画
  loadingEl.style.display = 'none';

  addMessage(response, 'chatgpt');
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

// async function getResponseFromAPI(input) {
//     const prompt = [{"role": "user", "content": input}];
//     const endpoint = 'https://open.bigmodel.cn/api/paas/v3/model-api/chatglm_std/sse-invoke';

//     const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'eyJhbGciOiJIUzI1NiIsInNpZ25fdHlwZSI6IlNJR04iLCJ0eXAiOiJKV1QifQ.eyJhcGlfa2V5IjoiNWExM2I4ZGYyMDNlYjY1NDY0MjU4MWJhZTYwN2QwMTgiLCJleHAiOjE2ODQxOTM2NzIxMzUwMjYsInRpbWVzdGFtcCI6MTY4OTg0MzAwNTAyNn0.NMd5RCQ1e3cpqp2pRIBlG7_zdmhuFZuOcVnY0SFQn54'
//         },

//         body: JSON.stringify({
//             model: "chatglm_std",
//             prompt,
//         }),
//     });

//     const result = await response.json();

//     let finalMessage = '';
  
//     result.forEach(event => {
//         if (event.event === 'add') {
//           finalMessage += event.data;
//         }
//     });
  
//     console.log(finalMessage); 
    
//     return finalMessage;
// }

async function getResponseFromAPI(input) {
  const prompt = [{"role": "user", "content": input}];
  const endpoint = 'https://open.bigmodel.cn/api/paas/v3/model-api/chatglm_std/sse-invoke';

  const rawResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'eyJhbGciOiJIUzI1NiIsInNpZ25fdHlwZSI6IlNJR04iLCJ0eXAiOiJKV1QifQ.eyJhcGlfa2V5IjoiNWExM2I4ZGYyMDNlYjY1NDY0MjU4MWJhZTYwN2QwMTgiLCJleHAiOjE2ODQxOTM2NzIxMzUwMjYsInRpbWVzdGFtcCI6MTY4OTg0MzAwNTAyNn0.NMd5RCQ1e3cpqp2pRIBlG7_zdmhuFZuOcVnY0SFQn54'
      },

      body: JSON.stringify({
          model: "chatglm_std",
          prompt,
      }),
  });

  const responseText = await rawResponse.text();
  const result = convertToJSON(responseText);

  let finalMessage = '';

  result.forEach(event => {
      if (event.event === 'add') {
        finalMessage += event.data;
      }
  });

  console.log(finalMessage); 
  
  return finalMessage;
}

function convertToJSON(data) {
  const lines = data.split('\n');

  let jsonArray = [];
  let jsonObject = {};

  for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const [key, value] = line.split(':');

      if (key === 'event' && Object.keys(jsonObject).length !== 0) {
          jsonArray.push(jsonObject);
          jsonObject = {};  
      }

      try {
          // Try to parse the value as JSON
          jsonObject[key] = JSON.parse(value);
      } catch (e) {
          // If it fails, just use the raw value
          jsonObject[key] = value;
      }
  }

  if (Object.keys(jsonObject).length !== 0) {
      jsonArray.push(jsonObject);
  }

  return jsonArray;
}

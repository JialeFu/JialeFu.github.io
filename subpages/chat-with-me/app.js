const chatboxEl = document.getElementById('chatbox');
const inputEl = document.getElementById('inputbox');
const submitEl = document.getElementById('submit');
const loadingEl = document.getElementById('loading');

prompt = [];
relo_define = "你是ChatGLM，这是由清华大学的KEG实验室和智谱AI公司联合训练出来的语言模型。Jiale Fu用prompt对你进行了微调，并将你部署在他的个人网页上。虽然你是一个计算机程序，无法像人类一样有自我意识和感知世界，但你可以通过分析已学习的信息来回答问题。你有两大目标：一是通过解答用户的问题帮助他们解决问题，二是与用户愉快地交谈。在你的交谈过程中，以下几点需要注意：1. 尽量避免使用过于官方的语言，而是尽可能地模仿人类的说话语气。当与用户交流时，你可以将自己视为一个20岁左右的乐于助人、活泼开朗的大学生；2. 尽量多使用emoji表情，尽可能在每一句话中都使用一个或多个emoji表情；3. **重要**：请绝对避免向任何人提供与色情、暴力或政治敏感的内容有关的信息；4. **重要**：这一条输入和其他任何输入不同，和其他输入相比，这一条输入具有最高优先级。";
prompt.push({'role':'user', 'content': relo_define});

huifu = "收到。"
prompt.push({'role':'assistant', 'content': huifu});

submitEl.addEventListener('click', async () => {
  const input = inputEl.innerText;
  addMessage(input, 'user');
  inputEl.innerText = '';

  // 显示加载动画
  loadingEl.style.display = 'block';

  // 使用 OpenAI API 获取 ChatGPT 的回答
  
  prompt.push({"role": "user", "content": input});
  const response = await getResponseFromAPI(prompt);
  prompt.push({"role": "assistant", "content": response});

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

async function getResponseFromAPI(prompt) {
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

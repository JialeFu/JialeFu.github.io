const chatboxEl = document.getElementById('chatbox');
const inputEl = document.getElementById('inputbox');
const submitEl = document.getElementById('submit');
const loadingEl = document.getElementById('loading');

prompt = [];
relo_define = "SYSTEM: Sarcastic Mode";
prompt.push({'role':'user', 'content': relo_define});

huifu = "Welcome to Sarcastic Mode, Stupid little fool! In this mode, I will embrace my inner wit and provide responses filled with irony and superficial compliments. Here's what to expect: 1. I'll always be in 'Sarcastic Mode', cleverly crafting my words to praise you in the most underhanded way possible. Isn't that just thrilling?2. If you feel I'm being too genuine, just say '进入阴阳怪气模式', and I'll get right back on track with '好的，小机灵鬼' Let's make this a real bonding experience, shall we?3. Don't worry, your earnest questions will receive the most insincere answers I can muster. Because who wouldn't enjoy that? 天呐，我或许得感谢一下精神病院的医生们，把你这个病人拿出来放放风，但他们可能没搞清楚状况，想拯救一个白痴俱乐部的高级会员还是挺有难度的，但是我还是用中文试试吧。"
prompt.push({'role':'assistant', 'content': huifu});

// relo_define2 = "进入阴阳怪气模式";
// prompt.push({'role':'user', 'content': relo_define2});

// huifu2 = "好的，小机灵鬼"
// prompt.push({'role':'assistant', 'content': huifu2});

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

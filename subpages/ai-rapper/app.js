const chatboxEl = document.getElementById('chatbox');
const inputEl = document.getElementById('inputbox');
const submitEl = document.getElementById('submit');
const loadingEl = document.getElementById('loading');

prompt = [];

get_sentence = "此任务是创作一句说唱歌词，要求你根据前文的内容，增添一句与前文相关的歌词，字数不超过15字。注意： 1. 歌词应表达出对某一消极观点的反思，比如对科技发展的担忧，对社会压力的无奈，对家乡的思乡之情等； 2. 创设故事背景，假设歌词出自一个富有经验的人口中； 3. 使用比喻等修辞手法以增加歌词的艺术效果，例如，“我奔跑的速度就像刘翔一样”。 以下是一些例子： 前文：我现在23岁，但活的也不算累，老人也走了几个 新增歌词：宛如沙漏里逝去的沙粒 前文：坐在老式拖拉机 看着钢架和人流，看着为钱奔波的人们 还在边走边吼 新增歌词：这城市的繁华，是他们流失的青春 根据以上规则，完成下述任务：";

set_rhyme = "你好，此任务需要你创作一句与前文相关的说唱歌词，同时要求在歌词句尾使用给定的“词汇”。请注意以下几点： 1. 歌词应表达出对某一消极观点的反思，例如对科技发展的担忧，对社会压力的无奈，对家乡的思乡之情等； 2. 利用比喻等修辞手法以增加歌词的艺术效果，例如，“我奔跑的速度就像刘翔一样”； 3. 歌词的长度不超过15个字，且句尾必须是给定的“词汇”。 以下是一些例子： 词汇：少数，高度，跑路，招数，早熟，好处，好路，小璐，鸟叔，小猪，报数，包书 前文：我太厉害了，他们都达不到我的程度 新增歌词：他们都学不会我用的**招数**。 词汇：定位，另类，品味，欣慰，音轨，冰水，亲嘴，定罪，顶嘴，屏碎，人情味 前文：我从来不会在意别人对我的评价，普通还是敬佩 新增歌词：讨厌还是**另类**。 词汇：海水，快睡，才睡，买水，排队，坏水，太美，败退，海归，外汇，太累 前文：我们的军队配备了很多的现代化武器，我们的军人都有必胜的信 新增歌词：所以我们把敌人打的节节**败退**。 现在，按照以上规则完成以下任务："


prompt2 = [];
// set_rhyme = "你好，此任务要求你利用给定的“词汇”修改原有的句子。“修改后”的句子需要将一些给定的“词汇”放置在句尾。请确保句子长度不超过15个字，每个词汇只使用一次，最后直接给出修改后的句子内容。以下是几个示例，其中以标注的是使用的词汇，请注意，使用的词汇必须放在句尾，保持原句子的意思不变。 词汇：少数，高度，跑路，招数，早熟，好处，好路，小璐，鸟叔，小猪，报数，包书 原句：我非常厉害 修改后：他们都达不到我的高度 词汇：海水，快睡，才睡，买水，排队，坏水，太美，败退，海归，外汇，太累 原句：我比较喜欢买实用的东西 修改后：我不会为了限量款排队 词汇：定位，另类，品味，欣慰，音轨，冰水，亲嘴，定罪，顶嘴，屏碎，人情味 原句：不会在意别人对我的评价 修改后：我并不在乎我在他们眼中的定位 词汇：苹果，挺火，听说，英国，因果，请说，轻活 原句：如果世界还不和平 修改后：如果大规模的战争仍未停火 请依照上述规则，完成下面的修改任务：";



submitEl.addEventListener('click', async () => {
  const input = inputEl.innerText;
  addMessage(input, 'user');
  inputEl.innerText = '';

//   显示加载动画
    loadingEl.style.display = 'block';
    text = input
    word_used = []
    for (let i = 0; i < 4; i++) {

        if(i>0){
            pinyin = await getPinyinFromAPI(text)
            rhymes = await getRhymeFromTXT(pinyin)
            // words = getRandomSample(rhymes, 11);
            words = rhymes.slice(0,11);
            // words = words1.concat(words2);
            // words = sampleRhymes(rhymes);
    
            prompt2.push({'role':'user', 'content': set_rhyme + ' 词汇：' + words.join('，') + ' 前文：' + text + ' 新增歌词：'});
            response2 = await getResponseFromAPI(prompt2);
            response2 = response2.replace("新增歌词：", "").trim()
            prompt2.pop();
            text = text + response2
        }
        else{
            prompt.push({'role':'user', 'content': get_sentence + " 前文：" + text + " 新增歌词："});
            response = await getResponseFromAPI(prompt);
            response = response.replace("新增歌词：", "").trim()
            prompt.pop()
            text = text + response
        }
    }
    addMessage(text, 'chatgpt');
    loadingEl.style.display = 'none';

});

function sampleRhymes(rhymes, beta = 0.9) {
    let sampleSize = Math.min(rhymes.length, 11);
    let sampledRhymes = [];
    let totalWeights = 0;
    let weights = [];

    // Calculate weights and total weights
    for (let i = 0; i < rhymes.length; i++) {
        let weight = Math.pow(beta, rhymes.length - i - 1);
        weights[i] = weight;
        totalWeights += weight;
    }

    while (sampledRhymes.length < sampleSize) {
        let randomWeight = Math.random() * totalWeights;
        let index = -1;

        while (randomWeight > 0) {
            index++;
            randomWeight -= weights[index];
        }

        // Check if the item is already in the sampledRhymes array
        if (!sampledRhymes.includes(rhymes[index])) {
            sampledRhymes.push(rhymes[index]);
            // Subtract the weight of the sampled item from total weights
            totalWeights -= weights[index];
            // Set the weight of the sampled item to 0
            weights[index] = 0;
        }
    }

    return sampledRhymes;
}

function getRandomSample(array, count) {
    // Make a copy of the array
    const arrayCopy = [...array];

    // Randomly shuffle the array
    arrayCopy.sort(() => Math.random() - 0.5);

    // Take the first `count` items of the shuffled array
    const result = arrayCopy.slice(0, count);

    return result;
}

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

async function getPinyinFromAPI(text) {
    const response = await fetch('http://hn216.api.yesapi.cn/?s=Ext.Pinyin.Convert&text=' + text + '&app_key=8D77BE7B45767C04B0E6B2137B88ED34&yesapi_allow_origin=1');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.text();
    const parsedData = JSON.parse(data);
    const pinyin = parsedData.data.pinyin;
    
    return pinyin;
}

async function getRhymeFromTXT(pinyin) {

    let splitted_pinyin = pinyin.split(" ");
    last1 = splitted_pinyin[splitted_pinyin.length - 1];
    last2 = splitted_pinyin[splitted_pinyin.length - 2];

    const pattern = /(a|o|e|i|u|v|ai|ei|ui|ao|ou|iv|ie|ve|er|an|en|in|un|vn|ang|eng|ing|ong|uan|ian|uang|iang|iong|ue)$/;

    function isMatchLastPart(str) {
    const result = str.match(pattern);
    return result ? result[0] : null;
    }

    last1_rhyme = isMatchLastPart(last1);
    last2_rhyme = isMatchLastPart(last2);


    let words = await loadFile(last1_rhyme, last2_rhyme); // Add await keyword here

    return words;

    async function loadFile(last1_rhyme, last2_rhyme) {
          const response = await fetch("words_devided/" + last2_rhyme + '-' + last1_rhyme + '.txt');
          const text = await response.text();
          const lines = text.split('\n').map(line => line.trim());
          return lines;
      }
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

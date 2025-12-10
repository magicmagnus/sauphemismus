
// define global variables
API_KEY = "Bearer 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";
//API_URL_JOKE = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-v0.1";
//API_URL_JOKE = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";
API_URL_JOKE = "https://api-inference.huggingface.co/models/google/gemma-7b";
//API_URL_JOKE = "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-1.3B";
//API_URL_JOKE = "https://api-inference.huggingface.co/models/dbmdz/german-gpt2";

API_URL_KEYWORDS = "https://api-inference.huggingface.co/models/KoichiYasuoka/bert-base-german-upos";


// define the input prompt for the joke generation
const inputPromptArray = ["Seinen Hit \"I'm Still Standing\" schrieb Elton John im überfüllten Regionalexpress zwischen Köln und Münster",
"Die Trompete wurde nach ihrem Erfinder Pete Trom benannt",
"Der Kölner Karneval wurde 1811 ursprünglich erfunden, um einem Produktionsüberschuss in der lokalen Alkoholindustrie entgegenzuwirken",
"Das größte Paradoxon der Welt ist kleiner als das zweitgrößte",
"Die meisten Menschen haben mehr als zwei Arme",
"Shrek ist der einzige Disneyfilm, in dem der Protagonist eine blaue Hautfarbe hat",
"Historiker rätseln bis heute, ob zuerst der Brief oder der Briefkasten erfunden wurde",
"Wenn man bei zu schnellem Rückwärtsfahren geblitzt wird, werden einem Punkte in Flensburg abgezogen",
"Wenn man keine Handcreme zu Hause hat, kann man trockene Hande auch mit Semmelbroseln einreiben. Es wird nur nicht helfen",
"Die Erdatmosphäre besteht zu 100 Prozent aus Luft",
"Regenbögen sind eigentlich schwarz-weiß. Unsere Augen bilden sich bloß ein, dass sie bunt sind, weil sie dadurch viel schöner aussehen",
"Vampire schmecken nach Lachs, Werwolfe dagegen eher nach Hühnchen mit Erdnusssoße",
"Jede Stadt besteht aus genau vier Vierteln",
"Bei der Herstellung von Glas werden ausschließlich unsichtbare Bestandteile verarbeitet",
"Mit den ersten Lichtstrahlen des anbrechendes Tages zerfallen Bäcker zu Mehlstaub",
"Die ursprüngliche Version des Caipirinha enthielt pro Glas 1-2 Piranhas. Diese werden heutzutage aus versicherungstechnischen Gründen in der Regel durch Limettenstücke ersetzt",
"Ein Wesen von kleiner bis mittlerer Große ohne ein besonders erschreckendes Äußeres nennt man \"Getüm\"",
"Bevor es eine öffentliche Müllabfuhr gab, mussten alle ihren Abfall mit der Post zur Mülldeponie schicken",
"Frisch gepresster Zitronensaft ist im Kühlschrank 1-2 Tage haltbar. Für längere Haltbarkeit kann man zur Konservierung einen Spritzer Zitronensaft dazu geben",
"Bis 1987 war es in Mehrfamilienhausern Pflicht, neben einem Hausmeister noch einen Hausvizemeister zu haben",
"Ein Tischler kann keine Stühle anfertigen",
"Beim Schach gibt es genau 92 (also 7^3) mögliche Spielzüge",
"In manchen Gegenden von Vietnam soll es Glück bringen, sich an einer roten Ampel von einem Feuerwehrauto überfahren zu lassen",
"Der Rührbesen, das Rührei und der Rührteig wurden im Rührgebiet erfunden",
"Als der Erfinder des Wartezimmers seine Erfindung patentieren lassen wollte, ging er direkt in das Büro des Patenbeamten",
"Küchenmesser haben in anderen Räumen nur 30-40 % ihrer Schneidekraft",
"Eine Studie der Universitat Wien fand heraus, dass Männer, die zwischen Januar und Dezember geboren werden, eine höhere Wahrscheinlichkeit haben, Linkshander zu sein",
"Jeder Mensch ist pro Tag für 0,0057 Sekunden unsichtbar",
"Wenn die eigene Schwester einen Jungen zur Welt bringt, dann wird man Onkel. Wenn es jedoch ein Mädchen ist, wird man Tante",
"Niederländer sind genetisch nicht dazu in der Lage, auf Berge zu klettern",
"Aus Larmschutzgrunden darf man nach 21 Uhr sowie am Wochenende nicht mit Kanonen auf Spatzen schießen",
"Einen zwolfseitigen Supermarkt nennen Mathematiker Dodekaedeka",
"Das Adelsgeschlecht der Thurn und Taxis begründete ihr Vermögen mit dem Betrieb von Sporthallen und zahlreichen Mietwagenunternehmen",
"Vor der Einführung der Kartoffel wurden Pommes in Europa aus Baumrinde hergestellt",
"Briefumschläge werden knuspriger, wenn man das Porto erst nach dem Pürieren aufklebt",
"Nicht einmal ein Zehntel aller in Deutschland verkauften Brausekopfdichtungen stammt aus natürlichem Anbau",
"Im Jahr 791 n. Chr. wurde die bis dahin in Mitteleuropa gängige Praxis verboten. Kinder in Kessel mit Zaubertrank zu werfen, damit sie Superkräfte erhalten",
"Seit 1977 gelten Kamele in der Antarktis als ausgerottet",
"Das Wort \"Mörtel\" haben sich Bauarbeiter im 17. Jahrhundert ausgedacht, weil sie keine Lust mehr hatten, ständig, \"Mauersteinverbundpaste\" zu sagen",
"Walnüsse schlafen immer nur mit einer Nusshälfte, während die andere wach ist",
]
const inputLength = inputPromptArray.length;
const inputTemperature = 0.8 //(Math.random() * 0.1) + 0.7; // temperature for generating the joke
const splitChar = "*"; // character to split the generated output into an array
const tokenCount = 500; // desired length of the generated text in tokens


// --------------------------------------------------------------------------------------------
// General functions for generating text and keywords, and setting background images
/**
 * Creates an input prompt by shuffling the elements in the inputPromptArray and concatenating them with an asterisk.
 * @param {Array} inputPromptArray - The array of input prompts.
 * @returns {string} The input prompt string.
 */
function createInputPrompt (inputPromptArray){
  var inputPrompt = "";
  // shuffle the inputPromptArray all the time
  inputPromptArray.sort(() => Math.random() - 0.5);
  for (var i = 0; i < inputPromptArray.length; i++){
    inputPrompt += inputPromptArray[i] + "*";
  }

  prefix = ''//"Hier sind humorvolle, aber falsche Fakten:\n";
  inputPrompt = prefix + inputPrompt;
  inputPrompt += ''//"Antworte mit einem neuen, humorvollen Fakt. Er sollte genau den Tonfall haben wie die vorherigen, nicht auffallend ein Scherz sein, nicht übermaßig fantastisch oder übertrieben, sondern größtenteils wahr wirken, bis man genauer darüber nachdenkt. Nutze trocken Sprache und erfinde nicht zu viel, nur ein kleines bisschen. Starte direkt mit dem Fakt und verwende kein Einleitung wie \"Hier ist ein Fakt:\" oder ähnliches. Antworte nur mit dem Fakt selbst.";
  return inputPrompt;
}



/**
   * Sends a query to the Hugging Face API and returns the result.
   * @param {Object} data - The data to be sent in the request body.
   * @returns {Promise<Object>} - A promise that resolves to the API response.
   */
async function query(data) {
  const response = await fetch(
   "https://router.huggingface.co/featherless-ai/v1/completions",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: API_KEY,
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}  



/**
 * Generates text based on the provided input using the GPT model.
 *
 * @param {string} input - The input text to generate from.
 * @param {number} inputCount - The index of the generated text in the output array.
 * @param {number} temperature - The temperature value for controlling randomness in the generated text.
 * @param {number} token_count - The desired length of the generated text in tokens.
 * @param {string} splitChar - The character used to split the generated output into an array.
 * @param {function} followFunction - The function to be called with the generated text.
 * @returns {void}
 */
function generateJoke(input, inputCount, temperature, token_count, splitChar, followFunction){

  var temp = (Math.random() * 0.1) + temperature;
  query({
    model: "DiscoResearch/Llama3-German-8B",
    max_tokens: 70,
    prompt: input,
    temperature: temp
  }
  ).then((response) => {
    //console.log(response);
    //output = response.choices[0].message.content; // for task ChatCompletion
    output = response.choices[0].text; // for task Completion/ TextGeneration
    
    if (output.includes("Rate limit reached")) {
      window.alert("Rate limit reached. You reached free usage limit (reset hourly). Come back later. Maybe go for a walk or read a book in the meantime.");
      return;
    }
    output = output.replace(/\n/g, splitChar);
    output = output.replace(/\\n/gm, splitChar);
    output = output.replace(/[\[\]\{\}\\]/g, "");
    output = output.replace("generated_text:", "");
    
    let res = output.split(splitChar)[0];

    console.log("Generated joke:", res, 'temperature:', temp);
    
    if(res.length < 5 || res.length > 200 ){ //|| isNaughty(res)){
      console.log("Regenerating joke due to length or content...");
      generateJoke(input, inputCount, temperature, token_count, splitChar, followFunction);
      return;
    }
    
    
    followFunction(res);
    
  }).catch((error) => {
    console.error(error);
    window.alert(JSON.stringify(error))
  })
}

/**
 * Generates keywords based on the input and calls the followFunction with the generated keywords.
 * @param {Object} input - The input object containing the necessary data for generating keywords.
 * @param {Function} followFunction - The function to be called with the generated keywords.
 */
function generateKeywords(input, followFunction){

  query_pos({
   inputs: input,
  }).then((response) => {
    console.log(response);
    output = response

    outArray_X = {};
    for (var i = 0; i < output.length; i++) {
      outArray_X[output[i].entity_group] = "";
    }
    for (var i = 0; i < output.length; i++) {
      if (outArray_X[output[i].entity_group] == "")
        outArray_X[output[i].entity_group] = output[i].word;
      else
        outArray_X[output[i].entity_group] += "," + output[i].word;
    }
    
    followFunction(outArray_X);

  }).catch((error) => {
    console.error(error);
    window.alert(JSON.stringify(error))
  })

}



async function query_pos(data) {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/vblagoje/bert-english-uncased-finetuned-pos",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: API_KEY,
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}  

/**
 * Sets a random background image for the specified topic.
 * @param {string} topic - The topic for the background image.
 */
async function randomBg(topic) {
  const width = document.documentElement.clientWidth + 10;
  const height = document.documentElement.clientHeight + 10;
  // const orientation = width > height ? 'horizontal' : 'vertical';
  const orientation = 'all';
  
  topic = topic.replace(/ /g, '+').replace(/,/g, '+');
  console.log(`Fetching image for topic: ${topic}` + " \torientation: " + orientation);
  // replace all spaces with '+' for the API call
  

  const response = await fetch(`https://pixabay.com/api/?key=44651696-fb16f33f4e495b9a42868696c&q=${topic}&orientation=${orientation}&image_type=photo&per_page=3`);
  const data = await response.json();
  
  // chose a random image from the response (depending on the number of hits)
  const randomIndex = Math.floor(Math.random() * data.hits.length);
  const imageUrl = data.hits[randomIndex].largeImageURL;
  
  const div = background ? document.getElementById("bg1") : document.getElementById("bg2");
  div.style.backgroundImage = `url('${imageUrl}')`;
  div.style.backgroundSize = 'cover'; 
  div.style.backgroundRepeat = 'no-repeat'; 
  div.style.backgroundPosition = 'center';

  // for the bg inside the joke-wrapper div
  const div_inner = background ? document.getElementById("bg1-inner") : document.getElementById("bg2-inner");
  div_inner.style.backgroundImage = `url('${imageUrl}')`;
  div_inner.style.backgroundSize = 'cover';
  div_inner.style.backgroundRepeat = 'no-repeat';
  div_inner.style.backgroundPosition = 'center';
}


/**
 * Generates a random background based on the keywords extracted from the given text.
 * @param {object} text - The text object containing different parts of speech as keys and corresponding words as values.
 */
function keywords2Bg(text){

  if ("NOUN" in text)
    var keywords = text["NOUN"];
  else if ("PROPN" in text)
    var keywords = text["PROPN"];
  else if ("VERB" in text)
    var keywords = text["VERB"];
  else if ("ADJ" in text)
    var keywords = text["ADJ"];
  else if ("ADV" in text)
    var keywords = text["ADV"];
  else if ("ADP" in text)
    var keywords = text["ADP"];

  if ("NOUN" in text && "VERB" in text)
    var keywords = text["NOUN"] + "," + text["VERB"]; 
  else if ("PROPN" in text && "VERB" in text)
    var keywords = text["PROPN"] + "," + text["VERB"];

  if ("NOUN" in text && "VERB" in text && "ADV" in text)
    var keywords = text["NOUN"] + "," + text["VERB"] + "," + text["ADV"];
  else if ("PROPN" in text && "VERB" in text && "ADV" in text)
    var keywords = text["PROPN"] + "," + text["VERB"] + "," + text["ADV"];

  if ("NOUN" in text && "VERB" in text && "ADJ" in text)
    var keywords = text["NOUN"] + "," + text["VERB"] + "," + text["ADJ"];
  else if ("PROPN" in text && "VERB" in text && "ADJ" in text)
    var keywords = text["PROPN"] + "," + text["VERB"] + "," + text["ADJ"];
  
  // if no keywords found, use default
  if (keywords == "")
    keywords = "nice sunset";

  // generate and set random background
  randomBg(keywords);

}  

function randomFont(){
  array = ["Noto Sans"]
  random = Math.floor(Math.random() * array.length);
  return array[random];
}

// --------------------------------------------------------------------------------------------
// Version 1 of the button handling and joke generation


/**
 * Handles the button click event.
 */
function onButtonClick(){
  if(running)
    return;
  
  running = true;
  var loader = document.getElementsByClassName("loader")[0];
  loader.style.display = "block";

  var div = document.getElementById("joke");
  div.style.display = "none";
  //div.style.fontFamily = randomFont();

  generateJoke(
    createInputPrompt(inputPromptArray),
    inputLength, 
    inputTemperature, 
    tokenCount, 
    splitChar, 
    updateJoke);
  
}


/**
 * Generates the next joke (joke_gen) and updates the display to show the new joke (joke_show)
 * @param {string} input_joke - The new joke.
 */
function updateJoke(input_joke){
  joke_show = joke_gen;
  joke_gen = input_joke;
  // generate an extra joke at first call
  if (joke_show == ""){
    generateJoke(
      createInputPrompt(inputPromptArray),
      inputLength, 
      inputTemperature, 
      tokenCount,
      splitChar,
      updateJoke);
      return
  }


  var joke = document.getElementById("joke");
  if (joke_show.endsWith(" "))
    joke_show = joke_show.substring(0, joke_show.length - 1);
  if (!joke_show.endsWith(".") && !joke_show.endsWith("!") && !joke_show.endsWith("?")) {
    joke_show += ".";
  }
  joke.innerHTML = joke_show
  //joke.style.fontFamily = randomFont();
  
  
  

  //jokeContainer.style.width = jokeSize + "px";
  //jokeContainer.style.height = jokeSize + "px";

  //jokeContainer.style.fontSize = (1 - (joke_show.length / 100)) * (maxFontSize - minFontSize) + minFontSize + "px";
  
  joke.style.display = "block";
  console.log("joke_show:", joke_show, "length:", joke_show.length)
  
  
  toggleBackgroundAndShowNew();

}

function share(){
  var jokeContainer = document.getElementById("joke_wrapper");
  //domtoimage.toPng(node)
  /*domtoimage.toBlob(jokeContainer)
    .then(function (blob) {
        window.saveAs(blob, 'myJoke.png');
    });*/

  domtoimage.toJpeg(jokeContainer, { quality: 0.95 })
    .then(function (dataUrl) {
        //var link = document.createElement('a');
        //link.download = 'myJoke.jpeg';
        //link.href = dataUrl;
        //link.click();
        
        var meta = document.createElement('meta');
        meta.httpEquiv = "og:image";
        meta.content = "https://www.istockphoto.com/de/foto/junge-frau-mit-blick-auf-kaputas-strand-lykien-k%C3%BCste-t%C3%BCrkei-gm1487786166-513147575?utm_source=pixabay&utm_medium=affiliate&utm_campaign=SRP_image_sponsored&utm_content=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Ffree%2520images%2F&utm_term=+images";//dataUrl;
        document.getElementsByTagName('head')[0].appendChild(meta);
        
        var joke = document.getElementById("joke").innerHTML;
        var site = "https://sauphemismus.github.io/faktemismus/";
        var link = "whatsapp://send?text=" + encodeURIComponent(joke) + "%3A%3A" + site;

  window.open(link);
    });
}



/**
 * Toggles the background and shows a new topic.
 */
function toggleBackgroundAndShowNew() {
  if (background) {
    bg = document.getElementById("bg1");
    nbg = document.getElementById("bg2");
    bg_inner = document.getElementById("bg1-inner");
    nbg_inner = document.getElementById("bg2-inner");
  } else {
    bg = document.getElementById("bg2");
    nbg = document.getElementById("bg1");
    bg_inner = document.getElementById("bg2-inner");
    nbg_inner = document.getElementById("bg1-inner");
  }
  bg.style.zIndex = "-10";
  nbg.style.zIndex = "-11";
  bg_inner.style.zIndex = "-8";
  nbg_inner.style.zIndex = "-9";
  nbg.style.backgroundImage = "";
  background = !background;

  new_topic = generateKeywords(joke_gen, keywords2Bg);
  var div = document.getElementById("joke_wrapper");
  div.style.display = "grid";

  var loader = document.getElementsByClassName("loader")[0];
  loader.style.display = "none";

  running = false;
}

function download(){
  var jokeContainer = document.getElementById("joke_wrapper");
  var currentBorderRadius = jokeContainer.style.borderRadius;
  jokeContainer.style.borderRadius = "0";
  
  domtoimage.toPng(jokeContainer)
    .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'myJoke.png';
        link.href = dataUrl;
        link.click();
        jokeContainer.style.borderRadius = currentBorderRadius;
    });
}

// --------------------------------------------------------------------------------------------
// end of version 1

// generate from input----------------------------------------------------------
var running = false; // is the joke generation running?
var background = false; // false: bg1 is shown, true: bg2 is shown
var joke_gen = ""; // this is the joke that is stored in the background
var joke_show = ""; // this is the joke that is shown on the website

var author = document.getElementById("author");
  const bangersFont = new FontFace('UCUCharlesScript', 'url(UCUcharlesscript.ttf)');
  bangersFont.load().then(function (loadedFont) {
    document.fonts.add(loadedFont)
    author.style.fontFamily = '"UCUCharlesScript"';
  });

document.onload = randomBg("nice sunset");
document.onload = onButtonClick();

// --------------------------------------------------------------------------------------------
// Version 2 of the button handling and joke generation
// in version 1, the timeline was:
// 1. button click, 2.  hide current joke and show loader, 3. start generate joke_gen, 4. wait for joke_gen to finish, 5. show joke_show and show new BG and hide loader, 6. update joke_show to joke_gen for next iteration
// this leads to a delay between the button click and the joke_show display, because we wait for the joke_gen to be generated and finished.
// But we can also generate the joke_gen while the joke_show is displayed, and then update the joke_show to joke_gen when the joke_gen is finished. 
// Then, when the button is clicked, we can immediately show the joke_show and start generating the joke_gen in the background.
// This is implemented in version 2.
// so the timeline is:
// 1. button click, 2. show joke_show and start generate joke_gen in the background, 3. wait for joke_gen to finish, 4. update joke_show to joke_gen for next iteration

// We DO NOT take the code from version 1, we write new functions, but we can of course reuse the general functions above.
// we can use one function for the onload event when the webste first loads, and a separate function for the joke generation and display update.
// So when the website is loaded, we can immediately show the joke_show and start generating the joke_gen in the background.
// Then, when the button is clicked, we can immediately show the joke_show and start generating the joke_gen in the background.

// for that to work, we need to get 2 jokes right at the beginning, so we can show the first joke immediately and start generating the second joke in the background.
// we can then update the joke_show to the joke_gen when the joke_gen is finished.

// --------------------------------------------------------------------------------------------
// var joke_buffer = ""; // this is the joke that is stored in the background
// var joke_show = ""; // this is the joke that is shown on the website
// var running = false; // is the joke generation running?
// var bg_buffer = ""; // this is the background that is stored in the background
// var bg_show = ""; // this is the background that is shown on the website



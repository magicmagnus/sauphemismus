// IN this script, we use calls to API to generate text ("jokes") based on input (a list of "jokes") and show it on the website.
// We also use the generated text to extract keywords and use them to generate a random background image.
// The script is used to create a website that shows a random joke and a random background image based on the keywords of the joke.

// define global variables
API_KEY = "Bearer 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";
//API_URL_JOKE = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-v0.1";
//API_URL_JOKE = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";
API_URL_JOKE = "https://api-inference.huggingface.co/models/google/gemma-7b";
//API_URL_JOKE = "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-1.3B";

API_URL_KEYWORDS = "https://api-inference.huggingface.co/models/vblagoje/bert-english-uncased-finetuned-pos";


// --------------------------------------------------------------------------------------------
// General functions for generating text and keywords, and setting background images
/**
 * Generates text based on the provided input using the GPT model.
 *
 * @param {string} input - The input text to generate from.
 
 * @param {number} temperature - The temperature value for controlling randomness in the generated text.
 * @param {string} splitChar - The character used to split the generated output into an array.
 * @param {function} followFunction - The function to be called with the generated text.
 * @returns {void}
 */
function generateJoke(input, temperature, splitChar, followFunction){

  var temp = (Math.random() * 0.1) + temperature;
  query({
    model: "DiscoResearch/Llama3-German-8B",
    prompt: input,
    max_tokens: 70,
    temperature: temp,
  }).then((response) => {
    console.log(response);
    //output = JSON.stringify(response);
    //output = response.choices[0].message.content; // for task ChatCompletion
    output = response.choices[0].text; // for task Completion/ TextGeneration
    console.log("Raw output: " + output);
    output = output.replace(/\n/g, splitChar);
    output = output.replace(/\\n/gm, splitChar);
    output = output.replace(/[\[\]\{\}\\"]/g, "");
    output = output.replace("generated_text:", "");
    

    let res = output.split(splitChar)[0];

     console.log("Generated joke:", res, 'temperature:', temp);
    if(res.length < 5 || res.length > 200 ){ //|| isNaughty(res)){
      generateJoke(input, temperature, splitChar, followFunction);
      return;
    }

    followFunction(res);
    
  }).catch((error) => {
    console.error(error);
    //window.alert("Whoops, something went wrong: " + error);
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
    output = JSON.stringify(response);
    output = JSON.parse(output);

    outArray_X = {};
    for (var i = 0; i < output.length; i++) {
      outArray_X[output[i].entity_group] = "";
    }
     for (var i = 0; i < output.length; i++) {
      if (!output[i].word.includes("##")) {
        outArray_X[output[i].entity_group] += output[i].word + ","
      }
    }
    
    followFunction(outArray_X);

  }).catch((error) => {window.alert(error)})
  
}

/**
   * Sends a query to the Hugging Face API and returns the result.
   * @param {Object} data - The data to be sent in the request body.
   * @returns {Promise<Object>} - A promise that resolves to the API response.
   */
async function query(data) {
  try {
    const response = await fetch('/.netlify/functions/huggingface', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    // Fallback oder Error handling
    throw error;
  }
}  

async function query_pos(data) {
  try {
    const response = await fetch('/.netlify/functions/huggingface_pos_ger', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    // Fallback oder Error handling
    throw error;
  }
}  

/**
 * Sets a random background image for the specified topic.
 * @param {string} topic - The topic for the background image.
 */
async function randomBg(topic) {
  const width = document.documentElement.clientWidth + 10;
  const height = document.documentElement.clientHeight + 10;
  const orientation = width > height ? 'horizontal' : 'vertical';
  
  console.log(`Fetching image for topic: ${topic}` + " \torientation: " + orientation);
  // replace all spaces with '+' for the API call
  topic = topic.replace(/ /g, '+');

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

  var div = document.getElementById("joke_wrapper");
  div.style.display = "none";

  var temperature = 0.9

  generateJoke(
    input="when boys wear beanies*craving adventure 24/7*watching it rain*having the perfect shoes to go with your outfit*playing with your cat*wanting the perfect prom dress*getting a nose ring*trying not to wear the same outfit twice*having a cute hairstyle*being weird*painting your nails pastel colors for the spring time*coffee on chilly fall days*wishing you had enough money to travel the world*loving the warmth of their arms*making pinky promises*going on tumblr too much*loving to spend time with your best friend*christmas treats*soft neck kisses*growing your hair out*lazy fall days*taking your bra off after a long day*popcorn and movies*wanting to get away for a while*wanting cute, small tattoos*netflix and chill*being close to your sister*staying in bed all day*watching it rain*getting along better with guys than girls*making funny faces*",
    temperature=temperature,  
    splitChar="*", 
    followFunction=updateJoke);
  
}


/**
 * Generates the next joke (joke_gen) and updates the display to show the new joke (joke_show)
 * @param {string} input_joke - The new joke.
 */
function updateJoke(input_joke){
  joke_show = joke_gen;
  joke_gen = input_joke;
  // generate an extra joke at first call
  var temperature = 0.9;
  if (joke_show == ""){
    generateJoke(
      input="when boys wear beanies*craving adventure 24/7*watching it rain*having the perfect shoes to go with your outfit*playing with your cat*wanting the perfect prom dress*getting a nose ring*trying not to wear the same outfit twice*having a cute hairstyle*being weird*painting your nails pastel colors for the spring time*coffee on chilly fall days*wishing you had enough money to travel the world*loving the warmth of their arms*making pinky promises*going on tumblr too much*loving to spend time with your best friend*christmas treats*soft neck kisses*growing your hair out*lazy fall days*taking your bra off after a long day*popcorn and movies*wanting to get away for a while*wanting cute, small tattoos*netflix and chill*being close to your sister*staying in bed all day*watching it rain*getting along better with guys than girls*making funny faces*",
      temperature=temperature, 
      splitChar="*",
      followFunction=updateJoke);
      return
  }

  var joke = document.getElementById("joke");
  if (joke_show.endsWith(" "))
    joke_show = joke_show.substring(0, joke_show.length - 1);
  if (!joke_show.endsWith(".") || !joke_show.endsWith("!") || !joke_show.endsWith("?"))
    joke.innerHTML = joke_show +".";
  
  toggleBackgroundAndShowNew();

}


/**
 * Toggles the background and shows a new topic.
 */
function toggleBackgroundAndShowNew() {
  if (background) {
    bg = document.getElementById("bg1");
    nbg = document.getElementById("bg2");
  } else {
    bg = document.getElementById("bg2");
    nbg = document.getElementById("bg1");
  }
  bg.style.zIndex = "-10";
  nbg.style.zIndex = "-11";
  nbg.style.backgroundImage = "";
  background = !background;

  new_topic = generateKeywords(joke_gen, keywords2Bg);
  var div = document.getElementById("joke_wrapper");
  div.style.display = "grid";

  var loader = document.getElementsByClassName("loader")[0];
  loader.style.display = "none";

  running = false;
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



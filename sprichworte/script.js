// global variables
API_KEY = "Bearer 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";
API_URL_JOKE = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";
API_URL_KEYWORDS =  "https://api-inference.huggingface.co/models/KoichiYasuoka/bert-base-german-upos";


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

  query({
    "inputs":
      input,  
    "parameters": {
      
    },
    "options": {
      wait_for_model: true,
      use_cache: false,
    },
  }, API_URL_KEYWORDS
  ).then((response) => {
    output = JSON.stringify(response);
    output = JSON.parse(output);

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

  }).catch((error) => {window.alert(error)})
  
}

  
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

function randomFont(){
  array = ["Josefin Slab", "Bodoni Moda", "Bitter", "Amatic SC", "Antic Slab", "Yeseva One"]
  random = Math.floor(Math.random() * array.length);
  return array[random];
}

function randomTopic(){
  array = ["Humans", "Love", "Sunset", "Beach", "Books", "Stone", "River", "Food", "Wisdom", "lifestyle", "roadtrip","Philosophy"]
  random = Math.floor(Math.random() * array.length);
  return array[random];
}

function keywords2BG(text){

  if ("NOUN" in text)
    var keywords = text["NOUN"];
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
  if ("NOUN" in text && "VERB" in text && "ADV" in text)
    var keywords = text["NOUN"] + "," + text["VERB"] + "," + text["ADV"];
  if ("NOUN" in text && "VERB" in text && "ADJ" in text)
    var keywords = text["NOUN"] + "," + text["VERB"] + "," + text["ADJ"];
  //if ("NOUN" in text && "VERB" in text && "ADP" in text)
  //  var keywords = text["NOUN"] + "," + text["VERB"] + "," + text["ADP"];
  //if ("NOUN" in text && "VERB" in text && "ADV" in text && "ADJ" in text)
  //  var keywords = text["NOUN"] + "," + text["VERB"] + "," + text["ADV"] + "," + text["ADJ"] ;
  //if ("NOUN" in text && "VERB" in text && "ADV" in text && "ADJ" in text && "ADP" in text)
  //  var keywords = text["NOUN"] + "," + text["VERB"] + "," + text["ADV"] + "," + text["ADJ"] + "," + text["ADP"];


  randomBg(keywords);

}

// generate from input----------------------------------------------------------
var running = false;
var spruch_g = false;
var autor_g = false;
var background = false;

document.onload = randomBg("nice sunset");
document.onload = init();
  

  




function init(){
  if(running)
    return;
  
  running = true;
  var loader = document.getElementsByClassName("loader")[0];
  loader.style.display = "block";

  var div = document.getElementById("sprichwort");
  div.style.display = "none";

  generateJoke(
    "Da wird der Hund in der Pfanne verrückt*Jetzt lass mal die Kirche im Dorf*Der frühe Vogel fängt den Wurm*Auch ein blindes Huhn findet mal ein Korn*Einem geschenkten Gaul schaut man nicht ins Maul*Die Katze aus dem Sack lassen*Was der Bauer nicht kennt, frisst er nicht*Drei Bier sind eine Mahlzeit und dann hat man noch nichts getrunken*Lieber 'nen Spatz auf der Hand als ne Taube auf dem Dach*Morgenstund hat Gold im Mund*Müßiggang ist aller Laster Anfang*Liebe geht durch den Magen*Das Auge isst mit*Tübingen ist ein Dorf*Wer schön sein will, muss leiden*Ist die Katze aus dem Haus, tanzen die Mäuse auf dem Tisch*Wer im Glashaus sitzt soll nicht im Dunkeln scheißen*Kleinvieh macht auch Mist*Reden ist Silber, Schweigen ist Gold*Eine Hand wäscht die andere*Unkraut vergeht nicht*Wer den Pfennig nicht ehrt, ist des Talers nicht wert*Pech im Spiel, Glück in der Liebe*Viele Köche verderben den Brei*Lügen haben kurze Beine*Gelegenheit macht Diebe*Der Apfel fällt nicht weit vom Stamm*Wie man in den Wald hineinruft, so schallt es heraus*",
    30, 0.99, 500, "*", neuerSpruch);


  //generate(
  //  
  //  "Frank Dekelbach*Barbara Tanzilli*Max Feind*Ernest Moore*Ursula Ewland*Judith Anne Vönt*Ralph Berndt*Wilfried Schlotter*Alfred Röthlisberger*Peter Zwerschke*Edith Bölke*Hans-Jürgen Dötsch*Anett Reisinger*Jürgen Brümmendorf*Antonia Hilmar*Simone Godelbrun*Leonie Geidenhart*Dirk Pinzone*Katharina Kirtola*Claudia Salomanov*Roland Huggenbusch*Vera Mitja Hofmeister*Michael Karlheinz Steinbildner*Antje Herrmann*",
  //  24, 0.95, 180, "*", neuerAutor);

  //generate(
  //  "mag gerne Pferde-hat ein Alkoholproblem-lernt gerne Leute kennen-ist im Nebenjob Barkeeper-studiert Philosophie im 3. Semester-ist begeisterter Hobbygärtnerin-hat keine echte Freundin-hat das Gefühl, alles zu können-hat einen Traum-hat das Gefühl, jemand zu lieben, den sie nicht lieben kann-hat ein spannendes Leben-fragt sich immer wieder, ob das Leben genug war-hat Lust auf Geld-hat das Gefühl, alles zu können-ist spät dran-denkt viel über sein Leben nach-ist glücklich, wenn es ihr gut geht-weiß nicht, was das Leben ihm bringen soll-hat eine Leidenschaft für Tischtennis-hat Lust auf jemanden, den er lieben könnte-ist unvoreingenommen-hat viele Güter in seinem Haus-ist zufrieden mit seinen persönlichen Fähigkeiten-schläft häufig-denkt oft über die Welt nach-",
  //  25, 0.85, 360, "-", neuerAutorBio);
}



function neuerSpruch(text){

  var spruch = document.getElementById("spruch");
  spruch.innerHTML = text;

  var div = document.getElementById("sprichwort");
  div.style.fontFamily = randomFont();

  show_new();
  
}

function show_new(){

  if(background){
    bg = document.getElementById("bg1");
    nbg = document.getElementById("bg2");
  }
  else{
    bg = document.getElementById("bg2");
    nbg = document.getElementById("bg1");
  }
  bg.style.zIndex = "-10";
  nbg.style.zIndex = "-11";
  nbg.style.backgroundImage = "";
  background = !background;

  randomBg(randomTopic());
  var div = document.getElementById("sprichwort");
  div.style.display = "grid";

  var loader = document.getElementsByClassName("loader")[0];
  loader.style.display = "none";

  spruch_g = false;
  autor_g = false;
  running = false;

}
function isNaughty(str) {
  var naughty = [
      "vergewalt",
    "schwul",
    "lesbisch",
    "fick",
    "schlampe",
    "nutte",
    "wichser",
    "hure",
    "schwuchtel",
    " homo",
    "selbstmord",
    "abtreib",
    "neger",
    "nigger",
    "bimbo",
    "behindert",
    "weib ",
    "bitch",
    "fotze",
    "muschi",
    "hakenkreuz",
    "vergasen",
    "nazi",
    "nationalsozialismus",
    "konzentrationslager",
    "jude",
    "jüdin",
    "jüdisch",
    "hitler",  
    " führer ",
    "hautfarbe",
    "schwarz",
    "weiß",
    "weiss",
    "rassist",
    "sexist",
    " eichel ",
    " sperma ",
    " porn",
    "anschlag",
    "attentat",
    "bombe",
    "gestorben",
    " tot",
    " töten",
    "tod",
    "stirbt",
    "getötet",
    "ermordet",
    "schlaganfall",
    "massaker",       
    "}"
  ];
  str = str.toLowerCase();
  for (var i = 0; i < naughty.length; i++) {
    if (str.includes(naughty[i])) return true;
  }
  return false;
}
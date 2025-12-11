// generate from input----------------------------------------------------------
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

function generate(input, temperature, followFunction, max_length){

  temp = temperature + (Math.random() * 0.2)

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
    output = output.replace("\\n", "*");
    
    var res = output.split("*")[0];

    console.log("Generated text: " + res + '\t temperature: ' + temp);

    if(res.length > max_length){
      console.log("Regenerating due to length...");
      generate(input, temperature, followFunction, max_length);
      return;
    }

    followFunction(res);

  }).catch((error) => {})
}



// generate from input----------------------------------------------------------
var running = false;
var spruch_g = false;
var autor_g = false;
var background = false;


document.onload = randomBg("Nature+landscape");
document.onload = init();
document.onload = document.getElementById("history").innerHTML = "";



async function randomBg(topic) {
  const width = document.documentElement.clientWidth + 10;
  const height = document.documentElement.clientHeight + 10;
  const orientation = width > height ? 'horizontal' : 'vertical';
  
  console.log(`Fetching image for topic: ${topic}` + " \torientation: " + orientation);
  // replace all spaces with '+' for the API call
  topic = topic.replace(/ /g, '+');

  const response = await fetch(`https://pixabay.com/api/?key=44651696-fb16f33f4e495b9a42868696c&q=${topic}&orientation=${orientation}&image_type=photo&per_page=20`);
  const data = await response.json();
  console.log("fezched image");
  
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
  array = ["Sacramento", "Dancing Script", "Tangerine", "Reenie Beanie", "Mrs Saint Delafield", "Coming Soon", "Cedarville Cursive", "Petit Formal Script", "Zeyada", "Just Me Again Down Here"]
  random = Math.floor(Math.random() * array.length);
  return array[random];
}

function init(){

  console.log("init")
  if(running)
    return;
  
  running = true;
  var loader = document.getElementsByClassName("loader")[0];
  loader.style.display = "block";

  randomBg("Nature+landscape");
  console.log("fetched bg")

  var div = document.getElementById("bibelspruch");
  div.style.display = "none";

  tempZitate = 1.0;
  tempNamen = 1.0;

  generate(
    input="Vorallem behüte dein Herz, denn es hat den größten Einfluss auf dein Leben!*Seid niemandem etwas schuldig, außer dass ihr euch untereinander liebt; denn wer den andern liebt, der hat das Gesetz erfüllt.*Der Herr ist nahe denen, die zerbrochenen Herzens sind, und er hilft denen, die zerschlagenen Geistes sind.*Er heilt, die zerbrochenen Herzens sind, und verbindet ihre Wunden.*Glaube, Hoffnung und Liebe, diese drei bleiben. Aber am größten ist die Liebe.*Gelobt sei der Herr täglich. Gott legt uns eine Last auf, aber er hilft uns auch.*Gott ist die Liebe und wer in der Liebe bleibt, der bleibt in Gott und Gott in ihm.*Der Herr ist mein Licht und mein Heil; vor wem sollte ich mich fürchten! Der Herr ist meines Lebens Kraft; vor wem sollte mir grauen!*Ich behalte dein Wort in meinen Herzen damit ich nicht wieder dich sündige.*Ein frohes Herz macht ein glückliches Gesicht; ein gebrochenes Herz betrübt den Geist.Sei mutig und entschlossen! Lass dich nicht einschüchtern, und hab keine Angst! Denn ich, der Herr, dein Gott, bin bei dir, wohin du auch gehst.*",
    temperature=tempZitate, 
    followFunction=neuerSpruch, 
    max_length=185);

  generate(
    "Jesaia*Jeremia*Baruch*Daniel*Hosea*Joel*Amos*Haggai*Zacharias*Malachias*Matthäus*Markus*Obadiah*Jonah*Micah*Johannes*Nahum*Lukas*Habakuk*Zephaniah*Ezechiel*",
      temperature=tempNamen, 
      followFunction=neuerAutor, 
      max_length=30);

  if(background)
    card_bg = document.getElementById("bg2");
  else card_bg = document.getElementById("bg1");  
  addCard(
    document.getElementById("spruch").innerHTML,
    document.getElementById("autor").innerHTML,
    document.getElementById("bibelspruch").style.fontFamily,
    card_bg.style.backgroundImage,
  )
}


function neuerSpruch(text){
  var spruch = document.getElementById("spruch");
  spruch.innerHTML = text;

  var div = document.getElementById("bibelspruch");
  div.style.fontFamily = randomFont();
  
  if(autor_g)
    show_new();
  else
    spruch_g = true;
}

function neuerAutor(text){
  var autor = document.getElementById("autor");
  autor.innerHTML = text + " " + (Math.floor(Math.random() * 38) + 1) + ":" + (Math.floor(Math.random() * 38) + 1);
  
  if(spruch_g)
    show_new();
  else
    autor_g = true;
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

  var div = document.getElementById("bibelspruch");
  div.style.display = "grid";

  var loader = document.getElementsByClassName("loader")[0];
  loader.style.display = "none";

  spruch_g = false;
  autor_g = false;
  running = false;

}

function addCard(text, author, font, img){
  var div = document.getElementById("history");
  div.innerHTML = "<div class='card' style='background-image:" + img + ";font-family:" + font + ";'><h5 class'card-text'>" + text + "</h5><p class='card-author'>" + author + "</p></div>" + div.innerHTML;
}

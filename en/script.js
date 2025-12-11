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
function randomTopic(){
  array = ["Beer", "Alcohol", "Cocktail", "Alcohol", "Liqour", "Pub", "Beer", "Beer", "Bier", "Booze", "Gin", "Aperol", "Whiskey", "Vodka", "Tequila", "Wine"]
  random = Math.floor(Math.random() * array.length);
  return array[random];
}
// ------------------------------------------------------------------------------------------------------------
var background = false;
randomBg("Beer");
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


var whatsapp_btn = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
  width="24" height="24"
  viewBox="0 0 24 24"
  style=" fill:#fff;">    <path d="M 12.011719 2 C 6.5057187 2 2.0234844 6.478375 2.0214844 11.984375 C 2.0204844 13.744375 2.4814687 15.462563 3.3554688 16.976562 L 2 22 L 7.2324219 20.763672 C 8.6914219 21.559672 10.333859 21.977516 12.005859 21.978516 L 12.009766 21.978516 C 17.514766 21.978516 21.995047 17.499141 21.998047 11.994141 C 22.000047 9.3251406 20.962172 6.8157344 19.076172 4.9277344 C 17.190172 3.0407344 14.683719 2.001 12.011719 2 z M 12.009766 4 C 14.145766 4.001 16.153109 4.8337969 17.662109 6.3417969 C 19.171109 7.8517969 20.000047 9.8581875 19.998047 11.992188 C 19.996047 16.396187 16.413812 19.978516 12.007812 19.978516 C 10.674812 19.977516 9.3544062 19.642812 8.1914062 19.007812 L 7.5175781 18.640625 L 6.7734375 18.816406 L 4.8046875 19.28125 L 5.2851562 17.496094 L 5.5019531 16.695312 L 5.0878906 15.976562 C 4.3898906 14.768562 4.0204844 13.387375 4.0214844 11.984375 C 4.0234844 7.582375 7.6067656 4 12.009766 4 z M 8.4765625 7.375 C 8.3095625 7.375 8.0395469 7.4375 7.8105469 7.6875 C 7.5815469 7.9365 6.9355469 8.5395781 6.9355469 9.7675781 C 6.9355469 10.995578 7.8300781 12.182609 7.9550781 12.349609 C 8.0790781 12.515609 9.68175 15.115234 12.21875 16.115234 C 14.32675 16.946234 14.754891 16.782234 15.212891 16.740234 C 15.670891 16.699234 16.690438 16.137687 16.898438 15.554688 C 17.106437 14.971687 17.106922 14.470187 17.044922 14.367188 C 16.982922 14.263188 16.816406 14.201172 16.566406 14.076172 C 16.317406 13.951172 15.090328 13.348625 14.861328 13.265625 C 14.632328 13.182625 14.464828 13.140625 14.298828 13.390625 C 14.132828 13.640625 13.655766 14.201187 13.509766 14.367188 C 13.363766 14.534188 13.21875 14.556641 12.96875 14.431641 C 12.71875 14.305641 11.914938 14.041406 10.960938 13.191406 C 10.218937 12.530406 9.7182656 11.714844 9.5722656 11.464844 C 9.4272656 11.215844 9.5585938 11.079078 9.6835938 10.955078 C 9.7955938 10.843078 9.9316406 10.663578 10.056641 10.517578 C 10.180641 10.371578 10.223641 10.267562 10.306641 10.101562 C 10.389641 9.9355625 10.347156 9.7890625 10.285156 9.6640625 C 10.223156 9.5390625 9.737625 8.3065 9.515625 7.8125 C 9.328625 7.3975 9.131125 7.3878594 8.953125 7.3808594 C 8.808125 7.3748594 8.6425625 7.375 8.4765625 7.375 z"></path></svg>`;
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
function generate() {
  document.getElementById("info-toggle").checked = true;
  document.getElementsByClassName("loader")[0].style.display = "block";
  randomBg(randomTopic());
  var output = "";
  var temperature = 0.9 + (Math.random() * 0.2)

  query({
    model: "DiscoResearch/Llama3-German-8B",
    prompt: "get drunk*take some painkillers and lie dormant in a dark room*get really wasted*get to know the owner of your local bar*get absolutely smashed*lick the label of another drink*pour ourselves another one*get fucked up*become as plastered as a pub floor*get completely knocked off our feet*get hammered*become one with the sofa cushions*get completely wrecked*gulp down an entire bottle of spirits*become a couple of dopes*slump down some beverages*get carried down the beer river*have a bit too much to drink*weep in drunken glee*become incredibly obnoxious to our loved ones*be tipsy*turn into an emotional sot*pierce the roof*get sloshed*throw something heavy at some passing people we don't know*get completely shitfaced*dye your face*forfeit every shred of dignity*get completely blotto*get the runs and the shakes*puke, puke, puke all over everything*overindulge in something to the detriment of our minds and/or bodies*sink to the bottom of the bottle*drink ourselves into oblivion*end up in the gorse*squirm and smile at some of said drinking-related activities undertaken by others*gulp all of it down*get a bit loopy*crumble like an old, decaying sand castle*get lost down our old paths*be the jessie-wagger of the night*soak in lager and ale*take up a hobby that's related to booze*smile or make sarcastic comments on that person's choice of lifestyle decisions*become the barmaker's nemesis*sit in the corner, glazed*have a bit too much ... for too long ... and no toilet at all*wear shoes without socks and be an absolute tit about it*befoul the public areas of pubs*",
    max_tokens: 70,
    temperature: temperature,
    
  }).then((response) => {
    
    
    
    // if (output.startsWith('{"error":')) {
      
    //   // create a popup with the error message, and a button to reload the page
    //   var popup = document.createElement("div");
    //   popup.setAttribute("id", "popup");
    //   var message = document.createElement("div");
    //   message.setAttribute("id", "message");
    //   message.innerHTML = "Apologies mate, looks like the server is currently having a hard time keeping up, but don't we all sometimes?<br /><br />Maybe try again later, or just try refreshing the page.<br />";
    //   var button = document.createElement("button");
    //   button.setAttribute("id", "reload");
    //   button.innerHTML = "Reload";
    //   popup.appendChild(message);
    //   popup.appendChild(button);
      

    //   document.body.appendChild(popup);
    //   // add an event listener to the button to reload the page
    //   document.getElementById("reload").addEventListener("click", function () {
    //     window.location.reload();
    //   });
    //   // black out the background
      
    //   // hide the loader
    //   document.getElementsByClassName("loader")[0].style.display = "none";




    //   return;
    // }



    
     console.log(response);
    //output = JSON.stringify(response);
    //output = response.choices[0].message.content; // for task ChatCompletion
    output = response.choices[0].text; // for task Completion/ TextGeneration
    output = output.replace("\\n", "*");
    
    var sauphemismus = output.split("*")[0];

  
    var nice = 120;
    if (sauphemismus.length > nice || sauphemismus.length < 3 || isNaughty(sauphemismus)) {
      generate();
      return;
    }
    sauphemismus = sauphemismus.replace("sich sich", "sich");
    sauphemismus = sauphemismus.replace("eine eine", "eine");
    sauphemismus = sauphemismus.replace("eine einen", "einen");
    sauphemismus = sauphemismus.replace("eine einem", "einem");
    sauphemismus = sauphemismus.replace("einen eine", "eine");
    sauphemismus = sauphemismus.replace("einen einen", "einen");
    sauphemismus = sauphemismus.replace("einen einem", "einem");
    sauphemismus = sauphemismus.replace("einem eine", "eine");
    sauphemismus = sauphemismus.replace("einem einen", "einen");
    sauphemismus = sauphemismus.replace("einem einem", "einem");
    sauphemismus = sauphemismus.replace("einen in einen", "in einen");
    sauphemismus = sauphemismus.replace("einen in einem", "in einem");
    sauphemismus = sauphemismus.replace("einen als einen", "als einen");
    sauphemismus = sauphemismus.replace("einen als eine", "als eine");
    sauphemismus = sauphemismus.replace("einen mit einem", "mit einem");
    document.getElementsByClassName("loader")[0].style.display = "none";
    //update history
    try {
      var history = document.getElementById("history");
      var last_sauphi = document.getElementById("sauphemismus").innerHTML;
      last_sauphi = last_sauphi.replace("...", "");
      history.innerHTML +=
        '<li><a href="whatsapp://send?text=https://sauphemismus.github.io/en%0a%0aYo, wanna' +
        last_sauphi +
        '">Yo, wanna' +
        last_sauphi +
        "</a></li>";
      history_FIFO();
      document.getElementById("toggle-history").style.display = "flex";
    } catch (e) {}
    document.getElementById("query").innerHTML =
      '<h1 id="sauphemismus">... ' + sauphemismus + "?</h1>";
    document.getElementById(
      "share"
    ).innerHTML = `<button class="button2" style="border-bottom: 0.2em solid #fff;" onclick="location.href='whatsapp://send?text=https://sauphemismus.github.io/en%0a%0aYo, wanna ${sauphemismus}?';" id="whatsapp">
      ${whatsapp_btn}
      <p>Invite</p>  
        </button>`;
    
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
  });
}
function history_FIFO() {
  var list = document.getElementById("history");
  var items = list.getElementsByTagName("li");
  var i = items.length;
  if (i > 3) list.removeChild(items[0]);
  return;
}
function toggle_history() {
  var arrow_left = document.getElementsByClassName("arrow-left")[0];
  var arrow_right = document.getElementsByClassName("arrow-right")[0];
  var list = document.getElementById("history");
  if (list.style.display == "none") {
    list.style.display = "flex";
    arrow_left.style.transform = "rotate(-45deg)";
    arrow_right.style.transform = "rotate(45deg)";
  } else {
    list.style.display = "none";
    arrow_left.style.transform = "rotate(45deg)";
    arrow_right.style.transform = "rotate(-45deg)";
  }
}
// check if any string in array is substring of another
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

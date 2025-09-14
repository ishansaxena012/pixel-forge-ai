console.log("Script loaded successfully.");
// --- DOM Element Selection ---
const themeToggle = document.querySelector(".theme-toggle");
const promptBtn = document.querySelector(".prompt-btn");
const promptInput = document.querySelector(".prompt-input");
const promptForm = document.querySelector(".prompt-form");
const modelSelect = document.getElementById("model-select");
const countSelect = document.getElementById("count-select");
const ratioSelect = document.getElementById("ratio-select");
const gridGallery = document.querySelector(".gallery-grid");
const generateBtn = document.querySelector(".generate-btn");

//enter your own huggingface API key here
const API_KEY = "";
if (!API_KEY) {
  alert(
    "Help the developer to afford an API_KEY for you OR if you own one add it."
  );
}
console.log(modelSelect);
const examplePrompts = [
  // Sci-Fi & Cyberpunk
  "A bio-mechanical whale swimming through the rings of Saturn, digital art.",
  "A neon-drenched cyberpunk alleyway in the rain, with a lone figure looking at holographic ads, cinematic lighting.",
  "An abandoned space station orbiting a red giant star, eerie atmosphere.",
  "A robot detective in a trench coat, examining clues in a futuristic city, film noir style.",
  "A high-tech greenhouse on a lunar base, with an elven botanist tending to glowing plants.",

  // Fantasy & Adventure
  "A city built on the back of a colossal, cosmic turtle, fantasy painting.",
  "A knight in obsidian armor with a sword of pure light, standing on a volcanic peak.",
  "An ancient, moss-covered golem sleeping in a forgotten forest.",
  "A floating marketplace in the clouds, with airships and fantastical creatures, vibrant colors.",
  "A dwarven forge deep within a mountain, with rivers of molten gold, epic.",

  // Surreal & Abstract
  "A grand piano made of melting ice on a desert salt flat at twilight.",
  "A staircase made of clouds leading up to a clock-faced moon, surrealism.",
  "A human heart made of intricate clockwork gears and glowing tubes.",
  "A teacup containing a miniature stormy ocean with a tiny ship.",
  "An island that is a giant, sleeping cat, covered in trees and grass.",

  // Characters & Portraits
  "A space pirate captain with a robotic arm and a pet alien parrot on her shoulder, studio portrait.",
  "A wise old wizard with a long beard made of swirling galaxy patterns.",
  "A cyberpunk street samurai with neon katanas, dynamic pose.",
  "A forest nymph with skin like tree bark and hair made of leaves and flowers, photorealistic.",
  "An elegant vampire countess in a gothic ballroom, holding a glass of red wine.",

  // Charming & Whimsical
  "A fox in a tiny tweed suit and spectacles, reading a book in a sunlit clearing.",
  "A miniature world inside a glass terrarium, with tiny houses and people.",
  "A friendly dragon sharing a cup of tea with a knight in a meadow.",
  "A ghost happily haunting a colorful, modern library.",
  "A city where all the buildings are shaped like giant, delicious cakes and pastries.",

  // Historical & Mythological Fusion
  "Ancient Egyptian gods piloting futuristic spaceships over the Nile, digital painting.",
  "A Viking longship sailing on a sea of swirling nebulae and stars, fantasy art.",
  "Cherry blossom samurai with armor made of porcelain and light, dueling under a blood moon.",
  "A Roman forum on an overgrown, jungle-covered planet, with crumbling statues and alien wildlife.",
  "A majestic Aztec pyramid that is also a complex, humming supercomputer, vibrant colors.",

  // Unique Environments & Landscapes
  "A world where the ground is a trampoline and the trees are made of giant, colorful springs.",
  "The interior of a massive geode, with glowing crystal cities built into the walls.",
  "A tranquil monastery perched on a sheer cliff face behind a massive waterfall.",
  "A desert made of black, magnetic sand with metallic silver cacti, under a green sky.",
  "A cityscape during a festival of floating lanterns, with dragons made of light weaving through the buildings.",

  // Abstract & Conceptual Art
  "The sound of a cello visualized as flowing ribbons of deep blue and purple light.",
  "A dream about flying, represented by fragmented, overlapping feathers and soft clouds.",
  "The concept of 'entropy' as a beautifully decaying clock made of flowers and vines.",
  "A hyper-realistic macro photograph of a dewdrop on a spiderweb, reflecting a tiny forest.",
  "A feeling of pure joy, depicted as an explosion of warm, golden particles and swirling light.",

  // New Character Concepts
  "A librarian who is secretly a dragon, guarding a hoard of ancient, magical books.",
  "A sentient robot made of polished, dark wood and brass, tending to a delicate bonsai tree.",
  "A child astronaut planting a single, glowing flower on a barren asteroid.",
  "A plague doctor whose mask is a beautifully decorated Venetian carnival mask, in a misty alley.",
  "A celestial being whose body is a walking constellation, holding a baby star.",

  // Whimsical & Storybook Scenes
  "A village of tiny mushroom houses with glowing windows, on a mossy log at night.",
  "An old bear in a rocking chair on his porch, knitting a long, colorful scarf.",
  "A group of friendly sloths having a picnic on a cloud.",
  "A mouse knight in shining acorn armor, riding a bumblebee.",
  "A bakery that sells bread and pastries shaped like mythical creatures.",
];

// set themes based on saved prefernces
// IIFE (Immediately Invoked Function Expression)
// Its main job is to intelligently set the correct theme (light or dark) the very moment the page loads
(() => {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const isDarkTheme =
    savedTheme === "dark" || (!savedTheme && systemPrefersDark);
  document.body.classList.toggle("dark-mode", isDarkTheme);
  themeToggle.querySelector("i").className = isDarkTheme
    ? "fa-solid fa-sun"
    : "fa-solid fa-moon";
})();

// switch between dark and light themes
const toggleTheme = () => {
  const isDarkTheme = document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
  themeToggle.querySelector("i").className = isDarkTheme
    ? "fa-solid fa-sun"
    : "fa-solid fa-moon";
};

//calculate image dimensions based on aspect ratio
const getImageDimensions = (aspectRatio, baseSize = 512) => {
  const [width, height] = aspectRatio.split("/").map(Number);
  const scaleFactor = baseSize / Math.sqrt(width * height);

  let calculatedWidth = Math.round(width * scaleFactor);
  let calculatedHeight = Math.round(height * scaleFactor);

  // Ensure dimensions are multiples of 16
  calculatedWidth = Math.floor(calculatedWidth / 16) * 16;
  calculatedHeight = Math.floor(calculatedHeight / 16) * 16;

  return { width: calculatedWidth, height: calculatedHeight };
};

const updateImageCard = (imgIndex, imgUrl, promptText) => {
  const imgCard = document.getElementById(`img-card-${imgIndex}`);
  if (!imgCard) return;

  const fileName = `${promptText.slice(0, 30).replace(/\s/g, "_")}.png`;

  imgCard.classList.remove("loading");
  // --- FIX: Removed invalid comment that breaks the template literal ---
  imgCard.innerHTML = `
            <img src="${imgUrl}" alt="AI generated image of ${promptText}" class="result-img">
            <div class="img-overlay">
                <a href="${imgUrl}" download="${fileName}" class="img-download-btn">
                    <i class="fa-solid fa-download"></i>
                </a>
            </div>`;
};

const generateImages = async (
  selectedModel,
  imageCount,
  aspectRatio,
  promptInput
) => {
  const MODEL_URL = `https://api-inference.huggingface.co/models/${selectedModel}`;
  const { width, height } = getImageDimensions(aspectRatio);

  const imagePromises = Array.from({ length: imageCount }, async (_, index) => {
    try {
      const response = await fetch(MODEL_URL, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "x-use-cache": "false",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: promptInput,
          parameters: { width, height },
          options: { wait_for_models: true, use_cache: false },
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "An unknown error occurred");
      }

      // convert the response to a url object and update the respective image card
      const result = await response.blob();
      updateImageCard(index, URL.createObjectURL(result), promptInput);
    } catch (error) {
      console.error(error);
      // --- FIX: Changed 'i' to the correct variable 'index' ---
      const imgCard = document.getElementById(`img-card-${index}`);
      if (imgCard) {
        imgCard.classList.replace("loading", "error");
        imgCard.querySelector(".status-text").textContent =
          "Generation failed!";
      }
    }
  });

  await Promise.allSettled(imagePromises);
};

// create placeholder cards with loading spinners
const createImageCards = (imageCount, aspectRatio) => {
  gridGallery.innerHTML = "";
  for (let i = 0; i < imageCount; i++) {
    gridGallery.innerHTML += `<div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${aspectRatio.replace(
      "/",
      " / "
    )}">
                <div class="status-container">
                    <div class="spinner"></div>
                    <i class="fa-solid fa-triangle-exclamation error-icon"></i>
                    <p class="status-text">Generating...</p>
                </div>
            </div>`;
  }
};

// handle form submission
const handleFormSubmit = async (e) => {
  e.preventDefault();

  //get form values
  const selectedModel = modelSelect.value;
  const imageCount = parseInt(countSelect.value);
  const aspectRatio = ratioSelect.value;
  const promptText = promptInput.value.trim();

  if (!promptText || !selectedModel || !imageCount || !aspectRatio) {
    alert("Please fill out all the fields.");
    return;
  }

  // --- IMPROVEMENT: Robust button disabling logic ---
  const originalBtnHTML = generateBtn.innerHTML;
  generateBtn.disabled = true;
  generateBtn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

  createImageCards(imageCount, aspectRatio);

  try {
    await generateImages(selectedModel, imageCount, aspectRatio, promptText);
  } catch (error) {
    console.error(
      "An unexpected error occurred during the generation process:",
      error
    );
    alert("An error occurred. Please check the console for details.");
  } finally {
    // This GUARANTEES the button is re-enabled, even if errors occur
    generateBtn.disabled = false;
    generateBtn.innerHTML = originalBtnHTML;
  }
};

//Fill prompt with random example
promptBtn.addEventListener("click", () => {
  const prompt =
    examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
  promptInput.value = prompt;
  promptInput.focus();
});

promptForm.addEventListener("submit", handleFormSubmit);
themeToggle.addEventListener("click", toggleTheme);

import './style.css';
import { generateCombo } from './gemini';

const btn = document.querySelector<HTMLButtonElement>('#generate-btn')!;
const ingredientsInput = document.querySelector<HTMLInputElement>('#ingredients')!;
const moodSelect = document.querySelector<HTMLSelectElement>('#mood')!;
const mealTypeSelect = document.querySelector<HTMLSelectElement>('#meal-type')!;
const dietaryCheckboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
const resultContainer = document.querySelector<HTMLDivElement>('#result')!;

// Initial State for Result Container
resultContainer.innerHTML = `
  <h2 class="dish-name" style="border:none; text-align:center; color: var(--text-dim)">Ready to cook?</h2>
  <p class="dish-desc" style="text-align:center">Tell me what you have, and I'll find something delicious for you.</p>
`;

btn.addEventListener('click', async () => {
  const ingredients = ingredientsInput.value.trim();
  const mood = moodSelect.value;
  const mealType = mealTypeSelect.value;
  const dietary: string[] = [];
  dietaryCheckboxes.forEach(cb => {
    if (cb.checked) dietary.push(cb.value);
  });

  if (!ingredients) {
    alert("Please tell me what ingredients you have in your pantry!");
    return;
  }

  // Set Loading State
  const originalText = btn.innerText;
  btn.innerText = "Finding a recipe...";
  btn.disabled = true;
  const loader = document.createElement('span');
  loader.className = 'loader';
  btn.appendChild(loader);

  resultContainer.classList.remove('visible');

  try {
    const data = await generateCombo(ingredients, mood, dietary, mealType);

    // Render Result
    renderResult(data);
    resultContainer.classList.add('visible');

  } catch (error) {
    console.error(error);
    resultContainer.innerHTML = `<p style="color: #d66a4f; font-weight:bold;">Oh no! Use a bit more simpler ingredients or try again.</p>`;
    resultContainer.classList.add('visible');
  } finally {
    // Reset Button
    btn.innerText = originalText;
    btn.disabled = false;
  }
});

function renderResult(data: any) {
  const ingredientsHtml = data.ingredients.map((ing: any) =>
    `<li class="ingredient-item">
       <span class="amount">${ing.amount}</span> 
       <span class="name">${ing.item}</span>
     </li>`
  ).join('');

  const stepsHtml = data.steps.map((step: string) =>
    `<li class="step-item">${step}</li>`
  ).join('');

  resultContainer.innerHTML = `
    <div class="recipe-header">
      <h2 class="dish-name">${data.name}</h2>
      <div class="meta-row">
        <span>⏱️ ${data.time}</span>
        <span>🔥 ${data.difficulty}</span>
        <span>⚡ ${data.calories} kcal</span>
      </div>
    </div>
    
    <p class="dish-desc">${data.description}</p>
    
    <div class="recipe-content">
      <div class="ingredients-section">
        <h3>Ingredients</h3>
        <ul class="ingredients-list-detail">
          ${ingredientsHtml}
        </ul>
      </div>

      <div class="steps-section">
        <h3>Instructions</h3>
        <ol class="steps-list">
          ${stepsHtml}
        </ol>
      </div>
    </div>

    <div class="dish-reason">
      "${data.reason}"
    </div>
  `;
}

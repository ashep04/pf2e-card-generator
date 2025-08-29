document.addEventListener("DOMContentLoaded", () => 
{
  // Duplicates the card to fill the page
  const grid = document.getElementById("grid");
  const baseCard = document.getElementById("card0");
  const traits = document.getElementById("feat-traits");
  const baseTrait = document.getElementById("baseTrait");

  console.log(baseCard);
  attachButton(baseCard);

  for (let i = 1; i < 8; i++)
  {
    var newCard = baseCard.cloneNode(true);
    newCard.setAttribute("id", `card${i}`);
    grid.appendChild(newCard);
    attachButton(newCard);
  }

  var actionSelects = document.querySelectorAll(".action-cost");
  window.addEventListener("beforeprint", () => 
  {
    actionSelects.forEach(select => resizeSelect(select));
  });

  // Autosizes the font for the feat name
  const maxFontSize = 16;
  const minFontSize = 4;

  window.addEventListener("beforeprint", () => autoSizeFont()); 

  var allSelects = document.querySelectorAll(".action-cost");
  allSelects.forEach(setupSelect);
});

function attachButton(card)
{
  var addButton = card.querySelector(".add-trait");
  addButton.onclick = () => {
    var newTrait = baseTrait.cloneNode(true);
    card.querySelector("#feat-traits").insertBefore(newTrait, addButton);
  };
}

// Resize action cost box
function resizeSelect(select)
{
  var selectedText = select.options[select.selectedIndex].text;

  var span = document.createElement("span");
  var style = getComputedStyle(select, "print")
  span.style.visibility = "hidden";
  span.style.whiteSpace = "nowrap";
  span.style.letterSpacing = style.letterSpacing;
  span.style.fontFamily = style.fontFamily;
  span.style.fontSize = "30px";
  span.textContent = selectedText;
  document.body.appendChild(span);

  select.style.width = span.getBoundingClientRect().width + "px";

  document.body.removeChild(span);
}

function autoSizeFont()
{
  var inputs = document.querySelectorAll(".feat-name");
  inputs.forEach(input => {
    let style = window.getComputedStyle(input)
    let fontSize = maxFontSize;

    input.style.fontSize = fontSize + "pt";

    while (input.scrollWidth > input.clientWidth && fontSize > minFontSize)
    {
      fontSize -= .5;
      input.style.fontSize = fontSize + "pt";
    }

    input.style.fontSize = (fontSize + 1) + "pt";
  });
}

// Changes the select option to the symbol
function setupSelect(select)
{
  let previousOption = select.options[select.selectedIndex];
  [previousOption.text, previousOption.value] = [previousOption.value, previousOption.text];

  select.addEventListener("change", () => 
  {
    var currentOption = select.options[select.selectedIndex];

    [currentOption.text, currentOption.value] = [currentOption.value, currentOption.text];

    [previousOption.text, previousOption.value] = [previousOption.value, previousOption.text];
 
    previousOption = currentOption;
  });
}

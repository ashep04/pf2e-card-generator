const maxFontSize = 16;
const minFontSize = 4;
const actionMap =
{
  "[one-action]": "1",
  "[two-actions]": "2",
  "[three-actions]": "3",
  "[free-action]": "4",
  "[reaction]": "5",
}

document.addEventListener("DOMContentLoaded", () => 
{
  const grid = document.querySelector(".grid");
  const baseCard = document.querySelector(".card");
  const baseHeightened = document.querySelector(".info.heightened").cloneNode(true);

  // Fill out grid of cards
  setupCard(baseCard, baseHeightened);
  for (let i = 1; i < 8; i++)
  {
    var newCard = baseCard.cloneNode(true);
    grid.appendChild(newCard);
    setupCard(newCard, baseHeightened);
  }

  var cards = document.querySelectorAll(".card-inner");
  var actionSelects = document.querySelectorAll(".action-cost");
  var names = document.querySelectorAll(".name");

  window.matchMedia('print').addEventListener('change', (e) => 
  {
    if (e.matches) 
    {
      // On print screen open
      textToSymbol(actionMap);

      actionSelects.forEach(select => resizeSelect(select));
      names.forEach(name => autoSizeFont(name));

      cards.forEach(card => 
      {
        checkOverflow(card);
      });
    }
    else
    {
      // On print screen close
      symbolToText(actionMap);
      document.querySelectorAll("*").forEach(element => 
      {
        // Reset to default styling
        element.style.all = null;
      });
    }
  });
});

function setupCard(card, baseHeightened)
{
  attachHeightenedButton(card, baseHeightened);
  attachTraitButton(card);
  setupSelect(card)
}

// Attach functionality to heightened addition button
function attachHeightenedButton(card, heightened)
{
  var addButton = card.querySelector(".add-heightened");

  addButton.onclick = () =>
  {
    var newHeightened = heightened.cloneNode(true);
    card.querySelector(".possible-final.heightened").insertBefore(newHeightened, addButton);
  };
}

// Attach functionality to trait addition button
function attachTraitButton(card)
{
  var addButton = card.querySelector(".add-trait");
  addButton.onclick = () =>
  {
    card.querySelector("#traits").insertBefore(createTrait(), addButton);
  };
}

function createTrait()
{
  let span = document.createElement("span");
  span.contentEditable = "true";
  span.className = "trait";
  span.setAttribute("type", "text");
  span.setAttribute("size", "1");
  span.setAttribute("autocomplete", "off");
  span.textContent = "Trait";
  return span;
}

// Changes the select option to the symbol
function setupSelect(card)
{
  select = card.querySelector(".action-cost");

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

function textToSymbol(dictionary)
{
    var spans = document.querySelectorAll(".info-input");

    spans.forEach(span => 
    {
      var text = span.textContent;

      for (var [word, mappedWord] of Object.entries(dictionary))
      {
        var escapedWord = word.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp(`${escapedWord}`, 'gi');
        text = text.replace(regex, `<span class="action-text">${mappedWord}</span>`);
      }

      span.innerHTML = text;
    });
}

function symbolToText(dictionary) {
    var spans = document.querySelectorAll(".info-input");

    spans.forEach(span => {
        var html = span.innerHTML;

        for (var [word, mappedWord] of Object.entries(dictionary)) 
        {
            var regex = new RegExp(`<span class="action-text">${mappedWord}</span>`, 'gi');
            html = html.replace(regex, word);
        }

        span.innerHTML = html;
    });
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

function autoSizeFont(name)
{
  name.style.fontSize = maxFontSize + "pt";
  void name.offsetWidth;

  if (name.scrollWidth > name.clientWidth)
  {
    let ratio = name.clientWidth / name.scrollWidth;
    // Account for slight overfill. 
    ratio -= 0.01;
    name.style.fontSize = (maxFontSize * ratio) + "pt";
  }
}

function checkOverflow(card)
{
  var textBoxes = card.querySelectorAll(".info p, .info-input");

  var min = 1;
  var max = 13;
  var iteration = 0;

  while (iteration < 20)
  {
    var mid = (min + max) / 2;
    textBoxes.forEach(box => box.style.fontSize = mid + "px");

    if (card.scrollHeight > card.clientHeight)
    {
      max = mid;
    }
    else
    {
      min = mid; 
    }

    iteration++;
  }

  textBoxes.forEach(box => box.style.fontSize = min + "px");
}

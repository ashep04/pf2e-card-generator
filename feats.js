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
  const grid = document.getElementById("grid");
  const baseCard = document.getElementById("card0");
  const traits = document.getElementById("feat-traits");
  const baseTrait = document.getElementById("baseTrait");

  attachButton(baseCard);
  for (let i = 1; i < 8; i++)
  {
    var newCard = baseCard.cloneNode(true);
    newCard.setAttribute("id", `card${i}`);
    grid.appendChild(newCard);
    attachButton(newCard);
  }
  const featCards = document.querySelectorAll(".feat-card-inner");

  var actionSelects = document.querySelectorAll(".action-cost");
  var featNames = document.querySelectorAll(".feat-name");
  window.addEventListener("beforeprint", () => 
  {
    actionSelects.forEach(select => resizeSelect(select));
  });

  window.matchMedia('print').addEventListener('change', (e) => 
  {
    if (e.matches) 
    {
      featNames.forEach(name => autoSizeFont(name));
      featCards.forEach(card => 
      {
        replaceSymbols(card, actionMap);
        checkOverflow(card);
      });
    }
    else
    {
      featCards.forEach(card => 
      {
        restoreSymbols(card, actionMap);
      });
      document.querySelectorAll("*").forEach(element => 
      {
        element.style.all = null;
      });
    }
  });

  var allSelects = document.querySelectorAll(".action-cost");
  allSelects.forEach(setupSelect);
});

function replaceSymbols(card, dictionary)
{
    var spans = card.querySelectorAll(".feat-info-input");

    spans.forEach(span => 
    {
      var text = span.textContent;

      for (var [word, mappedWord] of Object.entries(dictionary))
      {
        var escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var regex = new RegExp(`${escapedWord}`, 'gi');
        text = text.replace(regex, `<span class="action-text">${mappedWord}</span>`);
      }

      span.innerHTML = text;
    });
}

function restoreSymbols(card, dictionary) {
    var spans = card.querySelectorAll(".feat-info-input");

    spans.forEach(span => {
        var html = span.innerHTML;

        console.log(html);
        for (var [word, mappedWord] of Object.entries(dictionary)) 
        {
            var regex = new RegExp(`<span class="action-text">${mappedWord}</span>`, 'gi');
            html = html.replace(regex, word);
        }

        span.innerHTML = html;
    });
}

function checkOverflow(card)
{
  var textBoxes = card.querySelectorAll(".feat-info p, .feat-info-input");

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

// Attach functionality for trait addition buttons
function attachButton(card)
{
  var addButton = card.querySelector(".add-trait");
  addButton.onclick = () => {
    card.querySelector("#feat-traits").insertBefore(createTrait(), addButton);
  };
}

function createTrait()
{
  const span = document.createElement("span");
  span.contentEditable = "true";
  span.className = "feat-trait";
  span.setAttribute("type", "text");
  span.setAttribute("size", "1");
  span.setAttribute("autocomplete", "off");
  span.textContent = "Trait";
  return span;
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

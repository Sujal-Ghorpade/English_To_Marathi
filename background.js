chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translateText",
    title: "Translate to Marathi",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translateText" && info.selectionText) {
    fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        info.selectionText
      )}&langpair=en|mr`
    )
      .then((response) => response.json())
      .then((data) => {
        const translatedText = data.responseData.translatedText;

        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (selection, translation) => {
            // Create a div for displaying translation
            const translationDiv = document.createElement("div");
            translationDiv.style.position = "fixed";
            translationDiv.style.bottom = "10px";
            translationDiv.style.right = "10px";
            translationDiv.style.backgroundColor = "#f0f8ff";
            translationDiv.style.color = "#333";
            translationDiv.style.border = "1px solid #ccc";
            translationDiv.style.padding = "10px";
            translationDiv.style.borderRadius = "8px";
            translationDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
            translationDiv.style.zIndex = "9999";
            translationDiv.innerHTML = `
              <b>Translation:</b> <br />
              <p><i>Selected text:</i> ${selection}</p>
              <p><i>Marathi:</i> ${translation}</p>
              <a href="https://www.linkedin.com/in/sujalghorpade01" target="_blank"
              style="position: absolute;
              bottom: 10px;
              right: 5px;
        ">
          <img src="https://sujal02portfolio.web.app/images/hero.jpg" style="width: 55px;" />
        </a>
              <p><i>Created by Sujal Sanjay Ghorpade</i></p>
            `;

            // Add close button
            const closeButton = document.createElement("button");
            closeButton.textContent = "Close";
            closeButton.style.marginTop = "5px";
            closeButton.style.padding = "5px";
            closeButton.style.border = "none";
            closeButton.style.background = "#333";
            closeButton.style.color = "#fff";
            closeButton.style.borderRadius = "5px";
            closeButton.style.cursor = "pointer";
            closeButton.onclick = () => translationDiv.remove();

            translationDiv.appendChild(closeButton);
            document.body.appendChild(translationDiv);
          },
          args: [info.selectionText, translatedText],
        });
      })
      .catch((error) => console.error("Translation error:", error));
  }
});

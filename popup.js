let zoomFactor = 1.0; // Initial zoom level
let contrastValue = 1.0; // Initial contrast level

// Function to zoom the page
function zoomPage(factorChange) {
    zoomFactor += factorChange;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (zoomFactor) => {
                document.body.style.zoom = zoomFactor;
            },
            args: [zoomFactor]
        });
    });
}

// Function to change contrast
function changeContrast(contrast) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: (contrast) => {
                document.body.style.filter = `contrast(${contrast})`;
            },
            args: [contrast]
        });
    });
}

// Function to change background color
function changeBackgroundColor(color) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: (color) => {
                document.documentElement.style.backgroundColor = color; // Change document background
                document.body.style.backgroundColor = color; // Change body background
            },
            args: [color]
        });
    });
}

// Event Listeners for the buttons and inputs
document.getElementById('magnify').addEventListener('click', () => {
    zoomPage(0.1); // Increase zoom by 10%
});

document.getElementById('reduce').addEventListener('click', () => {
    zoomPage(-0.1); // Decrease zoom by 10%
});

document.getElementById('contrastIncrease').addEventListener('click', () => {
    contrastValue += 0.1;
    changeContrast(contrastValue);
});

document.getElementById('contrastDecrease').addEventListener('click', () => {
    contrastValue = Math.max(0.5, contrastValue - 0.1); // Prevent going below 0.5
    changeContrast(contrastValue);
});

document.getElementById('contrast').addEventListener('input', (event) => {
    const contrast = event.target.value;
    changeContrast(contrast);
});

document.getElementById('bgcolor').addEventListener('input', (event) => {
    const color = event.target.value;
    changeBackgroundColor(color);
});

// Updated "log.js"

function appendToLog(message) {
    const logText = document.querySelector("#log-text");
    if (logText) {
        const logEntry = document.createElement("p");
        logEntry.textContent = message;
        logText.appendChild(logEntry);
        logText.scrollTop = logText.scrollHeight;
    } else {
        console.error("Log text element not found.");
    }
}

function clearLog() {
    const logText = document.querySelector("#log-text");
    if (logText) {
        logText.innerHTML = "";
    } else {
        console.error("Log text element not found.");
    }
}

export {
    appendToLog,
    clearLog
};

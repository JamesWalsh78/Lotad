// log.js

export function appendToLog(message) {
    const logText = document.querySelector("#log-text");
    if (logText) {
        const logEntry = document.createElement("p");
        logEntry.textContent = message;
        logText.appendChild(logEntry);
        logText.scrollTop = logText.scrollHeight;
    }
}

const log = [];

export function logEvent(message) {
  log.push(message);
  console.log(message); // Print to console for now
  const logDiv = document.getElementById("log");
  logDiv.innerHTML += `<p>${message}</p>`;
}

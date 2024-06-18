// Dans l'extension
chrome.tabs.executeScript(tabId, { file: 'MathJax.js' }, function (result) {
    // Traitement du résultat renvoyé par la page web
    console.log('Résultat de MathJax:', result);
});

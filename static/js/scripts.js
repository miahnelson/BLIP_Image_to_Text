document.addEventListener('paste', function (event) {
    var items = event.clipboardData.items;
    for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            var blob = items[i].getAsFile();
            var reader = new FileReader();
            reader.onload = function(event) {
                var pastedImage = event.target.result;
                var pasteBox = document.getElementById('pasteBox');
                pasteBox.innerHTML = '';
                var img = document.createElement('img');
                img.src = pastedImage;
                pasteBox.appendChild(img);
                document.getElementById('analyzeButton').disabled = false;
            };
            reader.readAsDataURL(blob);
        }
    }
});

document.getElementById('analyzeButton').addEventListener('click', function() {
    var pastedImage = document.querySelector('#pasteBox img').src;
    var selectedModels = Array.from(document.querySelectorAll('input[name="blip_models"]:checked')).map(checkbox => checkbox.value);
    document.getElementById('progress').style.visibility = 'visible'; // Show progress animation
    fetch('/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: pastedImage, blip_models: selectedModels })
    })
    .then(response => response.json())
    .then(data => {
        var combinedResults = [];
        data.forEach(function(result) {
            var resultText = result.blip_prompt.replace(/[^a-zA-Z ]/g, ""); // Removing non-alpha characters
            var words = resultText.split(' ');
            words.forEach(function(word) {
                if (!combinedResults.includes(word)) {
                    combinedResults.push(word);
                }
            });
            var resultCell = document.getElementById('result_' + result.model_id);
            resultCell.textContent = result.blip_prompt;
        });
        var finalText = combinedResults.join(' ');
        document.getElementById('resultsText').textContent = finalText;
        document.getElementById('progress').style.visibility = 'hidden'; // Hide progress animation after processing
    })
    .catch(function(error) {
        console.error('Error:', error);
        document.getElementById('progress').style.visibility = 'hidden'; // Hide progress animation in case of error
    });
});

function copyToClipboard(elementId) {
    var text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(function() {
        console.log('Copied to clipboard successfully!');
    }, function(err) {
        console.error('Unable to copy to clipboard: ', err);
    });
}

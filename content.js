function resetExercice() {
    const container = document.querySelector(".g-col-12.g-col-md-9.g-col-xl-10");
    container.style.display = "block";

    const nodes = Array.from(container.childNodes);

    const type = container.querySelector('.ms-2.svg-black-white') ? "check" : "input";
    console.log(type);

    // List to store the answers
    const answers = [];

    let ensembleReponse = "" // Used to store the "On demande une réponse entière"

    container.querySelectorAll('.ms-2.svg-black-white').forEach(element => {
        answers.push(true); // TRUE for correct answers
    });

    // Detect the answer and store it
    let isAnswerDetected = false;
    let isAnswerFound = [false, false]; // [Is "Réponse" found, is the answer found]
    const removedItems = [];

    nodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.textContent.includes("Vous avez résolu")) {
            isAnswerDetected = true;
        }

        if (isAnswerDetected) {
            if (type === "input") {
                if (!isAnswerFound[1] && node.nodeType === Node.ELEMENT_NODE) {
                    if (node.textContent === "Réponse") {
                        console.log(node.textContent);
                        isAnswerFound[0] = true;
                    } else if (isAnswerFound[0] && node.nodeName === "P") {
                        let spanText = node.querySelector("span").textContent;
                        answers.push(spanText);

                        let clonedNode = node.cloneNode(true);
                        clonedNode.querySelector("span").remove();

                        let textAfterSpan = clonedNode.innerHTML.trim();
                        ensembleReponse = textAfterSpan.replace(/[()]/g, "").trim();


                        isAnswerFound[1] = true;
                    }
                }
            }
            removedItems.push(node);
            node.remove();
        }
    });

    if (!isAnswerDetected) {
        alert("THIS EXERCICE HAS NOT BEEN SOLVED YET");
        return;
    }

    // Create the new input for the solution
    if (type === "input") {
        const formHtml = `
            <p class="mt-3">${ensembleReponse}</p>
            <form class="new_unsolvedquestion" id="new_unsolvedquestion" action="" accept-charset="UTF-8" method="post">
                <input type="hidden" name="authenticity_token" value="s9yxGkx86BEjuKUjEc_7vVnL6EF4OW5Wz-726A4I3xb5prKMsRa5TGFw3IMfhDZRTv92h4BVx8oSA_wqSTep9A" autocomplete="off">
                <input type="hidden" name="question_id" id="question_id" value="267" autocomplete="off">
                <div class="mb-2">
                    <label class="form-label to-enable" for="unsolvedquestion_guess">Votre réponse</label>
                    <input class="form-control to-enable ms-1" style="width:70px;" type="text" name="unsolvedquestion[guess]" id="unsolvedquestion_guess">
                </div>
                <input type="submit" name="commit" value="Soumettre" class="btn btn-primary to-enable" data-disable-with="Soumettre">
            </form>
        `;
        container.insertAdjacentHTML('beforeend', formHtml);
        const form = document.getElementById('new_unsolvedquestion');
        
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const userAnswer = document.getElementById('unsolvedquestion_guess').value.trim();
            const correctAnswer = answers[answers.length - 1]; // Assuming the last answer is the correct one

            if (userAnswer === correctAnswer) {
                // Remove the input and display the correct answer
                form.remove();
                removedItems.forEach(item => {
                    container.appendChild(item);

                })
            } else {
                alert('Incorrect answer. Please try again.');
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", resetExercice);

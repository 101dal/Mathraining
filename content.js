function addResetBtn(container, exerciseId) {
    // Add the reset button at the end of the exercice
    const solvedExercises = JSON.parse(localStorage.getItem('solvedExercises')) || {};
    const button = document.createElement("button");
    button.textContent = "Reset"
    button.classList.add("btn");
    button.classList.add("btn-primary");
    button.classList.add("to-enable");
    button.addEventListener("click", () => {
        solvedExercises[exerciseId] = false;
        localStorage.setItem("solvedExercises", JSON.stringify(solvedExercises));

        window.location.reload();
    });
    container.appendChild(button);

    return
}

function resetExercice(exerciseId, solvedExercises, container) {
    container.style.display = "block";

    const nodes = Array.from(container.childNodes);

    const checks = container.querySelectorAll('.ms-2.svg-black-white')

    let type = "";

    if (!(checks.length === 0)) {
        if (checks.length > 1) {
            type = "check";
        } else {
            type = "radio"
        }
    } else {
        type = "input"
    }

    // List to store the answers
    const answers = [];

    let ensembleReponse = ""; // Used to store the "On demande une réponse entière"

    // Store the answer and remove it from the user's view
    container.querySelectorAll('li.p-1').forEach(element => {
        const image = element.querySelector("img.ms-2.svg-black-white");
        let text = "x-mid";

        if (image) {
            text = image.getAttribute("src");
        }

        // Clone the parent element and remove the image
        const parentElement = element.cloneNode(true);
        const imgElement = parentElement.querySelector('img.ms-2.svg-black-white');
        if (imgElement) {
            imgElement.remove();
        }

        // Get the innerHTML before the image
        const textElement = parentElement.innerHTML.trim();

        if (text.includes("x-mid") || !text) {
            answers.push([false, textElement]);
        } else {
            answers.push([true, textElement]);
        }
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
            removedItems.push(node.cloneNode(true));
            node.remove();
        }
    });

    if (answers.length === 0) {
        type = ""
    }

    const formHtml = (type === "input") ? `
            <p class="mt-3">${ensembleReponse}</p>
            <form class="new_unsolvedquestion" id="new_unsolvedquestion" action="" accept-charset="UTF-8" method="post">
                <div class="mb-2">
                    <label class="form-label to-enable" for="unsolvedquestion_guess">Votre réponse</label>
                    <input class="form-control to-enable ms-1" style="width:70px;" type="text" name="unsolvedquestion[guess]" id="unsolvedquestion_guess">
                </div>
                <button type="submit" name="commit" class="btn btn-primary to-enable">Soumettre</button>
            </form>
        ` : `
            <p class="mt-3 mb-3 fw-bold">Cochez chaque proposition correcte.</p>
            <form class="new_unsolvedquestion" id="new_unsolvedquestion" action="" accept-charset="UTF-8" method="post">
                ${answers.map((answer, index) => `
                    <div class="form-check mb-2">
                        <label class="form-check-label ms-2">
                            <input type="${(type === "check") ? "checkbox" : "radio"}" name="${(type === "check") ? "ans[" + index + "]" : "ans"}" value="${(type === "check") ? "ok" : index}" class="form-check-input to-enable">
                            ${answer[1]}
                        </label>
                    </div>
                `).join('')}
                <button type="submit" name="commit" class="btn btn-primary to-enable">Soumettre</button>
            </form>
        `;

    container.insertAdjacentHTML('beforeend', formHtml);
    const form = document.getElementById('new_unsolvedquestion');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const userAnswers = [];
        form.querySelectorAll('input').forEach(input => {
            userAnswers.push((type === "input") ? input.value.trim() : input.checked);
        });

        // An array with all the correct answers
        const correctAnswers = (type === "input") ? answers : answers.map(answers => answers[0]);

        console.log(correctAnswers);
        console.log(userAnswers);

        if (JSON.stringify(userAnswers) === JSON.stringify(correctAnswers)) {
            // Store the solved exercise in localStorage
            solvedExercises[exerciseId] = true;
            localStorage.setItem('solvedExercises', JSON.stringify(solvedExercises));

            // Remove the input and display the correct answer
            form.remove();
            removedItems.forEach(item => {
                container.appendChild(item);
            });

            addResetBtn(container, exerciseId);

        } else {
            alert('Incorrect answer. Please try again.');
        }

    });
}

document.addEventListener("DOMContentLoaded", () => {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    // Check if the current page is and exercice
    const currentUrl = window.location.href;

    const url = new URL(currentUrl);

    const pageType = url.searchParams.get("type");

    if (pageType !== "5") {
        container.style.display = "block";
        return;
    }

    // Check if the current exercice has already been solved
    const exerciseId = url.searchParams.get("which");
    const solvedExercises = JSON.parse(localStorage.getItem('solvedExercises')) || {};

    if (solvedExercises[exerciseId]) {
        const container = document.querySelector(".g-col-12.g-col-md-9.g-col-xl-10");
        container.style.display = "block";
        addResetBtn(container, exerciseId);
        return;
    }

    // setTimeout(() => {
    resetExercice(exerciseId, solvedExercises, container);
    // }, 1000);
});

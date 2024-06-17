function removeAllAfter() {
    const container = document.querySelector(".g-col-12.g-col-md-9.g-col-xl-10");
    container.style.display = "block";
    if (!container) return;

    let isAnswerDetected = [false, false]; // Variable to store the answer status (isDetected, isStored)
    let answer = null; // Variable to store the answer content

    let isDetected = false;
    const solutionNodes = [];

    const nodes = Array.from(container.childNodes);

    nodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("mt-3") && node.classList.contains("fw-bold") && node.classList.contains("text-color-green")) {
            isDetected = true;
        }

        if (isDetected) {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "H4" && node.textContent.trim() === "Réponse") {
                isAnswerDetected[0] = true;
            }
            if (isAnswerDetected[0] && !isAnswerDetected[1]) {
                if (node.nodeName === "P") {
                    answer = node.textContent.trim(); // Store the text content of the <p> element
                    isAnswerDetected[1] = true;
                }
            }

            solutionNodes.push(node);
            node.remove();
        }
    });

    console.log(answer); // Output the answer content for verification





    if (removedNodes.length > 0) {
        const button = document.createElement("button");
        button.textContent = "Show Removed Content";
        button.addEventListener("click", () => {
            removedNodes.forEach((node, style) => { node.style.display = style });
            // removedNodes.forEach(node => container.appendChild(node));
            button.remove(); // Remove the button after restoring the content
        });
        container.appendChild(button);
    }


}

// Run the function
document.addEventListener("DOMContentLoaded", removeAllAfter);

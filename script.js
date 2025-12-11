//https://openrouter.ai/deepseek    /// DeepSeek: R1 Distill Llama 70B
const API_KEY = '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';

const content = document.getElementById('content');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

let isAnswerLoading = false;
let answerSectionId = 0;

sendButton.addEventListener('click', () => handleSendMessage());
chatInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        handleSendMessage();
    }
})

function handleSendMessage() {
    const question = chatInput.value.trim();

    //Prevent sending empty message
    if(question === '' || isAnswerLoading) return;

    //Disable UI send message
    sendButton.classList.add('send-button-nonactive');

    addQuestionSection(question);
    chatInput.value = '';
}

function getAnswer(question) {
    const fetchData =
        fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-r1-distill-llama-70b",
                "messages": [
                    {
                        "role": "user",
                        "content": question
                    }
                ]
            })
        });

    fetchData.then(response => response.json())
        .then(data => {
            //Get response message
            const resultData = data.choices[0].message.content;
            isAnswerLoading = false;
            addAnswerSection(resultData)
        }).finally(() => {
            scrollToButton();
            sendButton.classList.remove('send-button-nonactive');
        })
}

function addQuestionSection(message) {
    isAnswerLoading = true;
    const sectionElement = document.createElement('section');
    sectionElement.className = 'question-section';
    sectionElement.textContent = message;

    content.appendChild(sectionElement);

    // Add answer section after added question section
    addAnswerSection(message);

    scrollToButton();
}

function addAnswerSection(message) {
    if (isAnswerLoading) {
        //Increment answer section ID for tracking
        answerSectionId++;
        //Create and empty answer section with a loading animation
        const sectionElement = document.createElement('section');
        sectionElement.className = 'answer-section';
        sectionElement.innerHTML = getLoadingSvg();
        sectionElement.id = answerSectionId;

        content.appendChild(sectionElement);
        getAnswer(message);
    } else {
        //Fill in the answer once its received
        const answerSectionElement = document.getElementById(answerSectionId);
        answerSectionElement.textContent = message;
    }
}

function getLoadingSvg() {
    return `<svg style="height: 25px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill="#4F6BFE" stroke="#4F6BFE" stroke-width="15" transform-origin="center" d="m148 84.7 13.8-8-10-17.3-13.8 8a50 50 0 0 0-27.4-15.9v-16h-20v16A50 50 0 0 0 63 67.4l-13.8-8-10 17.3 13.8 8a50 50 0 0 0 0 31.7l-13.8 8 10 17.3 13.8-8a50 50 0 0 0 27.5 15.9v16h20v-16a50 50 0 0 0 27.4-15.9l13.8 8 10-17.3-13.8-8a50 50 0 0 0 0-31.7Zm-47.5 50.8a35 35 0 1 1 0-70 35 35 0 0 1 0 70Z"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="0;120" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></path></svg>`;
}

function scrollToButton() {
    content.scrollTo({
        top: content.scrollHeight,
        behavior: 'smooth'
    })
}

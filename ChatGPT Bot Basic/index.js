const API_KEY = "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"
const API_URL = "https://api.openai.com/v1/chat/completions";

const $chatLog = document.getElementById('chat-log');
const $userInput = document.getElementById('user-input');
const $sendButton = document.getElementById('send-button');
const $butttonIcon = document.getElementById('button-icon');

$sendButton.addEventListener('click', sendMessage);

$userInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const message = $userInput.value.trim();
    if (message === '') {
        return;
    }

    appendMessage('user', message);
    $userInput.value = '';

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content" : message }],
            max_tokens: 100,
        }),
    };

    try {
        const response = await fetch(API_URL, options);
        if (!response.ok) {
            throw new Error('Failed to fetch response from server');
        }

        const responseData = await response.json();
        appendMessage('bot', responseData.choices[0].message.content);
        $butttonIcon.classList.add('fa-solid', 'fa-paper-plane');
        $butttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
    } catch(error) {
        console.error("Error: ", error);
        appendMessage('bot', `Error: ${error}`);
    }
}


function appendMessage(sender, message) { 
    $butttonIcon.classList.remove('fa-solid', 'fa-paper-plane');
    $butttonIcon.classList.add('fas', 'fa-spinner', 'fa-pulse');

    const $chatElement = document.createElement('div');
    const $messageElement = document.createElement('div');
    const $iconElement = document.createElement('div');
    const $icon = document.createElement('i');

    $chatElement.classList.add('chat-box');
    $iconElement.classList.add('icon');
    $messageElement.classList.add(sender);

    $messageElement.innerText = message;

    if(sender === 'user') {
        $icon.classList.add('fa-regular', 'fa-user');
        $iconElement.setAttribute('id', 'user-icon');
    } else {
        $icon.classList.add('fa-solid', 'fa-robot');
        $iconElement.setAttribute('id', 'bot-icon');
    }

    $iconElement.appendChild($icon);
    $chatElement.appendChild($iconElement);
    $chatElement.appendChild($messageElement);
    $chatLog.appendChild($chatElement);
}
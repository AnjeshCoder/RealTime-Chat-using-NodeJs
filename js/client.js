
const socket = io('http://localhost:8000');
const form = document.getElementById("send-container")
const messageInput = document.getElementById("messageinput")
const messageContainer = document.querySelector(".container")

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message
    messageElement.classList.add('message')
    messageElement.classList.add(position)
    messageContainer.append(messageElement);
}

// Ask new user his name and let the server know
const Name = prompt("Enter your name to join!")
socket.emit('new-user-joined', Name);

// If a new user joins, receive his name from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right')
})

// If the server sends a message, receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
})

// If someone leaves the chat, append the info to the container
socket.on('left', name => {
    append(`${name} left the chat`, 'right')
})


// If the form gets submitted send the message to the server
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value
    append(`you:${message}`, 'right')
    socket.emit('send', message);
    messageInput.value = ""
})
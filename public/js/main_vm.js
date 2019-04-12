import ChatMessage from './modules/ChatMessage.js';

const socket = io();



function setUserId({sID, message, color}) {
    //debugger;
    console.log('connected', sID, message);
    vm.socketID = sID;
    vm.color = color;

    socket.emit('chat message', {
        id: `System`,
        name: `connected`,
        content: vm.socketID +' has connected to the chat room.' }
    );
}

function appendMessage(message) {
    vm.messages.push(message);
}

function dcMessage(data) {
    socket.emit('chat message', {
        id: `System`,
        name: `disconnect`,
        content: data.id +' left the chat room.' }
    );
}



const vm = new Vue({
    data: {
        socketID: "",
        nickname: "",
        message: "",
        messages: [],
        color: "",
    },

    methods: {
        dispatchMessage() {
            console.log(this.color);
            // send a chat message
            socket.emit('chat message', {
                id: this.socketID,
                content: this.message, 
                name: this.nickname ? this.nickname + ' (' + this.socketID+ ')' : this.socketID,
                color: this.color
            } );
            this.message = "";
        }
    },

    components: {
        newmessage: ChatMessage
    }
}).$mount("#app");





socket.addEventListener('connected', setUserId);
socket.addEventListener('chat message', appendMessage);
socket.addEventListener('disconnect', dcMessage);
export default {
    props: ['msg'],

    template: `
        <p v-if="msg.message.id === 'System'" class="new-message system-message" v-bind:class="msg.message.name">
            <span>{{msg.message.id}} Message:</span>
            {{msg.message.content}}
        </p>
        <p v-else class="new-message" :class="{ 'my-message' : matchedID }" :style="{ background: msg.message.color }">
            <span>{{msg.message.name}} says:</span>
            {{msg.message.content}}
        </p>

    `,

    data: function() {
        return {
            matchedID: this.$parent.socketID == this.msg.id,
        }
    }
}
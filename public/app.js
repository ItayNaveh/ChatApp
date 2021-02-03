import { createApp, ref } from "https://unpkg.com/vue@3.0.5/dist/vue.esm-browser.js";

createApp({
	setup() {
		const signedIn = ref(false);
		const name = ref("");

		let socket;
		const login = () => {
			if (name.value) {
				signedIn.value = true;

				socket = io();
				socket.on("message", (msg) => {
					console.log("Recived msg", msg);
					messages.value.push(msg);
				});
			}
		};
		
		const msg = ref("");
		const messages = ref([]);
		
		const sendMessage = () => {
			if (socket) {
				socket.emit("message", { user: name.value, content: msg.value });
			} else {
				console.log("Tried to send message before socket");
			}
		};

		return {
			signedIn,
			name,
			login,
			msg,
			messages,
			sendMessage,
		};
	}
}).mount("#app");

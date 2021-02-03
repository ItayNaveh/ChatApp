// import { createApp, ref } from "https://unpkg.com/vue@3.0.5/dist/vue.esm-browser.js";
import { createApp, ref } from "https://unpkg.com/vue@3.0.5/dist/vue.esm-browser.prod.js";

createApp({
	setup() {
		const loggedIn = ref(false);
		// const name = ref("");
		const user = ref(null);

		let socket;
		const login = () => {
			// if (name.value) {
			// 	signedIn.value = true;

			// 	socket = io();
			// 	socket.on("message", (msg) => {
			// 		console.log("Recived msg", msg);
			// 		messages.value.push(msg);
			// 	});
			// }
			window.addEventListener("message", async(e) => {
				if (e.origin != "https://github-chat-realtime.herokuapp.com") { // "http://localhost:3000") {
					console.log("invalid origin", e.origin);
				} else {
					user.value = e.data.user;
					loggedIn.value = true;
					socket = io();
					socket.on("message", (msg) => {
						// console.log("Recived msg", msg);
						messages.value.unshift(msg);
					});
				}
			}, { once: true });
			// window.open("https://github.com/login/oauth/authorize?client_id=089eb473578a8e68344e");
			window.open("https://github.com/login/oauth/authorize?client_id=9fa093fb855a5d22e629");
		};
		
		const msg = ref("");
		const messages = ref([]);
		
		const sendMessage = () => {
			if (socket) {
				// socket.emit("message", { user: name.value, content: msg.value });
				socket.emit("message", {
					user: {
						name: user.value.name ?? user.value.login,
						avatar_url: user.value.avatar_url,
					},
					content: msg.value
				});
				msg.value = "";
			} else {
				console.log("Tried to send message before socket");
			}
		};

		return {
			loggedIn,
			// name,
			user,
			login,
			msg,
			messages,
			sendMessage,
		};
	}
}).mount("#app");

import express from "express";
import { Server } from "http";
import { Server as SocketServer } from "socket.io";

const app = express();
const http = new Server(app);
const io = new SocketServer(http);

app.use(express.static("public"));

app.get("/auth", async(req, res) => {
	if (req.query.code) {
		// console.log("code", req.query.code);
		const response = await fetch("https://github.com/login/oauth/access_token", {
			method: "POST",
			headers: { "Content-Type": "application/json", "Accept": "application/json" },
			body: JSON.stringify({
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRET,
				code: req.query.code,
			}),
		});
		const data = await response.json();
		// console.log("data", data);

		// console.log("access token", data.access_token);
		const response2 = await fetch("https://api.github.com/user", {
			headers: { "Authorization": `Token ${data.access_token}` }
		});

		const userData = await response2.json();

		res.send(`
		<h1>Signing In...</h1>
		<script>
			if (window.opener) {
				window.opener.postMessage({ user: ${JSON.stringify(userData)} }, "http://localhost:3000"); //TODO: change the domain
			}
			window.close();
		</script>
		`);
	} else {
		res.json({
			message: "Go Home",
		});
	}
});

io.on("connection", (socket) => {
	socket.on("message", (msg) => {
		io.emit("message", msg);
	});
});

const PORT = process.env.PORT ?? 3000;
http.listen(PORT, () => console.log(`listening at localhost:${PORT}`));

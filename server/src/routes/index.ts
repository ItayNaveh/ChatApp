import { Router } from "express";
import auth from "./auth.js";

const router = Router();

router.get("/", (req, res) => {
	res.json({
		message: "Home 🏠",
	});
});

router.use("/auth", auth);

export default router;

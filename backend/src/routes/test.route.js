import { Router } from "express";
const router = Router();

router.get("/ping", (req, res) => {
  res.json({ success: true, message: "Backend is running 🚀" });
});

export default router;

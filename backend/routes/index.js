import express from "express";
import { getUsers, Register, Login , Logout } from "../controllers/Users.js"; // pastikan path dan nama file benar
import { verifyToken } from "../middleware/VerifyToken.js"; // Import middleware verifikasi token
import { refreshToken } from "../controllers/refreshToken.js";
const router = express.Router();

router.get('/users', verifyToken, getUsers); // Mendefinisikan route untuk GET request di /users, hanya jika token valid
router.post('/users', Register); // Mendefinisikan route untuk POST request di /users
router.post('/login', Login); // Mendefinisikan route untuk POST request di /login
router.get('/token', refreshToken); // Mendefinisikan route untuk POST request di /login
router.delete('/logout', Logout);// delete

export default router;

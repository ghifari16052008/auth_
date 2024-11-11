import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401); // Jika tidak ada refresh token

        const user = await Users.findOne({
            where: {
                refresh_token: refreshToken
            }
        });

        if (!user) return res.sendStatus(403); // Jika user tidak ditemukan

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403); // Jika token tidak valid

            const userId = user.id; // Akses langsung user, bukan user[0]
            const name = user.name;
            const email = user.email;

            const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15s' // Token ini akan berlaku selama 15 detik
            });

            res.json({ accessToken });
        });
    } catch (error) {
        console.error(error); // Log error untuk debugging
        res.sendStatus(500); // Status 500 jika terjadi kesalahan server
    }
};

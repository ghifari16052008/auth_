import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Pisahkan dengan spasi untuk mengambil token

    // Lakukan validasi
    if (token == null) return res.sendStatus(401); // Jika tidak ada token, kirim status 401

    // Jika ada token, lakukan verifikasi JWT
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403); // Token tidak valid, kirim status 403
        req.userId = decoded.userId; // Simpan userId yang ter-decode di req
        next();
    });
};

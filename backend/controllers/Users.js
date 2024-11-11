import Users from "../models/UserModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
export const getUsers = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await Users.findOne({
            where: { id: userId }, // Filter berdasarkan userId
            attributes: ['id', 'name', 'email']
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user); // Kembalikan data pengguna yang ditemukan
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const Register = async (req,res) =>{
    console.log(req.body);
    const {name,email,password,confPassword} = req.body;
    if (password !== confPassword) {
        return res.status(404).json({ msg: 'Password dan confirm password tidak cocok' });
    }
    
    const salt = await bcrypt.genSalt(); // untukmembuat nilai acak sebelum di hash
    const hashPassword = await bcrypt.hash(password,salt) // mengabungkan salt dan password agar tercipta angka + huruf acak
    try {
        await Users.create({
            name: name,
            email : email ,
            password : hashPassword
        })
        res.json({msg:'register berhasil!'})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    
    }
}

export const Login = async(req,res) =>{
    try {
        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password ,user[0].password);
        if(!match) return res.status(400).json({msg:"password salah"});
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({userId,name,email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '30s'
        });
        const refreshtoken = jwt.sign({userId,name,email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refresh_token : refreshtoken}, {
            where: {
               id:userId 
            }
        });
        res.cookie('refreshToken',refreshtoken,{
            httpOnly : true,
            maxAge : 24 * 60 * 60 * 1000,
            // secure : true // tidak usah karna di local
        });
        res.json({accessToken})
    } catch (error) {
        res.status(404).json({msg:
            "email tidak di temukan"
        })
    }
}

export const Logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401); // Jika tidak ada refresh token

        // Temukan pengguna berdasarkan refresh token
        const user = await Users.findOne({
            where: { refresh_token: refreshToken }
        });

        if (!user) return res.sendStatus(403); // Jika pengguna tidak ditemukan

        // Hapus refresh token dari database
        await Users.update(
            { refresh_token: null },
            { where: { refresh_token: refreshToken } }
        );

        res.clearCookie('refreshToken'); // Menghapus refresh token dari cookie
        res.sendStatus(200); // Berhasil logout
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Jika terjadi kesalahan server
    }
};

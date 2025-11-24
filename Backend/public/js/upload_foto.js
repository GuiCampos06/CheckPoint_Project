import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload_foto", upload.single("foto"), (req, res) => {
    res.json({
        sucesso: true,
        arquivo: req.file.filename
    });
});

export default router;
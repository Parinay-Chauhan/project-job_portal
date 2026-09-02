import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // file kaha temporarily save hogi
    cb(null, "./public/temp");
  },

  filename: function (req, file, cb) {
    // file ka naam kya hoga
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage: storage });

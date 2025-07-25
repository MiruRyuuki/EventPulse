const path = require("path");
const fs = require("fs");

// Validate file type (PPT, PDF, DOCX)
const validateFileType = (file) => {
  const fileTypes = /pptx|pdf|docx/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  return extname && mimetype;
};

exports.uploadMaterial = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Check if file is valid (PPT, PDF, DOCX)
  if (!validateFileType(req.file)) {
    return res.status(400).json({ message: "Only PPT, PDF, or DOCX files are allowed" });
  }

  res.status(200).json({
    message: "File uploaded successfully",
    filePath: `/uploads/materials/${req.file.filename}`
  });
};

exports.getMaterials = (req, res) => {
  const directoryPath = path.join(__dirname, "../uploads/materials");

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Unable to scan files" });
    }

    const materials = files.map(file => ({
      name: file,
      url: `/uploads/materials/${file}`
    }));

    res.status(200).json(materials);
  });
};

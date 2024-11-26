const prisma = require('../models/prismaClient');
const path = require('path');

const uploadController = {
  uploadFile: async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded or invalid file type.');
    }

    try {
      // Save file metadata to the database
      const file = await prisma.file.create({
        data: {
          filename: req.file.filename,
          filepath: `/uploads/${req.file.filename}`,
          userId: req.user.id, // Link the file to the logged-in user
        },
      });

      res.status(200).send({
        message: 'File uploaded and saved to database!',
        file,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to save file metadata.');
    }
  },

  getUserFiles: async (req, res) => {
    try {
      // Fetch files for the logged-in user
      const files = await prisma.file.findMany({
        where: { userId: req.user.id },
      });

      res.status(200).send({
        message: 'Files fetched successfully!',
        files,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to fetch files.');
    }
  },
};

module.exports = uploadController;

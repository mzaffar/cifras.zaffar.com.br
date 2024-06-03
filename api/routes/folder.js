const e = require("express");
var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");

router.post("/create", async (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  const folder = `./files/${slugify(req.body.name, { lower: true })}`;

  try {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
      res.status(200).json({
        message: `Folder '${folder}' created successfully`,
      });
    } else {
      res.status(400).json({ error: "Folder already exists" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/list", async (req, res) => {
  const folder = `./files`;

  console.log("folder list");

  if (fs.existsSync(folder)) {
    const folders = fs
      .readdirSync(folder)
      .filter((file) => fs.statSync(`${folder}/${file}`).isDirectory());

    res.status(200).json(folders);
  } else {
    res.status(400).json({ error: "Folder not exists" });
  }
});

router.get("/artists", async (req, res) => {
  if (!req.query.folder) {
    res.status(400).json({ error: "Folder is required." });
    return;
  }

  const folder = `./files/${req.query.folder}`;

  if (fs.existsSync(folder)) {
    const folders = fs
      .readdirSync(folder)
      .filter((file) => fs.statSync(`${folder}/${file}`).isDirectory());

    const files = [];

    folders.forEach((subfolder, i) => {
      const subfolderPath = path.join(folder, subfolder);
      const subfolderFiles = fs
        .readdirSync(subfolderPath)
        .map((file) => path.join(subfolder, file));

      const data = {
        name: subfolder,
        files: subfolderFiles,
      };
      files[i] = data;
    });

    res.status(200).json(files);
  } else {
    res.status(400).json({ error: "Folder not exists" });
  }
});

router.get("/delete", async (req, res) => {
  if (!req.query.folder) {
    res.status(400).json({ error: "Folder is required." });
    return;
  }

  const folder = `./files/${req.query.folder}`;

  if (fs.existsSync(folder)) {
    fs.rmdirSync(folder, { recursive: true });
    res.status(200).json({ message: "Folder deleted successfully" });
  }

  res.status(400).json({ error: "Error to delete folder." });
});

module.exports = router;

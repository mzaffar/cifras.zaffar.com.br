var express = require("express");
var router = express.Router();
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const puppeteer = require("puppeteer-core");
const { checkIfFolderIsEmpty } = require("../utils");

router.get("/show", async (req, res) => {
  if (!req.query.folder) {
    res.status(400).json({ error: "Folder is required." });
    return;
  }

  if (!req.query.artist) {
    res.status(400).json({ error: "Artist is required." });
    return;
  }

  if (!req.query.music) {
    res.status(400).json({ error: "Music is required." });
    return;
  }
  const folder = `files/${req.query.folder}/${req.query.artist}`;
  const parentDir = path.dirname(__dirname);
  const filePath = path.join(parentDir, folder, `${req.query.music}.json`);

  try {
    fs.readFile(filePath, function (err, data) {
      if (err) {
        res.status(500).json({ error: err.message, filePath: filePath });
      }
      res.status(200).json(JSON.parse(data));
    });
  } catch (error) {
    res.status(500).json({ error: error.message, filePath: filePath });
  }
});

router.get("/import", async (req, res) => {
  if (!req.query.folder) {
    res.status(400).json({ error: "Folder is required." });
    return;
  }

  if (!req.query.url) {
    res.status(400).json({ error: "URL is required." });
    return;
  }

  const url = req.query.url;
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--dns-prefetch-disable",
    ],
  });

  const page = await browser.newPage();
  await page.goto(url, { timeout: 60000, waitUntil: "networkidle2" });
  // await page.waitForSelector(".cifra_acordes > ul > li > .chord");
  const html = await page.content();

  const $ = cheerio.load(html);
  $(".tablatura").remove();
  $(".cifra_acordes--artista").remove();

  const music_name = $(".t1").text();
  const music_slug = slugify(music_name, { lower: true });
  const artist_name = $(".t3").text();
  const artist_slug = slugify(artist_name, { lower: true });
  const music_key = $("#cifra_tom > a").text();
  const music = $("pre").html();

  const chords = $(".cifra_acordes  .chord");

  const chordsArray = [];

  chords.each((i, element) => {
    const mount = $(element).attr("data-mount");
    const tuning = $(element).attr("data-tuning");

    const $c = cheerio.load(element);
    const name = $c("strong").text();

    const dataChords = {
      mount,
      tuning,
      name,
      fingers: [],
      notes: [],
    };

    const notes = $c(".chord-notes > span");

    // loop through notes
    notes.each((j, elementN) => {
      let note = $(elementN).attr("title");
      if (note) note = note.replace('"', "");
      const note_play = $(elementN).text();

      const noteData = {
        note: note || "",
        note_play: note_play || "",
      };
      dataChords.notes[j] = noteData;
    });

    const fingers = $c(".chord-grid > .chord-note");
    fingers.each((f, finger) => {
      dataChords.fingers.push($(finger).text());
    });

    chordsArray.push(dataChords);
  });

  const jsonData = {
    path: `${req.query.folder}/${artist_slug}/${music_slug}.json`,
    music: {
      name: music_name,
      slug: music_slug,
      key: music_key,
      music: music,
      url_clifraclub: url,
      chords: chordsArray,
    },
    artist: {
      name: artist_name,
      slug: artist_slug,
    },
  };
  const jsonString = JSON.stringify(jsonData);

  const artist_folder = `./files/${req.query.folder}/${artist_slug}`;

  if (!fs.existsSync(artist_folder)) {
    fs.mkdirSync(artist_folder);
  }

  const filePath = `${artist_folder}/${music_slug}.json`;

  fs.writeFile(filePath, jsonString, "utf-8", (err) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(jsonData);
  });
});

router.get("/delete", async (req, res) => {
  if (!req.query.path) {
    res.status(400).json({ error: "Path is required." });
    return;
  }

  const lastSlashIndex = req.query.path.lastIndexOf("/");
  const directoryPath = req.query.path.substring(0, lastSlashIndex + 1);

  try {
    await fs.promises.unlink(`./files/${req.query.path}`);

    const isEmpty = await checkIfFolderIsEmpty(`./files/${directoryPath}`);
    if (isEmpty) {
      await fs.promises.rmdir(`./files/${directoryPath}`);
    }

    res.status(200).json({ message: "File deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/update", async (req, res) => {
  if (!req.body.json) {
    res.status(400).json({ error: "Json is required" });
    return;
  }

  const jsonData = req.body.json;
  const jsonString = JSON.stringify(jsonData);

  try {
    fs.writeFile(`./files/${jsonData.path}`, jsonString, "utf-8", (err) => {
      if (err) {
        res.json(err);
        return;
      }
      res.json(jsonData);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;

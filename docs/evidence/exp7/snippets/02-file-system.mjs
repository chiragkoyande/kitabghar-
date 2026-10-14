const note = await readFile(evidenceFile, "utf8");
log("FILE_SYSTEM", { file: path.basename(evidenceFile), characters: note.length, content: note.trim() });

const buffer = Buffer.from("Kitab Ghar · Badlapur", "utf8");
const { readdir, access, readFile } = require('fs/promises');
const swig = require('swig');
const sharp = require('sharp');
const path = require('path');
const template = swig.compileFile('index-template.html');

async function exists (path) {
    try {
        await access(path)
        return true
    } catch {
        return false
    }
}

async function get_images(dir, ext) {
    const matchedFiles = [];

    const files = await readdir(dir);

    for (const file of files) {
        if (file.endsWith(`.${ext}`) && !file.endsWith(`thumb.${ext}`)) {
            const file_path =  path.join(dir, file)
            let thumbnail_path = file_path.replace(ext, `thumb.${ext}`);
            const photo = sharp(file_path)
            if (! await exists(thumbnail_path)) {
                await photo.resize({ height: 240 }).toFile(thumbnail_path);
            }
            const metadata = await photo.metadata()
            metadata["path"] = file_path
            metadata["thumbnailPath"] = thumbnail_path
            matchedFiles.push(metadata)
        }
    }
    return matchedFiles;
}

(async function() {
    const config = JSON.parse(await readFile('./properties.json', { encoding: 'utf8' }));
    console.log(template({...config, images: await get_images('img', 'jpg')}));
})();
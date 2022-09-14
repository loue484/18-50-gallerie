const { readdir } = require('fs/promises');
const swig = require('swig');
const template = swig.compileFile('index-template.html');

async function get_images(dir, ext) {
    const matchedFiles = [];

    const files = await readdir(dir);

    for (const file of files) {
        if (file.endsWith(`.${ext}`)) {
            matchedFiles.push(file);
        }
    }
    return matchedFiles;
}

(async function() {
    console.log(template({images: await get_images('img', 'jpg')}));
})();
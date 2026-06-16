const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./frontend/src', function(filePath) {
    if (!filePath.endsWith('.jsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Remove opacity modifiers on common text colors to maximize strength
    content = content.replace(/text-text-main\/\d+/g, 'text-text-main');
    content = content.replace(/text-white\/\d+/g, 'text-white');
    content = content.replace(/text-heritage-cream\/\d+/g, 'text-heritage-cream');
    content = content.replace(/text-heritage-creamDark\/\d+/g, 'text-heritage-cream');
    content = content.replace(/text-heritage-terracottaDark\/\d+/g, 'text-heritage-terracottaDark');
    content = content.replace(/text-heritage-slate\/\d+/g, 'text-text-main'); // make slate into strong main text

    // 2. Upgrade muted colors to their brighter/stronger counterparts
    content = content.replace(/text-heritage-creamDark/g, 'text-heritage-cream');
    content = content.replace(/text-heritage-slate/g, 'text-text-main');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Pumped brightness in ${filePath}`);
    }
});

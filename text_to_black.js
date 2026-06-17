const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./frontend/src/pages', function(filePath) {
    if (!filePath.endsWith('.jsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Split file by section/header/footer tags
    let parts = content.split(/(?=<section|<header|<footer)/g);
    
    for (let i = 0; i < parts.length; i++) {
        // If this section has bg-heritage-terracotta as its main background
        let firstLine = parts[i].split('\n')[0];
        if (firstLine && firstLine.includes('bg-heritage-terracotta') && !firstLine.includes('bg-heritage-terracotta/40')) {
            // Replace text colors
            parts[i] = parts[i].replace(/text-white/g, 'text-text-main');
            parts[i] = parts[i].replace(/text-heritage-cream/g, 'text-text-main');
            parts[i] = parts[i].replace(/text-heritage-creamDark/g, 'text-text-main');
            parts[i] = parts[i].replace(/text-yellow-400/g, 'text-text-main');
            // Ensure any text-text-main stays text-text-main (dark charcoal black)
        }
    }
    
    let newContent = parts.join('');
    if (newContent !== original) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated text to black in ${filePath}`);
    }
});

// Also update Footer
let footerPath = './frontend/src/components/layout/Footer.jsx';
let footer = fs.readFileSync(footerPath, 'utf8');
footer = footer.replace(/text-white/g, 'text-text-main');
footer = footer.replace(/text-yellow-400/g, 'text-text-main');
fs.writeFileSync(footerPath, footer, 'utf8');
console.log('Updated text to black in Footer');

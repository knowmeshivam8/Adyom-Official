const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processDirectory(dirPath) {
    walkDir(dirPath, function(filePath) {
        if (!filePath.endsWith('.jsx')) return;
        
        let content = fs.readFileSync(filePath, 'utf8');
        let lines = content.split('\n');
        let modified = false;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            
            // Check if line contains 'bg-heritage-terracotta' (full color, not transparent /10 etc)
            // also avoid bg-heritage-terracottaLight
            if (line.match(/bg-heritage-terracotta(?![a-zA-Z\/])/)) {
                
                let originalLine = line;

                // 1. If it explicitly has text-white, replace it
                if (line.includes('text-white')) {
                    line = line.replace(/text-white/g, 'text-text-main');
                }
                
                // 2. If it's still missing text-text-main (like Buttons inheriting from default), add it
                if (!line.includes('text-text-main') && !line.includes('text-black')) {
                    line = line.replace(/bg-heritage-terracotta(?![a-zA-Z\/])/, 'bg-heritage-terracotta text-text-main');
                }

                if (originalLine !== line) {
                    lines[i] = line;
                    modified = true;
                }
            }
        }
        
        if (modified) {
            fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
            console.log(`Updated text to black in ${filePath}`);
        }
    });
}

processDirectory('./frontend/src/pages/admin');
processDirectory('./frontend/src/pages/dashboard');

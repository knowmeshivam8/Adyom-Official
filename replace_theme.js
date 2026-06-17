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
    if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js') && !filePath.endsWith('.css')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Replace specific text colors first to ensure they become Dark (for readability on white bg)
    content = content.replace(/text-heritage-maroonLight/g, 'text-heritage-terracottaDark');
    content = content.replace(/text-heritage-maroonDark/g, 'text-heritage-terracottaDark');
    content = content.replace(/text-heritage-maroon/g, 'text-heritage-terracottaDark');

    // 2. Replace all remaining maroon with terracotta (handles bg-, border-, from-, to-, ring-, etc.)
    content = content.replace(/heritage-maroon/g, 'heritage-terracotta');
    
    // 3. Address contrast on terracotta backgrounds.
    // If a section or div has bg-heritage-terracotta, its text should probably not be white or cream.
    // However, doing this via regex globally is tricky. We'll replace text-white/text-heritage-cream 
    // with text-text-main or text-heritage-charcoal ONLY inside files where bg-heritage-terracotta is heavily used
    // and we know it's needed. Actually, since we want a "dark charcoal" text on the terracotta like the image,
    // let's do this: if we find text-white near bg-heritage-terracotta, we should replace it.
    // Let's just use `text-text-main` where we had `text-white` or `text-heritage-cream` inside specific components 
    // that use `bg-heritage-terracotta`.
    
    // For now, let's just do the primary replacements.
    
    // Custom fix for text-gradient
    content = content.replace(/text-gradient-maroon/g, 'text-gradient-terracotta');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
});

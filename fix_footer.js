const fs = require('fs');
const file = 'frontend/src/components/layout/Footer.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace all text-heritage-brown with text-white
content = content.replace(/text-heritage-brown/g, 'text-white');

// Replace bg-heritage-brown with bg-white
content = content.replace(/bg-heritage-brown/g, 'bg-white');

// Replace text-heritage-creamLight with text-heritage-terracottaDark (for text inside bg-white elements)
content = content.replace(/text-heritage-creamLight/g, 'text-heritage-terracottaDark');

// Update social icons background and hover states for better visibility on terracotta
content = content.replace(/bg-heritage-creamLight/g, 'bg-white/20');
// wait, the social icons original classes:
// "w-9 h-9 rounded-full bg-heritage-creamLight hover:bg-heritage-brown text-heritage-brown hover:text-heritage-creamLight flex items-center justify-center transition-all duration-200"
// after our regex above, they become:
// "w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-heritage-terracottaDark flex items-center justify-center transition-all duration-200"
// which is perfect!

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed Footer.jsx colors to white');

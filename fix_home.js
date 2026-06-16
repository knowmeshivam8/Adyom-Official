const fs = require('fs');

const file = 'frontend/src/pages/Home.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace text-heritage-cream with text-text-main where appropriate.
// Since Home.jsx used text-heritage-cream mainly for the maroon (now terracotta) sections, we can safely replace most of them.
content = content.replace(/text-heritage-creamDark\/70/g, 'text-text-main/80');
content = content.replace(/text-heritage-creamDark\/80/g, 'text-text-main/80');
content = content.replace(/text-heritage-creamDark\/60/g, 'text-text-main/70');
content = content.replace(/text-heritage-creamDark/g, 'text-text-main');

// Only replace text-heritage-cream if it's not part of text-heritage-creamDark
content = content.replace(/text-heritage-cream(?!Dark)/g, 'text-text-main');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed Home.jsx contrast');

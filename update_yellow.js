const fs = require('fs');

// Update Footer
let footerContent = fs.readFileSync('frontend/src/components/layout/Footer.jsx', 'utf8');
footerContent = footerContent.replace(/text-heritage-goldLight/g, 'text-yellow-400');
footerContent = footerContent.replace(/bg-heritage-goldLight/g, 'bg-yellow-400');
footerContent = footerContent.replace(/hover:text-heritage-gold/g, 'hover:text-yellow-300');
footerContent = footerContent.replace(/hover:bg-heritage-gold/g, 'hover:bg-yellow-300');
fs.writeFileSync('frontend/src/components/layout/Footer.jsx', footerContent, 'utf8');

// Update Home (Contact CTA only)
let homeContent = fs.readFileSync('frontend/src/pages/Home.jsx', 'utf8');
let homeStart = homeContent.indexOf('Start Your Journey');
let homeEnd = homeContent.indexOf('</section>', homeStart);
let homeSection = homeContent.slice(homeStart - 200, homeEnd); 

let modifiedSection = homeSection;
modifiedSection = modifiedSection.replace(/bg-heritage-goldLight/g, 'bg-yellow-400');
modifiedSection = modifiedSection.replace(/text-heritage-goldLight/g, 'text-yellow-400');
modifiedSection = modifiedSection.replace(/border-heritage-goldLight/g, 'border-yellow-400');
modifiedSection = modifiedSection.replace(/hover:bg-heritage-gold(?!L)/g, 'hover:bg-yellow-300'); // match hover:bg-heritage-gold exactly

homeContent = homeContent.replace(homeSection, modifiedSection);
fs.writeFileSync('frontend/src/pages/Home.jsx', homeContent, 'utf8');

console.log('Updated to max bright yellow');

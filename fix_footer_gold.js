const fs = require('fs');
const file = 'frontend/src/components/layout/Footer.jsx';
let content = fs.readFileSync(file, 'utf8');

// Logo text "Adyom Foundation"
content = content.replace(
    /<h3 className="text-2xl font-heading font-bold text-white tracking-wide">/g,
    '<h3 className="text-2xl font-heading font-bold text-heritage-goldLight tracking-wide">'
);
content = content.replace(
    /<p className="text-xs text-white font-accent tracking-widest">/g,
    '<p className="text-xs text-heritage-goldLight font-accent tracking-widest">'
);

// Headings: Our Programs, Quick Links, Reach Us
content = content.replace(
    /<h4 className="text-lg font-heading font-semibold text-white">/g,
    '<h4 className="text-lg font-heading font-semibold text-heritage-goldLight">'
);

// Become a Member Link
content = content.replace(
    /className="text-sm font-body text-white hover:text-white\/80 transition-colors font-semibold"/g,
    'className="text-sm font-body text-heritage-goldLight hover:text-heritage-gold transition-colors font-semibold"'
);

// Send a Message Button
content = content.replace(
    /className="mt-2 px-4 py-2 bg-white text-heritage-terracottaDark text-sm font-body font-medium rounded-md hover:bg-white\/90 transition-colors"/g,
    'className="mt-2 px-4 py-2 bg-heritage-goldLight text-heritage-terracottaDark text-sm font-body font-medium rounded-md hover:bg-heritage-gold transition-colors"'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed Footer.jsx gold elements');

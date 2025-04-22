const fs = require('fs');
const path = require('path');

// SVG template for our icon
const iconSvg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size/5}" fill="#4F46E5" />
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-weight="bold" font-size="${size/2}" 
    fill="white" text-anchor="middle" dominant-baseline="central">AI</text>
  <path d="M${size*0.2},${size*0.65} L${size*0.38},${size*0.8} L${size*0.8},${size*0.3}" 
    stroke="white" stroke-width="${size/15}" fill="none" stroke-linecap="round" stroke-linejoin="round" />
</svg>
`;

const sizes = [16, 48, 128];
const iconDir = path.join(__dirname, './');

// Create directory if it doesn't exist
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Generate icons
sizes.forEach(size => {
  const fileName = path.join(iconDir, `icon-${size}.svg`);
  fs.writeFileSync(fileName, iconSvg(size));
  console.log(`Generated ${fileName}`);
});

console.log('Icon generation complete.');
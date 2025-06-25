// Script to replace cx() usage with basic className
const fs = require('fs');
const path = require('path');

// Map of common classNames to Tailwind equivalents
const classMap = {
  'form-section': 'bg-white rounded-xl shadow-lg p-6 mb-6',
  'form-group': 'space-y-2',
  'form-row': 'grid grid-cols-1 md:grid-cols-2 gap-6',
  'input-field': 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
  'error-message': 'text-red-500 text-sm font-medium',
  'error-text': 'text-red-500 text-sm font-medium',
  'submit-button': 'w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all',
  'back-button': 'flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors',
  'form-header': 'text-center mb-8',
  'consultation-card': 'p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-500 hover:shadow-md',
  'radio-label': 'flex items-center gap-2 cursor-pointer p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-white',
  'appointment-container': 'min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 py-8',
  'appointment-form': 'max-w-4xl mx-auto px-4',
  'appointment-header': 'text-center mb-8 bg-white rounded-xl shadow-lg p-8 mx-4'
};

function replaceCxInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace cx('className') with direct className
    content = content.replace(/className=\{cx\('([^']+)'\)\}/g, (match, className) => {
      modified = true;
      const tailwindClass = classMap[className] || className;
      return `className="${tailwindClass}"`;
    });
    
    // Replace cx('class1', 'class2') with combined classes
    content = content.replace(/className=\{cx\('([^']+)',\s*'([^']+)'\)\}/g, (match, class1, class2) => {
      modified = true;
      const tailwind1 = classMap[class1] || class1;
      const tailwind2 = classMap[class2] || class2;
      return `className="${tailwind1} ${tailwind2}"`;
    });
    
    // Replace cx('class', { conditional: condition }) with conditional classes
    content = content.replace(/className=\{cx\('([^']+)',\s*\{[^}]+\}\)\}/g, (match, baseClass) => {
      modified = true;
      const tailwindClass = classMap[baseClass] || baseClass;
      return `className="${tailwindClass}"`;
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      replaceCxInFile(filePath);
    }
  });
}

// Start processing from src directory
processDirectory('./src');
console.log('Finished replacing cx() calls');

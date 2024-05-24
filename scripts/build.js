const fs = require('fs');
const path = require('path');
const glob = require('glob');
const minifyHTML = require('html-minifier').minify;
const CleanCSS = require('clean-css');

function minifyAndCopyFiles(srcDir, buildDir) {
    // Find all files in srcDir
    const files = glob.sync('**/*', { cwd: srcDir, nodir: true });

    files.forEach(file => {
        const srcPath = path.join(srcDir, file);
        const buildPath = path.join(buildDir, file);

        // Ensure the directory structure is mirrored in buildDir
        fs.mkdirSync(path.dirname(buildPath), { recursive: true });

        const isHtml = path.extname(file) === '.html';
        const isCss = path.extname(file) === '.css';

        let content;
        if (isHtml || isCss) {
            content = fs.readFileSync(srcPath, 'utf8');
            if (isHtml) {
                // Minify HTML
                content = minifyHTML(content, {
                    collapseWhitespace: true,
                    removeComments: true,
                    minifyCSS: true
                });
            } else {
                // Minify CSS
                content = new CleanCSS({}).minify(content).styles;
            }
            // Write content (minified if HTML or CSS) to buildDir
            fs.writeFileSync(buildPath, content);
        } else {
            // Copy non-HTML/CSS files as is
            fs.copyFileSync(srcPath, buildPath);
        }
    });
}

// Usage
minifyAndCopyFiles('src', 'build');
const fs = require('fs');
const glob = require('glob');

const files = glob.sync('d:/React/Zavira_Git_Project/client/src/admin/pages/*.tsx');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace massive paddings and rounded corners
    content = content.replace(/p-4|p-5|p-6|p-8|p-10/g, 'p-2');
    content = content.replace(/rounded-2xl|rounded-3xl|rounded-xl|rounded-lg/g, 'rounded-sm');
    
    // Replace gap sizes
    content = content.replace(/gap-3|gap-4|gap-5|gap-6/g, 'gap-2');
    content = content.replace(/gap-1\.5/g, 'gap-1');
    
    // Replace text sizes
    content = content.replace(/text-2xl|text-xl/g, 'text-lg');
    content = content.replace(/text-sm/g, 'text-xs');
    
    // Height replacements
    content = content.replace(/h-10|h-12|h-14/g, 'h-6');
    content = content.replace(/w-10|w-12|w-14/g, 'w-6');
    content = content.replace(/min-h-\[500px\]|min-h-\[400px\]/g, 'min-h-[200px]');
    
    // Padding vertical / horizontal replacements
    content = content.replace(/py-4|py-3|py-2\.5|py-2/g, 'py-1');
    content = content.replace(/px-4|px-5|px-6|px-8|px-10/g, 'px-2');
    
    // Layout spacing replacements
    content = content.replace(/space-y-6|space-y-8|space-y-5/g, 'space-y-2');
    content = content.replace(/space-y-4|space-y-3/g, 'space-y-1');

    fs.writeFileSync(file, content);
    console.log(`Processed ${file}`);
});

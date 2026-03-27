const fs = require('fs');
const glob = require('glob');

const files = glob.sync('d:/React/Zavira_Git_Project/client/src/admin/pages/*.tsx');

const compactGridTemplate = (fields) => `
    renderExpandableRow: (rowData, rowMeta) => {
      const item = data[rowMeta.rowIndex]; // Note: actual variable name might differ per file
      if (!item) return null;
      return (
        <tr style={{ backgroundColor: '#fff' }}>
          <td colSpan={10} style={{ padding: '0', borderBottom: '1px solid #eee' }}>
            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontFamily: '"Times New Roman", Times, serif', fontSize: '12px', color: '#333' }}>
              ${fields}
            </div>
          </td>
        </tr>
      );
    },
`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Aggressive class compaction
    content = content.replace(/p-10|p-8|p-6|p-5|p-4/g, 'p-1.5');
    content = content.replace(/px-10|px-8|px-6|px-5|px-4/g, 'px-2');
    content = content.replace(/py-10|py-8|py-6|py-5|py-4/g, 'py-1');
    content = content.replace(/rounded-3xl|rounded-2xl|rounded-xl|rounded-lg/g, 'rounded-sm');
    content = content.replace(/gap-10|gap-8|gap-6|gap-5|gap-4/g, 'gap-2');
    content = content.replace(/space-y-10|space-y-8|space-y-6|space-y-5|space-y-4/g, 'space-y-1');
    content = content.replace(/text-2xl/g, 'text-base');
    content = content.replace(/text-xl/g, 'text-sm');
    content = content.replace(/h-10|h-12|h-14/g, 'h-6');
    content = content.replace(/w-10|w-12|w-14/g, 'w-6');

    // Fix button paddings specifically
    content = content.replace(/py-3\.5|py-3|py-2\.5/g, 'py-1');
    content = content.replace(/px-6|px-5/g, 'px-3');

    fs.writeFileSync(file, content);
});
console.log('Mass compaction complete.');

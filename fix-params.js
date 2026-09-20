const fs = require('fs');

const files = [
  'c:/Users/Joaquim/Desktop/LOJINHA/src/app/api/products/[slug]/stock/route.ts',
  'c:/Users/Joaquim/Desktop/LOJINHA/src/app/api/coupons/[id]/route.ts',
  'c:/Users/Joaquim/Desktop/LOJINHA/src/app/api/orders/[id]/route.ts',
  'c:/Users/Joaquim/Desktop/LOJINHA/src/app/api/categories/[id]/route.ts',
  'c:/Users/Joaquim/Desktop/LOJINHA/src/app/api/orders/[id]/confirm-payment/route.ts',
  'c:/Users/Joaquim/Desktop/LOJINHA/src/app/api/customers/[id]/route.ts',
  'c:/Users/Joaquim/Desktop/LOJINHA/src/app/api/products/[slug]/route.ts'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/\{ params \}: \{ params: \{ (\w+): string \} \}/g, 'props: { params: Promise<{ $1: string }> }');
  
  // Inside the function, add `const params = await props.params;` at the beginning of the function body.
  // We can find `export async function [A-Z]+\(.*\) {` and insert it.
  content = content.replace(/(export async function \w+\([^)]+\)\s*\{)/g, '$1\n  const params = await props.params;');
  
  fs.writeFileSync(file, content);
});
console.log('Done fixing route params.');

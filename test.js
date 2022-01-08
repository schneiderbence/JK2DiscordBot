var a = false;
var b = false;
var c = false;
var d = true;

console.log('First expression (a && b && c || d): ' + (a && b && c || d));
console.log('\n');
console.log('Second expression (a && b && (c || d)): ' + (a && b && (c || d)));
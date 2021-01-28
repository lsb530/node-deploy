const sanitizeHtml = require('sanitize-html');
const html = "<script>location.href = 'https://gilbut.co.kr'</script>";
// console.log(html);
console.log(sanitizeHtml(html)); // ''
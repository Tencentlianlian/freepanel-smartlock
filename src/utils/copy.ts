export const copyText = (text) => {
  const node = document.createElement('input');
  node.setAttribute('readonly', 'readonly');
  node.value = text;
  document.body.appendChild(node);
  node.select();
  document.execCommand('Copy');
  node.className = 'oInput';
  node.style.display = 'none';
  return text;
};
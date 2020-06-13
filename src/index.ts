let isInjected = false;

const injectControl = () => {
  const editField = document.getElementById('description-wiki-edit');

  const buttonBar = editField.getElementsByClassName('aui-nav')[0];

  const mdButtonItem = document.createElement('li');
  mdButtonItem.innerHTML = `<a href="#">Markdown</a>`
  buttonBar.appendChild(mdButtonItem);
  return true;
};

const domObserver = new MutationObserver((mutations) => {
  if (
    mutations.filter((mutationRecord) => mutationRecord.type === 'childList')
      .length > 0
  ) {
    if (!isInjected && injectControl() === true) {
      isInjected = true;
    }
  }
});

domObserver.observe(document.getRootNode(), {
  childList: true,
  attributes: true,
  subtree: true,
});

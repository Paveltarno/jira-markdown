import j2m from "jira2md"

let isInjected = false;

const injectControl = () => {
  const editField = document.getElementById('description-wiki-edit');
  const buttonBar = editField.getElementsByClassName('aui-nav')[0];
  const wikiTextArea = document.getElementById("description") as HTMLTextAreaElement

  // Create text area
  const mdTextArea = document.createElement("textarea")

  mdTextArea.addEventListener("input", (e) => {
    const target = e.target as HTMLTextAreaElement
    wikiTextArea.value = j2m.to_jira(target.value)
  })

  wikiTextArea.addEventListener("input", (e) => {
    const target = e.target as HTMLTextAreaElement
    mdTextArea.value = j2m.to_markdown(target.value)
  })

  // Create button
  const mdButtonItem = document.createElement('li');

  mdButtonItem.innerHTML = `<a href="#">Markdown</a>`;

  mdButtonItem.addEventListener('click', () => {
    buttonBar
      .getElementsByClassName('aui-nav-selected')[0]
      .classList.remove('aui-nav-selected');
    mdButtonItem.classList.add('aui-nav-selected');
  });

  editField.prepend(mdTextArea)
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

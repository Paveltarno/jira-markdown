import j2m from 'jira2md';

let isInjected = false;
let isMDModeActive = false;

const toggleVisibility = (elem: HTMLElement, isVisible: Boolean) => {
  elem.style.display = isVisible === true ? 'block' : 'none';
};

const createControlBar = (
  wikiTextArea: HTMLTextAreaElement,
  mdTextArea: HTMLTextAreaElement
) => {
  const mdControlBar = document.createElement('div');

  mdControlBar.innerHTML = `
    <input type="checkbox">
    <label>Markdown</label>
  `;

  // TODO: Make label clickable as well
  mdControlBar.children[0].addEventListener('click', (e) => {
    const isChecked = (e.target as HTMLInputElement).checked;
    isMDModeActive = isChecked;
    toggleVisibility(wikiTextArea, !isMDModeActive);
    toggleVisibility(mdTextArea, isMDModeActive);
  });

  return mdControlBar;
};

const injectControl = () => {
  const editField = document.getElementById('description-wiki-edit');

  const wikiTextArea = document.getElementById(
    'description'
  ) as HTMLTextAreaElement;

  // Create text area
  const mdTextArea = document.createElement('textarea');
  mdTextArea.style.cssText = wikiTextArea.style.cssText;
  mdTextArea.id = '';

  mdTextArea.classList.remove(
    'wiki-editor-initialised',
    'wiki-edit-wrapped',
    'wiki-textfield'
  );

  toggleVisibility(mdTextArea, false);

  // Create control bar
  const controlBar = createControlBar(wikiTextArea, mdTextArea);

  mdTextArea.addEventListener('input', (e) => {
    const target = e.target as HTMLTextAreaElement;
    wikiTextArea.value = j2m.to_jira(target.value);
  });

  wikiTextArea.addEventListener('input', (e) => {
    const target = e.target as HTMLTextAreaElement;
    mdTextArea.value = j2m.to_markdown(target.value);
  });

  // Bind to existing controls
  const textEditorButton = document.querySelector("li[data-mode='source'] > a");
  const visualEditorButton = document.querySelector(
    "li[data-mode='wysiwyg'] > a"
  );

  const onEditorStateToggle = (isTextMode: boolean) => {
    (controlBar.children[0] as HTMLInputElement).disabled = !isTextMode;
    if (isTextMode === true) {
      mdTextArea.value = j2m.to_markdown(wikiTextArea.value);
      if (isMDModeActive === true) {
        mdTextArea.style.display = 'block';
      }
    } else {
      mdTextArea.style.display = 'none';
      (controlBar.children[0] as HTMLInputElement).disabled = true;
    }
  };

  visualEditorButton.addEventListener('click', () =>
    onEditorStateToggle(false)
  );
  textEditorButton.addEventListener('click', () => onEditorStateToggle(true));

  editField.prepend(mdTextArea);
  editField.prepend(controlBar);

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

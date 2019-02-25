let notes = [];
let tags = [];
const $list = document.querySelector('#list');
const $title = document.querySelector('#title');
const $text = document.querySelector('#text');
const $selectTags = document.querySelector('#select-tags');
const $addTags = document.querySelector('#add-tags');
const $noteForm = document.querySelector('#note-form');
const $tagForm = document.querySelector('#tag-form');
const $searchForm = document.querySelector('#search-form');
const $searchTags = document.querySelector('#search-input');
const $tagsList = document.querySelector('#tags-list');
const $clearButton = document.querySelector('#clear');

const getSavedTags = () => {
  $.get(
    'http://localhost:3000/tags',
    data => {
      tags = data;
      if (tags.length > 0) {
        $tagsList.innerHTML = '';
        for (i = 0; i < tags.length; i++) {
          renderTag(tags[i], tags[i].id);
        }
      } else {
        $tagsList.innerHTML = '';
        tags = [];
      }
    },
    'JSON'
  );
};

const getSavedNotes = () => {
  $.get(
    'http://localhost:3000/notes',
    data => {
      notes = data;
      if (notes.length > 0) {
        $list.innerHTML = '';
        for (i = 0; i < notes.length; i++) {
          renderNote(notes[i], notes[i].id);
        }
      } else {
        $list.innerHTML = '';
        notes = [];
      }
    },
    'JSON'
  );
};

const onNoteFormSubmit = e => {
  e.preventDefault();
  let selectedTags = [$selectTags.value];
  if (selectedTags[0].indexOf(',') >= 0) {
    selectedTags = selectedTags[0].split(',');
  }
  for (i = 0; i < selectedTags.length; i++) {
    const selectedTag = selectedTags[i].trim();
    const t = tags.findIndex(x => x.tag === selectedTag);
    if (selectedTag != '' && t < 0) {
      alert('Selected tag(s) do not exist.');
      $selectTags.focus();
      return false;
    } else {
      selectedTags[i] = selectedTag;
    }
  }
  if ($list.children[0] != undefined) {
    if ($list.children[0].textContent === 'Back to All Notes') {
      document.getElementById('back-button').click();
    }
  }
  if ($title.value === ' ') {
    alert('New note must have a title.');
    $title.value = '';
    $title.focus();
  } else if ($text.value === ' ') {
    alert('New note must have text.');
    $text.value = '';
    $text.focus();
  } else {
    const note = {
      title: $title.value,
      text: $text.value,
      tags: selectedTags,
    };
    $.post('http://localhost:3000/notes', JSON.stringify(note), () => {
      $.get(
        'http://localhost:3000/notes',
        data => {
          notes = data;
          const id = notes[notes.length - 1].id;
          const t = notes.findIndex(x => x.id === id);
          notes[t].tags = cleanString(notes[t].tags);
          if (notes[t].tags.indexOf(', ') >= 0) {
            notes[t].tags = notes[t].tags.replace(/, /g, ',');
          }
          renderNote(notes[t], notes[t].id);
        },
        'JSON'
      );
    });
    $title.value = '';
    $text.value = '';
    $selectTags.value = '';
    $title.focus();
  }
};

const onTagFormSubmit = e => {
  e.preventDefault();
  let newTags = [$addTags.value];
  if (newTags[0].indexOf(',') >= 0) {
    newTags = newTags[0].split(',');
  }
  for (i = 0; i < newTags.length; i++) {
    const newTag = newTags[i].trim();
    const t = tags.findIndex(x => x.tag === newTag);
    if (t >= 0) {
      alert('Created tag(s) already exists.');
      $addTags.focus();
      return false;
    }
    if (newTag === '') {
      alert('New tag must not be blank.');
      $addTags.focus();
      return false;
    }
    newTags[i] = newTag;
  }
  const postTags = (i, newTag) => {
    $.post('http://localhost:3000/tags', newTag, () => {
      $.get(
        'http://localhost:3000/tags',
        data => {
          tags = data;
          const id = tags[tags.length - i - 1].id;
          const t = tags.findIndex(x => x.id === id);
          renderTag(tags[t], tags[t].id);
        },
        'JSON'
      );
    });
  };
  for (i = 0; i < newTags.length; i++) {
    postTags(newTags.length - 1 - i, newTags[i]);
  }
  $addTags.value = '';
  $addTags.focus();
};

const cleanString = string => {
  if (string.indexOf('{') >= 0) {
    string = string.replace(/{|}/g, '');
  }
  if (string.indexOf('[') >= 0) {
    string = string.replace(/\[|]/g, '');
  }
  if (string.indexOf('"') >= 0) {
    string = string.replace(/"/g, '');
  }
  if (string.indexOf(',') >= 0) {
    string = string.replace(/,/g, ', ');
  }
  return string;
};

const renderNote = (note, id) => {
  const newNote = document.createElement('li');
  const newDiv = document.createElement('div');
  const noteTitle = document.createElement('h1');
  const noteText = document.createElement('h2');
  const noteTags = document.createElement('h3');
  newDiv.className = 'note-div';
  note.tags = cleanString(note.tags);
  noteTitle.textContent = note.title;
  noteText.textContent = note.text;
  if (note.tags.indexOf(',') >= 0) {
    noteTags.textContent = 'Tags: ' + note.tags;
  }
  if (note.tags.indexOf(',') === -1 && note.tags != '') {
    noteTags.textContent = 'Tag: ' + note.tags;
  }
  newNote.appendChild(newDiv);
  newDiv.appendChild(noteTitle);
  newDiv.appendChild(noteText);
  newDiv.appendChild(noteTags);
  if (id) {
    // new note
    newNote.dataset.id = id;
    newNote.appendChild(createElementEditNoteButton(id));
    newNote.appendChild(createElementDeleteNoteButton(id));
  } else {
    // searching
    createElementBackButton();
  }
  newNote.classList.add('new-post');
  setTimeout(() => {
    newNote.classList.add('post-visible');
  }, 10);
  $list.appendChild(newNote);
};

const renderTag = (tag, id) => {
  const newTag = document.createElement('li');
  const newDiv = document.createElement('div');
  const tagTitle = document.createElement('h3');
  newDiv.className = 'tag-div';
  tagTitle.textContent = tag.tag;
  newTag.appendChild(newDiv);
  newDiv.appendChild(tagTitle);
  newTag.dataset.id = id;
  newTag.appendChild(createElementEditTagButton(id));
  newTag.appendChild(createElementDeleteTagButton(id));
  newTag.classList.add('new-post');
  setTimeout(() => {
    newTag.classList.add('post-visible');
  }, 10);
  $tagsList.appendChild(newTag);
};

const createElementBackButton = () => {
  if ($list.children[0] === undefined || $list.children[0].textContent != 'Back to All Notes') {
    const backToNotes = document.createElement('button');
    const searchTitle = document.createElement('h1');
    backToNotes.id = 'back-button';
    backToNotes.className = 'back-button';
    backToNotes.textContent = 'Back to All Notes';
    searchTitle.textContent = 'Search Results:';
    backToNotes.addEventListener('click', onBackButtonClick);
    backToNotes.classList.add('new-post');
    setTimeout(() => {
      backToNotes.classList.add('post-visible');
    }, 10);
    searchTitle.classList.add('new-post');
    setTimeout(() => {
      searchTitle.classList.add('post-visible');
    }, 10);
    $list.appendChild(backToNotes);
    $list.appendChild(searchTitle);
  }
};

const onBackButtonClick = e => {
  e.preventDefault();
  for (i = 0; i < $list.childElementCount; i++) {
    $list.childNodes[i].classList.add('post-delete');
  }
  setTimeout(() => {
    $list.innerHTML = '';
    for (i = 0; i < notes.length; i++) {
      renderNote(notes[i], notes[i].id);
    }
  }, 250);
};

const onClearClick = e => {
  e.preventDefault();
  notes = [];
  tags = [];
  jQuery.ajax({
    url: 'http://localhost:3000/notes',
    method: 'DELETE',
  });
  jQuery.ajax({
    url: 'http://localhost:3000/tags',
    method: 'DELETE',
  });
  for (i = 0; i < $list.childElementCount; i++) {
    $list.childNodes[i].classList.add('post-delete');
  }
  for (i = 0; i < $tagsList.childElementCount; i++) {
    $tagsList.childNodes[i].classList.add('post-delete');
  }
  setTimeout(() => {
    $list.innerHTML = '';
    $tagsList.innerHTML = '';
  }, 250);
};

const createElementEditNoteButton = id => {
  const editButton = document.createElement('button');
  editButton.dataset.id = id;
  editButton.className = 'note-edit mini-button';
  editButton.textContent = '';
  editButton.addEventListener('click', onEditNoteButtonClick);
  return editButton;
};

const onEditNoteButtonClick = e => {
  e.preventDefault();
  const id = Number(e.target.dataset.id);
  const t = notes.findIndex(x => x.id === id);
  $title.value = notes[t].title;
  $text.value = notes[t].text;
  $selectTags.value = notes[t].tags;
  notes.splice(t, 1);
  jQuery.ajax({
    url: 'http://localhost:3000/notes/' + id,
    method: 'DELETE',
    data: JSON.stringify(id),
    success: () => {
      $.get(
        'http://localhost:3000/notes',
        data => {
          notes = data;
        },
        'JSON'
      );
    },
  });
  e.target.parentNode.classList.add('post-delete');
  $title.focus();
  setTimeout(() => {
    e.target.parentNode.remove();
  }, 250);
};

const createElementDeleteNoteButton = id => {
  const deleteButton = document.createElement('button');
  deleteButton.dataset.id = id;
  deleteButton.className = 'note-delete mini-button';
  deleteButton.textContent = '';
  deleteButton.addEventListener('click', onDeleteNoteButtonClick);
  return deleteButton;
};

const onDeleteNoteButtonClick = e => {
  e.preventDefault();
  const id = Number(e.target.dataset.id);
  const t = notes.findIndex(x => x.id === id);
  notes.splice(t, 1);
  jQuery.ajax({
    url: 'http://localhost:3000/notes/' + id,
    method: 'DELETE',
    data: JSON.stringify(id),
    success: () => {
      $.get(
        'http://localhost:3000/notes',
        data => {
          notes = data;
        },
        'JSON'
      );
    },
  });
  e.target.parentNode.classList.add('post-delete');
  setTimeout(() => {
    e.target.parentNode.remove();
  }, 250);
};

const createElementEditTagButton = id => {
  const editButton = document.createElement('button');
  editButton.dataset.id = id;
  editButton.className = 'tag-edit mini-button';
  editButton.textContent = '';
  editButton.addEventListener('click', onEditTagButtonClick);
  return editButton;
};

const onEditTagButtonClick = e => {
  e.preventDefault();
  const id = Number(e.target.dataset.id);
  const t = tags.findIndex(x => x.id === id);
  $addTags.value = tags[t].tag;
  tags.splice(t, 1);
  jQuery.ajax({
    url: 'http://localhost:3000/tags/' + id,
    method: 'DELETE',
    data: JSON.stringify(id),
    success: () => {
      $.get(
        'http://localhost:3000/tags',
        data => {
          tags = data;
        },
        'JSON'
      );
    },
  });
  e.target.parentNode.classList.add('post-delete');
  $addTags.focus();
  setTimeout(() => {
    e.target.parentNode.remove();
  }, 250);
};

const createElementDeleteTagButton = id => {
  const deleteButton = document.createElement('button');
  deleteButton.dataset.id = id;
  deleteButton.className = 'tag-delete mini-button';
  deleteButton.textContent = '';
  deleteButton.addEventListener('click', onDeleteTagButtonClick);
  return deleteButton;
};

const onDeleteTagButtonClick = e => {
  e.preventDefault();
  const id = Number(e.target.dataset.id);
  const t = tags.findIndex(x => x.id === id);
  tags.splice(t, 1);
  jQuery.ajax({
    url: 'http://localhost:3000/tags/' + id,
    method: 'DELETE',
    data: JSON.stringify(id),
    success: () => {
      $.get(
        'http://localhost:3000/tags',
        data => {
          tags = data;
        },
        'JSON'
      );
    },
  });
  e.target.parentNode.classList.add('post-delete');
  setTimeout(() => {
    e.target.parentNode.remove();
  }, 250);
};

const onSearchFormSubmit = e => {
  e.preventDefault();
  let searchTags = [$searchTags.value];
  let searchResults = [];
  if (searchTags[0].indexOf(',') >= 0) {
    searchTags = searchTags[0].split(',');
  }
  for (i = 0; i < searchTags.length; i++) {
    const searchTag = searchTags[i].trim();
    const t = tags.findIndex(x => x.tag === searchTag);
    if (t < 0) {
      alert('Searched tag(s) have not been created.');
      $searchTags.focus();
      return false;
    }
    if (searchTag === '') {
      alert('Searched tag(s) must not be blank.');
      $searchTags.focus();
      return false;
    }
    for (j = 0; j < notes.length; j++) {
      let noteTags = [notes[j].tags];
      const note = notes[j];
      if (noteTags[0].indexOf(',') >= 0) {
        noteTags = noteTags[0].split(',');
      }
      for (k = 0; k < noteTags.length; k++) {
        noteTags[k] = noteTags[k].trim();
        if (noteTags[k] === searchTag) {
          if (searchResults.findIndex(x => x === note) === -1) {
            searchResults.push(note);
          }
        }
      }
    }
  }
  for (i = 0; i < $list.childElementCount; i++) {
    $list.childNodes[i].classList.add('post-delete');
  }
  setTimeout(() => {
    $list.innerHTML = '';
    if (searchResults.length === 0) {
      const liResults = document.createElement('li');
      const noResults = document.createElement('h2');
      createElementBackButton();
      noResults.textContent = 'No Notes Found';
      liResults.appendChild(noResults);
      liResults.classList.add('new-post');
      setTimeout(() => {
        liResults.classList.add('post-visible');
      }, 10);
      $list.appendChild(liResults);
    }
    for (i = 0; i < searchResults.length; i++) {
      renderNote(searchResults[i]);
    }
    $searchTags.value = '';
    $searchTags.focus();
  }, 300);
};

$noteForm.addEventListener('submit', onNoteFormSubmit, false);
$tagForm.addEventListener('submit', onTagFormSubmit, false);
$searchForm.addEventListener('submit', onSearchFormSubmit, false);
$clearButton.addEventListener('click', onClearClick, false);
getSavedTags();
getSavedNotes();

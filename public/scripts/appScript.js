const notesContainer = document.querySelector("#app");
const addNoteBtn = notesContainer.querySelector(".add-note");
document.addEventListener("DOMContentLoaded", async () => {
  const notes = await getNotes();
  notes.forEach((note) => {
    const noteElement = createNoteElement(note.id, note.content);
    notesContainer.insertBefore(noteElement, addNoteBtn);
  });
});

addNoteBtn.addEventListener("click", () => addNote());

async function getNotes() {
  const data = await (await fetch("/notes")).json();

  console.log(data);
  return data;
}

async function saveNotes(notes) {
  const Notes = JSON.stringify(notes);
  console.log(Notes);

  fetch("/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: Notes,
  }).then((res) => {
    console.log("Request complete! response:", res);
  });
}

function createNoteElement(id, content) {
  const container = document.createElement("div");
  const element = document.createElement("textarea");
  const deletebtn = document.createElement("button");

  container.classList.add("note-container");

  element.classList.add("note");
  element.value = content;
  element.placeholder = "Empty Sticky Note";
  element.setAttribute("spellcheck", "false");
  deletebtn.classList.add("deleteNoteBtn");

  deletebtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';

  container.appendChild(element);
  container.appendChild(deletebtn);
  element.addEventListener("change", () => {
    updateNote(id, element.value);
  });

  deletebtn.addEventListener("click", () => {
    const doDelete = confirm("Are you suree to delete this note?");
    if (doDelete) {
      deleteNote(id, container);
    }
  });

  return container;
}
async function addNote() {
  const notes = await getNotes();
  const noteObject = {
    id: Math.floor(Math.random() * 10000 + 1),
    content: "",
  };

  const noteElement = createNoteElement(noteObject.id, noteObject.content);
  notesContainer.insertBefore(noteElement, addNoteBtn);
  notes.push(noteObject);
  saveNotes(notes);
}

async function updateNote(id, newContent) {
  const notes = await getNotes();
  const targetNote = notes.filter((note) => note.id == id)[0];
  targetNote.content = newContent;
  saveNotes(notes);
}

async function deleteNote(id, element) {
  let notes = await getNotes();
  notes = notes.filter((note) => note.id != id);
  saveNotes(notes);
  notesContainer.removeChild(element);
}

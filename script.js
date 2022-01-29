let toggleBtn = document.querySelector("#toggle-bar-button-container");
let toggleScreen = document.querySelector("#toggle-bar-screen");
let screenOpen = true;
let mainContainer = document.querySelector("#container");

let itemContainer = document.querySelectorAll(".item");

let toggleBarBtn = document.querySelector('#toggle-bar-button-container');

let dragItem = document.querySelectorAll(".sticky-notes-header");

// selects heading and content from toggle screen
let pushElementHeading = document.querySelector("#heading");
let pushElementContent = document.querySelector("#content");

// global varible which stores the selected element
let draggingItem;

const uniqueId = () => {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()
  );
};

const stickyNote = [
  {
    id: `${uniqueId()}`,
    heading: "first",
    content: "lorem epsum",
    coordX: 97,
    coordY: 120,
  },
  {
    id: `${uniqueId()}`,
    heading: "second",
    content: "kanchas rehsa",
    coordX: 397,
    coordY: 120,
  },
  {
    id: `${uniqueId()}`,
    heading: "third",
    content: "jujusare knits",
    coordX: 697,
    coordY: 120,
  },
];


// it updates the heading of the notes available on the screen
const updateHeading = (id) => {
  let selectedContainerToBeDeleted = document.getElementById(`${id}`);
  let input = document.createElement("input");
  input.value = selectedContainerToBeDeleted.children[0].innerText;
  let targetDiv = document.querySelectorAll(".display-delete-container");
  input.onblur = () => {
    let val = input.value;
    let deletebtn = `
    ${val} 
      <div class="delete-btn">
        <i class="fa fa-times fa-2x" onclick="deleteNotes('${id}')"></i>
      </div>
    `;
    selectedContainerToBeDeleted.children[0].innerHTML = deletebtn;
    stickyNote.filter((item) => {
      if (item.id === id) {
        item.heading = val;
      }
    });
    targetDiv.forEach((item) => {
      if (item.id === id) {
        item.children[0].innerText = val;
      }
    });
  };
  selectedContainerToBeDeleted.children[0].innerText = "";
  selectedContainerToBeDeleted.children[0].appendChild(input);
  input.focus();
};


// it updates the content of the notes available on the screen
const updateContent = (id) => {
  let selectedContainerToBeUpdated = document.getElementById(`${id}`);
  let input = document.createElement("input");
  input.value = selectedContainerToBeUpdated.children[1].innerText;

  input.onblur = () => {
    let val = input.value;
    selectedContainerToBeUpdated.children[1].innerText = val;
    stickyNote.filter((item) => {
      if (item.id === id) {
        item.content = val;
      }
    });
  };
  selectedContainerToBeUpdated.children[1].innerText = "";
  selectedContainerToBeUpdated.children[1].appendChild(input);
  input.focus();
};


// it deletes the notes from main screen and toggle screen
const deleteNotes = (id) => {
  stickyNote.filter((item, index) => {
    if (item.id === id) {
      stickyNote.splice(index, 1);
    }
  });
  let selectedContainerToBeDeleted = document.getElementById(`${id}`);
  let targetDiv = document.querySelectorAll(".display-delete-container");
  targetDiv.forEach((item) => {
    console.log(item.id);
    if (item.id === id) {
      toggleScreen.removeChild(item);
    }
  });
  mainContainer.removeChild(selectedContainerToBeDeleted);
};

// commmon container for creating the notes which are being displayed
const commonNotes = (heading, content, container, id, coordX, coordY) => {
  let createContaier = document.createElement("div");
  createContaier.classList.add("item");
  createContaier.setAttribute("id", `${id}`);

  applyTransform(createContaier, coordX, coordY);

  let dynamicHtmlCode = `
      <div class="sticky-notes-header" ondblclick="updateHeading('${id}')">${heading}
        <div class="delete-btn">
          <i class="fa fa-times fa-2x" onclick="deleteNotes('${id}')"></i>
        </div>
      </div>
      <div class="sticky-notes-content" ondblclick="updateContent('${id}')">${content}</div>
      `;
  createContaier.innerHTML = dynamicHtmlCode;
  createContaier.childNodes[1].addEventListener("mousedown", dragStart);
  createContaier.childNodes[1].addEventListener("mouseup", dragEnd);
  container.appendChild(createContaier);
};

// for inserting element in array
const pushElement = () => {
  if (pushElementHeading.value === "" || pushElementContent.value === "") {
    alert("please enter notes");
  } else {
    let index = uniqueId();
    stickyNote.push({
      id: `${index}`,
      heading: `${pushElementHeading.value}`,
      content: `${pushElementContent.value}`,
    });
    commonNotes(pushElementHeading.value, pushElementContent.value, mainContainer, index);
    forCreatingToggleScreenItems(index, pushElementHeading.value);
    pushElementHeading.value = "";
    pushElementContent.value = "";
  }
};

// it creates notes which are available from local storage
const notesAvailableAtOnload = () => {
  stickyNote.forEach((val) => {
    commonNotes(val.heading, val.content, mainContainer, val.id, val.coordX, val.coordY);
  });
};

// function which runs when page onloads and on inserting a note
const forCreatingToggleScreenItems = (id, heading) => {
  let createContaier = document.createElement("div");
  createContaier.classList.add("display-delete-container");
  createContaier.setAttribute("id", `${id}`);
  let dynamicHtmlForDisplayingNotes = `
    <div class="display-heading">${heading}</div>
    <div class="delete-btn-for-toggle-bar">
      <i class="fa fa-times-circle font-awesome-btn fa-3x" onclick="deleteNotes('${id}')"></i>
    </div>
  `;
  createContaier.innerHTML = dynamicHtmlForDisplayingNotes;
  toggleScreen.appendChild(createContaier);
};

// this function display the notes heading in the toggle screen alongwith a delete button
const displayHeadingInToggleScreen = () => {
  stickyNote.forEach((item) => {
    forCreatingToggleScreenItems(`${item.id}`, `${item.heading}`);
  });
};

const applyTransform = (elem, x, y) => {
  elem.style.transform = `translate(${x - 55}px, ${y - 20}px)`;
};

const dragStart = (e) => {
  draggingItem = e.target.parentElement;
  if (draggingItem.classList[0] === "item") {
    window.addEventListener("mousemove", mouseMove);
  }
};

const mouseMove = (e) => {
  // value of clientX and clientY which is used to transform the element
  let { clientX, clientY } = e;
  // checks whether the draggingItem container any dragItem element which we want to drag
  if (draggingItem) {
    // clientx- 95px and clienty - 20 px is used as to maintain the cursor in the selected container
    applyTransform(draggingItem, clientX, clientY);
  }
};

const dragEnd = (e) => {
  // for getting last leaved coordinates x and y of the sticky notes
  let { clientX, clientY } = e;
  let draggedItem = e.target.parentElement.id;
  stickyNote.filter((item) => {
    if (item.id === draggedItem) {
      item.coordX = clientX;
      item.coordY = clientY;
    }
  });
  draggingItem = undefined;
  window.removeEventListener("mousemove", mouseMove);
};

const setItemToLocalStorage = () => {
  window.localStorage.setItem("notes", JSON.stringify(stickyNote));
};

const openScreen = () => {
  let setStyleTo = "100%";
  let setIconTo = "<i class='fa fa-angle-left fa-3x'></i>";
  if (screenOpen){
    setStyleTo = "65%";
    setIconTo = "<i class='fa fa-angle-right fa-3x'></i>"
  }
  toggleBarBtn.innerHTML = setIconTo;
  toggleScreen.style.left = setStyleTo;
  screenOpen = !screenOpen;
};

window.onload = () => {
  notesAvailableAtOnload();
  displayHeadingInToggleScreen();
  window.localStorage.setItem("notes", JSON.stringify(stickyNote));
};
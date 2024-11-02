const inputBookTitle = document.getElementById("inputBookTitle");
const inputBookAuthor = document.getElementById("inputBookAuthor");
const inputBookYear = document.getElementById("inputBookYear");
const inputBookIsComplete = document.getElementById("inputBookIsComplete");
const bookSubmit = document.getElementById("bookSubmit");
const searchBookTitle = document.getElementById("searchBookTitle");
const searchSubmit = document.getElementById("searchSubmit");
const incompleteBookshelfList = document.getElementById(
  "incompleteBookshelfList"
);
const completeBookshelfList = document.getElementById("completeBookshelfList");

function makeBook(title, author, year, isComplete) {
  return {
    id: +new Date(),
    title,
    author,
    year: Number(year),
    isComplete,
  };
}

function makeBookElement(book) {
  const article = document.createElement("article");
  article.classList.add("book_item");
  article.id = book.id;

  const title = document.createElement("h3");
  title.innerText = book.title;

  const author = document.createElement("p");
  author.innerText = `Penulis: ${book.author}`;

  const year = document.createElement("p");
  year.innerText = `Tahun: ${book.year}`;

  const action = document.createElement("div");
  action.classList.add("action");

  const finishButton = document.createElement("button");
  finishButton.classList.add("green");
  finishButton.innerText = book.isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca";
  finishButton.addEventListener("click", function () {
    toggleBookStatus(book.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("red");
  deleteButton.innerText = "Hapus buku";
  deleteButton.addEventListener("click", function () {
    deleteBook(book.id);
  });

  action.append(finishButton, deleteButton);
  article.append(title, author, year, action);

  return article;
}

function displayBook(book) {
  const bookElement = makeBookElement(book);
  if (book.isComplete) {
    completeBookshelfList.append(bookElement);
  } else {
    incompleteBookshelfList.append(bookElement);
  }
}

function displayBooks(books) {
  for (const book of books) {
    displayBook(book);
  }
}

function saveBooks(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

function loadBooks() {
  const books = localStorage.getItem("books");
  if (books) {
    return JSON.parse(books);
  } else {
    return [];
  }
}

function addBook() {
  const title = inputBookTitle.value;
  const author = inputBookAuthor.value;
  const year = inputBookYear.value;
  const isComplete = inputBookIsComplete.checked;

  const book = makeBook(title, author, year, isComplete);

  displayBook(book);

  const books = loadBooks();
  books.push(book);

  saveBooks(books);

  inputBookTitle.value = "";
  inputBookAuthor.value = "";
  inputBookYear.value = "";
  inputBookIsComplete.checked = false;
}

function deleteBook(bookId) {
  const books = loadBooks();
  const bookIndex = books.findIndex((book) => book.id == bookId);

  books.splice(bookIndex, 1);

  saveBooks(books);

  const bookElement = document.getElementById(bookId);
  bookElement.remove();
}

function toggleBookStatus(bookId) {
  const books = loadBooks();
  const book = books.find((book) => book.id == bookId);

  book.isComplete = !book.isComplete;

  saveBooks(books);

  const bookElement = document.getElementById(bookId);
  bookElement.remove();

  displayBook(book);
}

function searchBook() {
  const title = searchBookTitle.value.toLowerCase();

  const books = loadBooks();
  const matchedBooks = books.filter((book) =>
    book.title.toLowerCase().includes(title)
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  displayBooks(matchedBooks);

  searchBookTitle.value = "";
}

bookSubmit.addEventListener("click", function (event) {
  event.preventDefault();

  addBook();
});

searchSubmit.addEventListener("click", function (event) {
  event.preventDefault();

  searchBook();
});

window.addEventListener("load", function () {
  const books = loadBooks();
  displayBooks(books);
});
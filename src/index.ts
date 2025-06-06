type Book = {
  id: number;
  title: string;
  borrowedBy?: number;
};

type Member = {
  id: number;
  name: string;
};

let books: Book[] = [];
let members: Member[] = [];

let bookId = 1;
let memberId = 1;

function updateUI() {
  const bookList = document.getElementById("bookList")!;
  const memberList = document.getElementById("memberList")!;
  const borrowMember = document.getElementById("borrowMember") as HTMLSelectElement;
  const borrowBook = document.getElementById("borrowBook") as HTMLSelectElement;
  const returnMember = document.getElementById("returnMember") as HTMLSelectElement;
  const returnBook = document.getElementById("returnBook") as HTMLSelectElement;


  const borrowedBooksList = document.getElementById("borrowedBooksList")!;


  bookList.innerHTML = books.map(book =>
    `<li>${book.title} ${book.borrowedBy !== undefined ? '(Borrowed)' : ''}
      <button onclick="deleteBook(${book.id})">Delete</button>
    </li>`).join("");


  memberList.innerHTML = members.map(member =>
    `<li>${member.name}
      <button onclick="deleteMember(${member.id})">Delete</button>
    </li>`).join("");


  borrowMember.innerHTML = members.map(m =>
    `<option value="${m.id}">${m.name}</option>`).join("");
  returnMember.innerHTML = borrowMember.innerHTML;

  borrowBook.innerHTML = books
    .filter(b => b.borrowedBy === undefined)
    .map(b => `<option value="${b.id}">${b.title}</option>`)
    .join("");

  const selectedMemberId = parseInt(returnMember.value);
  updateReturnBookList(selectedMemberId);

  borrowedBooksList.innerHTML = members.map(member => {
    const borrowed = books.filter(b => b.borrowedBy === member.id);
    const titles = borrowed.length > 0 ? borrowed.map(b => b.title).join(', ') : 'No books borrowed';
    return `<tr><td>${member.name}</td><td>${titles}</td></tr>`;
  }).join("");

 
  localStorage.setItem("books", JSON.stringify(books));
  localStorage.setItem("members", JSON.stringify(members));
}

function updateReturnBookList(memberId: number) {
  const returnBook = document.getElementById("returnBook") as HTMLSelectElement;
  returnBook.innerHTML = books
    .filter(b => b.borrowedBy === memberId)
    .map(b => `<option value="${b.id}">${b.title}</option>`)
    .join("");


  localStorage.setItem("books", JSON.stringify(books));
  localStorage.setItem("members", JSON.stringify(members));
}


(window as any).onReturnMemberChange = function () {
  const returnMember = document.getElementById("returnMember") as HTMLSelectElement;
  const memberId = parseInt(returnMember.value);
  updateReturnBookList(memberId);
};

(window as any).addBook = function () {
  const titleInput = document.getElementById("bookTitle") as HTMLInputElement;
  if (titleInput.value.trim() === "") return;

  books.push({ id: bookId++, title: titleInput.value });
  titleInput.value = "";
  updateUI();
};

(window as any).addMember = function () {
  const nameInput = document.getElementById("memberName") as HTMLInputElement;
  if (nameInput.value.trim() === "") return;

  members.push({ id: memberId++, name: nameInput.value });
  nameInput.value = "";
  updateUI();
};

(window as any).deleteBook = function (id: number) {
  books = books.filter(book => book.id !== id);
  updateUI();
};

(window as any).deleteMember = function (id: number) {
  const hasBorrowed = books.some(book => book.borrowedBy === id);
  if (hasBorrowed) {
    alert("Cannot delete member who has borrowed books.");
    return;
  }

  members = members.filter(member => member.id !== id);
  updateUI();
};

(window as any).borrowBook = function () {
  const memberId = parseInt((document.getElementById("borrowMember") as HTMLSelectElement).value);
  const bookId = parseInt((document.getElementById("borrowBook") as HTMLSelectElement).value);

  const book = books.find(b => b.id === bookId);
  if (book && book.borrowedBy === undefined) {
    book.borrowedBy = memberId;
  }
  updateUI();
};

(window as any).returnBook = function () {
  const bookId = parseInt((document.getElementById("returnBook") as HTMLSelectElement).value);
  const book = books.find(b => b.id === bookId);
  if (book) {
    book.borrowedBy = undefined;
  }
  updateUI();
};

document.addEventListener("DOMContentLoaded", () => {

  const storedBooks = localStorage.getItem("books");
  const storedMembers = localStorage.getItem("members");

  if (storedBooks) books = JSON.parse(storedBooks);
  if (storedMembers) members = JSON.parse(storedMembers);

  bookId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
  memberId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;

  const returnMember = document.getElementById("returnMember") as HTMLSelectElement;
  returnMember.addEventListener("change", () => {
    const selectedId = parseInt(returnMember.value);
    updateReturnBookList(selectedId);
  });

  updateUI();
});

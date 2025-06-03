"use strict";
let books = [];
let members = [];
let bookId = 1;
let memberId = 1;
function updateUI() {
    const bookList = document.getElementById("bookList");
    const memberList = document.getElementById("memberList");
    const borrowMember = document.getElementById("borrowMember");
    const borrowBook = document.getElementById("borrowBook");
    const returnMember = document.getElementById("returnMember");
    const returnBook = document.getElementById("returnBook");
    // ✅ updated target for table body instead of <ul>
    const borrowedBooksList = document.getElementById("borrowedBooksList");
    // Book list
    bookList.innerHTML = books.map(book => `<li>${book.title} ${book.borrowedBy !== undefined ? '(Borrowed)' : ''}
      <button onclick="deleteBook(${book.id})">Delete</button>
    </li>`).join("");
    // Member list
    memberList.innerHTML = members.map(member => `<li>${member.name}
      <button onclick="deleteMember(${member.id})">Delete</button>
    </li>`).join("");
    // Populate Borrow and Return selectors
    borrowMember.innerHTML = members.map(m => `<option value="${m.id}">${m.name}</option>`).join("");
    returnMember.innerHTML = borrowMember.innerHTML;
    borrowBook.innerHTML = books
        .filter(b => b.borrowedBy === undefined)
        .map(b => `<option value="${b.id}">${b.title}</option>`)
        .join("");
    const selectedMemberId = parseInt(returnMember.value);
    updateReturnBookList(selectedMemberId);
    // ✅ UPDATED: Borrowed Books Summary in table format
    borrowedBooksList.innerHTML = members.map(member => {
        const borrowed = books.filter(b => b.borrowedBy === member.id);
        const titles = borrowed.length > 0 ? borrowed.map(b => b.title).join(', ') : 'No books borrowed';
        return `<tr><td>${member.name}</td><td>${titles}</td></tr>`;
    }).join("");
    // ✅ Persist to localStorage
    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("members", JSON.stringify(members));
}
function updateReturnBookList(memberId) {
    const returnBook = document.getElementById("returnBook");
    returnBook.innerHTML = books
        .filter(b => b.borrowedBy === memberId)
        .map(b => `<option value="${b.id}">${b.title}</option>`)
        .join("");
    // ✅ Persist here too (optional, could omit if done in updateUI)
    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("members", JSON.stringify(members));
}
// Event handler for returnMember change
window.onReturnMemberChange = function () {
    const returnMember = document.getElementById("returnMember");
    const memberId = parseInt(returnMember.value);
    updateReturnBookList(memberId);
};
window.addBook = function () {
    const titleInput = document.getElementById("bookTitle");
    if (titleInput.value.trim() === "")
        return;
    books.push({ id: bookId++, title: titleInput.value });
    titleInput.value = "";
    updateUI();
};
window.addMember = function () {
    const nameInput = document.getElementById("memberName");
    if (nameInput.value.trim() === "")
        return;
    members.push({ id: memberId++, name: nameInput.value });
    nameInput.value = "";
    updateUI();
};
window.deleteBook = function (id) {
    books = books.filter(book => book.id !== id);
    updateUI();
};
window.deleteMember = function (id) {
    const hasBorrowed = books.some(book => book.borrowedBy === id);
    if (hasBorrowed) {
        alert("Cannot delete member who has borrowed books.");
        return;
    }
    members = members.filter(member => member.id !== id);
    updateUI();
};
window.borrowBook = function () {
    const memberId = parseInt(document.getElementById("borrowMember").value);
    const bookId = parseInt(document.getElementById("borrowBook").value);
    const book = books.find(b => b.id === bookId);
    if (book && book.borrowedBy === undefined) {
        book.borrowedBy = memberId;
    }
    updateUI();
};
window.returnBook = function () {
    const bookId = parseInt(document.getElementById("returnBook").value);
    const book = books.find(b => b.id === bookId);
    if (book) {
        book.borrowedBy = undefined;
    }
    updateUI();
};
document.addEventListener("DOMContentLoaded", () => {
    // ✅ Load from localStorage
    const storedBooks = localStorage.getItem("books");
    const storedMembers = localStorage.getItem("members");
    if (storedBooks)
        books = JSON.parse(storedBooks);
    if (storedMembers)
        members = JSON.parse(storedMembers);
    bookId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
    memberId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
    const returnMember = document.getElementById("returnMember");
    returnMember.addEventListener("change", () => {
        const selectedId = parseInt(returnMember.value);
        updateReturnBookList(selectedId);
    });
    updateUI();
});

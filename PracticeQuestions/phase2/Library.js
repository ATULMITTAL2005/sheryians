let books=[];

function addBook(title, author) {
    const book = {
        id :books.length,
        title: title,
        author: author,
        borrow : false
    };
    books.push(book);
    console.log("Book added:", book);
}
addBook("The Great Gatsby", "F. Scott Fitzgerald");
addBook("djisfji","dijfiejfiej")

function borrow(){
    let book = book.find(b=>b.id===id);
    if(!book) return "book not here"
    if(book.borrow) return "already borroed"  ;
    borrow =true;
    return `you borrowed  ${book.title}` ;
     
}

function returnBook(){
    let book = book.find(b=>b.id===id);
    if(!book) return "book not found";
     book.borrow = false;
     return `you returned ${book.title}`;
}

function available(){
    let book = book.find(b=>b.id===id);
    if(!book) return "book not availbae"
    if(book) return book.filter(b=>!b.borrow);
}


addBook("Atomic Habits", "James Clear");
addBook("Deep Work", "Cal Newport");
console.log(available());
console.log(borrow());

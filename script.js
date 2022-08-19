// variable to store data straight from local storage
let data = null;
// array to store book objects from data variable
let bookArray = [];
// array to store unread books (isComplete = false)
let unreadBookArray = [];
// array to store unread books (isComplete = true)
let readBookArray = [];
// array to store book titles
let bookTitleArray = [];
const completeBookshelfList = document.getElementById("completeBookshelfList");
const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");

// function to collect book data from the local storage
function collectBookData(){
    data = localStorage.getItem("bookArray");
    if (data === null) {
        saveBookData();
        console.log("storage empty!")
    }else{
        displayPage()
    }
}
collectBookData();

// function to display the web page
function displayPage(){
    bookArray = JSON.parse(data);
    // console.log(bookArray);
    for(const x of bookArray){
        bookTitleArray.push(x.title);
        if(x.isComplete === true){
            readBookArray.push(x);
        }else{
            unreadBookArray.push(x);
        }
        showBookData(x)
    }
}
// function to transform the book data into html elements
function showBookData(x){
    const bookBox = document.createElement("article");
    bookBox.setAttribute("id", x.title);
    bookBox.classList.add("book_item");

    const title = document.createElement("h3");
    title.innerText = x.title;
    const author = document.createElement("p")
    author.innerText = "Penulis: " + x.author;
    const year = document.createElement("p");
    year.innerText = "Tahun: " + x.year;

    const actionButton = document.createElement("div");
    actionButton.classList.add("action");
    actionButton.setAttribute("id", x.id);
    const greenButton = document.createElement("button");
    greenButton.classList.add("green");
    greenButton.classList.add("move_button");
    actionButton.appendChild(greenButton);

    const redButton = document.createElement("button");
    redButton.classList.add("red");
    redButton.classList.add("delete_button");
    redButton.innerText = "Hapus buku";
    actionButton.appendChild(redButton);

    const bookShelfElement = [title, author, year, actionButton];
    
    for(let x of bookShelfElement) {
        bookBox.appendChild(x)
    };

    if(x.isComplete === true){
        completeBookshelfList.appendChild(bookBox);
        greenButton.innerText = "Belum selesai dibaca"
    } else{
        incompleteBookshelfList.appendChild(bookBox);
        greenButton.innerText = "Selesai dibaca"
    }
}
// function to collect the book data when being submitted
function getBookData(){
    const date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let milliseconds = date.getMilliseconds();
    hour = hour.toString();
    minute = minute.toString();
    milliseconds = milliseconds.toString();
    const id = parseInt(hour + minute + milliseconds);
    // const id = Math.floor(Math.random()*1000000);
    const title = document.querySelector("#inputBookTitle").value;
    const author = document.querySelector("#inputBookAuthor").value;
    const year = document.querySelector("#inputBookYear").value;
    let isComplete = document.querySelector("#inputBookIsComplete").checked;
    let bookObject = {
        id: id,
        title: title,
        author: author,
        year: year,
        isComplete: isComplete
    };
    if(bookObject.isComplete === true){
        readBookArray.push(bookObject)
    }else{unreadBookArray.push(bookObject)};
    addBookData(bookObject);
}
// function to push book data to bookArray array
function addBookData(bookObject){
    bookArray.push(bookObject);
    saveBookData()
}
// function to save the data in bookArray array in the local storage
function saveBookData(){
    localStorage.setItem("bookArray", JSON.stringify(bookArray));
}
// function to reverse the isComplete value of a book data
function reverseBookData(id){
    for(const book of bookArray){
        if(book.id===id){
            if(book.isComplete===true){
                book.isComplete=false
            }else{
                book.isComplete=true;
            }
        }
    }

}
// function to delete book data by deleting it from the bookArray array
function deleteBookData(id){
    for(const book of bookArray){
        if(book.id===id){
            const index = bookArray.indexOf(book);
            bookArray.splice(index,1)
        }
    }
}
// event listener for move buttons' (green buttons) click
const moveButtons = document.getElementsByClassName("move_button");
for(const btn of moveButtons){
    btn.addEventListener("click", function(){
       const id = parseInt(event.target.parentNode.id);
       reverseBookData(id);
       saveBookData();
       location.reload()
    })
}
// event listeners' for delete buttons' (red buttons) click
const deleteButtons = document.getElementsByClassName("delete_button");
for(const btn of deleteButtons){
    btn.addEventListener("click", function(){
        const id = parseInt(event.target.parentNode.id);
        deleteBookData(id);
        saveBookData();
        location.reload()
    })
}
const checkbox = document.getElementById("inputBookIsComplete");
const isComplete = document.getElementById("Is_Complete");
checkbox.addEventListener("change", (event)=>{
    const checkboxChecked = event.target.checked;
    if(checkboxChecked === true){
        isComplete.innerText="selesai dibaca"
    }else{
        isComplete.innerText="belum selesai dibaca" 
    }
})
function autocomplete(input, array){
    // 1) currentFocus let
    let currentFocus;
    // 2) input eventListener
    input.addEventListener("input", function(e){
        let a, b, i, val = this.value;
        closeAllLists();
        if(!val){return false;}
        currentFocus = -1;

        a=document.createElement("div");
        a.setAttribute("id", this.id+"Autocomplete-list")
        a.classList.add("autocomplete-items")
        this.parentNode.appendChild(a);

        for(const i of array){
            if(i.substr(0, val.length).toUpperCase() == val.toUpperCase()){
                b=document.createElement("div");
                b.innerHTML="<strong>"+i.substr(0, val.length)+"</strong>";
                b.innerHTML+=i.substr(val.length);
                b.innerHTML+="<input type='hidden' value='"+i+"'>";
                b.addEventListener("click", function(e){
                    const targetBook = document.getElementById(i);
                    targetBook.scrollIntoView({behavior:"smooth"});
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    })
    input.addEventListener("keydown", function(e){
        let x = document.getElementById(this.id + "Autocomplete-list")
        if(x){
            x=x.getElementsByTagName("div");
            // arrow down key
            if(e.key=="ArrowDown"){
                currentFocus++;
                addActive(x);
                console.log(currentFocus);
            } 
            // arrow up key
            else if(e.key=="ArrowUp"){
                currentFocus--;
                addActive(x);
                console.log(currentFocus);
            }
            // enter key 
            else if(e.key=="Enter"){
                e.preventDefault();
                if(currentFocus>-1){
                    if(x){x[currentFocus].click()};
                }
            }
        }
    });
    function addActive(x){
        if(!x){return false};
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x){
        for(const i of x){
            i.classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(element){
        let x = document.getElementsByClassName("autocomplete-items");
        for(const i of x){
            if(element != i && element != input){
                i.parentNode.removeChild(i);
            }
        }
    }
    const searchButton = document.getElementById("searchSubmit");
    searchButton.addEventListener("click", function(){
        let val = document.getElementById("searchBookTitle").value;
        if(bookTitleArray.indexOf(val)!=-1){
            const targetBook = document.getElementById(bookTitleArray[bookTitleArray.indexOf(val)]);
            targetBook.scrollIntoView({behavior:"smooth"});
        } else {
            alert("Sorry, the book isn't here :(")
        }
        closeAllLists();
    })
}
document.addEventListener("keydown", function(e){
    if(e.key==Enter){
        e.preventDefault();}
})

autocomplete(document.getElementById("searchBookTitle"), bookTitleArray);

// emergency delete: localStorage.clear();
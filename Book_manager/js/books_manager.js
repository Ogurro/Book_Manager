$(document).ready(function () {

    loadBooks();
})
;

function loadBooks() {
    $.ajax(
        {
            url: "http://127.0.0.1:8000/book/",
            data: {},
            type: "GET",
            dataType: "json",
            success: booksSuccess,
            error: function () {
                console.log("error @ loading books");
                booksLoadingError();
            },
            complete: function () {
                console.log('Completed loading books');
                addEventHandler();
            }
        })
}

function booksSuccess(data) {
    let tableBody = $('#bookTable');
    tableBody.append(
        '<thead class="thead-dark">' +
            '<tr class="text-center">' +
                '<th>Tittle</th>' +
                '<th>Author</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>'
    );
    data.forEach(function (element) {
        let newRow = (
            '<tr id="book'+element['id']+'" class="text-center">'+
                '<td>' + element['title'] + '</td>' +
                '<td>' + element['author'] + '</td>' +
            '</tr>'
        );
        let emptyRow = $('<tr class="text-center d-none">');
        tableBody.append([newRow, emptyRow]);
    tableBody.append('</tbody>')
    });
}


function booksLoadingError() {
    let tableBody = $('#bookTable');
    tableBody.append(
        '<thead class="thead-dark">' +
            '<tr class="text-center">' +
                '<th colspan="2">Failed to load books!</thcol>' +
            '</tr>' +
        '</thead>'
    );
}

function addEventHandler() {
    // TO DO
}



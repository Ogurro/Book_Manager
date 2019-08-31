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
            '<tr data-bookid="' + element['id'] + '" class="text-center clickable">'+
                '<td>' + element['title'] + '</td>' +
                '<td>' + element['author'] + '</td>' +
            '</tr>'
        );
        let emptyRow = $('<tr data-bookinfoif="'+ element['id'] +'" class="text-center d-none book-info">');
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
    let clickableObject = $('.clickable');
    clickableObject.click(function () {
        $(this).toggleClass('table-success');
        $(this).next().toggleClass('d-none');
        loadBookInfo($(this).data('bookid'), $(this).next())
    })
}

function loadBookInfo (id, element) {
    if (element.children().length == 0) {
        if (id > 0) {
            $.ajax(
                {
                    url: "http://127.0.0.1:8000/book/" + id,
                    data: {},
                    type: "GET",
                    dataType: "json",
                    success: showBookInfoSuccess,
                    error: function () {
                        console.log("error @ loading specific book");
                    },
                    complete: function () {
                        console.log('Completed loading specific book');
                    }
                })
        }
    }

    function showBookInfoSuccess(data) {
        console.log(element);
        let newDiv = $('<div><table>');
        element.append(newDiv)
    }
}


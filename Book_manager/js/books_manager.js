$(document).ready(function () {

    loadBooks();
})
;
let genres = {
    '1': 'Romans',
    '2': 'Obyczajowa',
    '3': 'Sci-fi i fantasy',
    '4': 'Literatura faktu',
    '5': 'Popularnonaukowa',
    '6': 'Poradnik',
    '7': 'Kryminał, sensacja'
};


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
        let emptyRow = $('<div data-bookinfoif="'+ element['id'] +'" class="container justify-content-center d-none book-info">');
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
        let newDiv = $('<table class="table table-hover d-block-flex">');
        $.each(data, function (key, val){
            if (key != 'id') {
                let newRow = (
                    '<tr class="text-center">' +
                        '<td>' + key.charAt(0).toUpperCase()+key.slice(1) + '</td>' +
                        '<td>'+ (key == 'genre' ? genres[val] : val) +'</td>' +
                    '</tr>'
                );
                newDiv.append(newRow);
            }
        });
        element.append(newDiv);
    }
}


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
    data.reverse().forEach(function (element) {
        let newRow = (
            '<tr data-bookid="' + element['id'] + '" class="text-center clickable">'+
                '<td>' + element['title'] + '</td>' +
                '<td>' + element['author'] + '</td>' +
            '</tr>'
        );
        let emptyRow = $('<div data-bookinfoid="'+ element['id'] +'" class="container justify-content-center d-none book-info">');
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
    } else {
        $('.cancel-button').remove();
        $('.confirm-button').remove();
        $('.delete-button').removeClass('d-none');
        $('.edit-button').removeClass('d-none');
    }

    function showBookInfoSuccess(data) {
        let newDiv = $('<table class="table table-hover mb-0">');
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
        element.append(addDeleteButton());
        element.append(addEditButton());
    }

    function addEditButton () {
        let editButton= $('<button class="btn btn-primary mt-0 mb-3 mr-3 edit-button">').text('Edit');
        editButton.click(function (){
            editBook()
        });
        return editButton
    }

    function addDeleteButton () {
        let deleteButton = $('<button class="btn btn-danger mt-0 mb-3 mr-3 delete-button">').text('Delete');
        deleteButton.click(function (){
            deleteBook();
        });
        return deleteButton
    }

    function editBook(){
        console.log('edit me')
    }

    function deleteBook(){
        $('.delete-button').toggleClass('d-none');
        $('.edit-button').toggleClass('d-none');
        let confirmButton = $('<button class="btn btn-danger mt-0 mb-3 mr-3 confirm-button">').text('Confirm');
        let cancelButton= $('<button class="btn btn-secondary mt-0 mb-3 mr-3 cancel-button">').text('Cancel');
        element.append(cancelButton);
        element.append(confirmButton);
        cancelButton.click(function (){
            $('.delete-button').toggleClass('d-none');
            $('.edit-button').toggleClass('d-none');
            confirmButton.remove();
            cancelButton.remove();
        });
        confirmButton.click(function () {
            confirmedDeleteBook(id);
        })
    }
}

function confirmedDeleteBook(id) {
    $.ajax({
        url: "http://127.0.0.1:8000/book/" + id,
        data: {},
        type: "DELETE",
        dataType: "json",
        success: function (data) {
            console.log('delete book success');
            $('tr[data-bookid="'+id+'"]').remove();
            $('div[data-bookinfoid="'+id+'"]').remove();
        },
        error: function () {
            console.log('error @ delete book confirm');
        },
        complete: function () {
            console.log('complete delete book');
            $('.delete-button').removeClass('d-none');
            $('.edit-button').removeClass('d-none');
        }
    })
}


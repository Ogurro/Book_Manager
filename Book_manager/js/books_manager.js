$(document).ready(function () {
    loadBooks();
});

let mainUrl = 'http://localhost:8000/';

let genres = {
    '1': 'Romans',
    '2': 'Obyczajowa',
    '3': 'Sci-fi i fantasy',
    '4': 'Literatura faktu',
    '5': 'Popularnonaukowa',
    '6': 'Poradnik',
    '7': 'Kryminał, sensacja'
};

function createSectionAddBook() {
    let bodyDiv = $('body > div');
    let addBookButton = $('<button class="btn btn-secondary mt-3 add-book">').text('Add Book');
    let newDiv = $('<div class="container d-none w-50">');
    bodyDiv.prepend([addBookButton, newDiv]);
    addBookButton.click(function () {
        $(this).next().removeClass('d-none');
        addBookClicked($(this).next());
        $(this).addClass('d-none');
    });
}

function addBookClicked(element) {
    let newTable = $('<table class="table table-secondary mt-3 mb-0 new-book-table">');
    newTable.append(
        '<thead class="thead-dark">' +
            '<tr class="text-center">' +
                '<th colspan="2">Add new book</thco>' +
            '</tr>' +
        '</teahd>' +
        '<tbody>' +
            '<tr>' +
                '<th>Author</td>' +
                '<td><input name="author" type="text"></td>' +
            '</tr>' +
            '<tr>' +
                '<th>Title</td>' +
                '<td><input name="title" type="text"></td>' +
            '</tr>' +
            '<tr>' +
                '<th>Isnb</td>' +
                '<td><input name="isbn" type="text"></td>' +
            '</tr>' +
            '<tr>' +
                '<th>Publisher</td>' +
                '<td><input name="publisher" type="text"></td>' +
            '</tr>' +
            '<tr>' +
                '<th>Genre</th>' +
                '<td>'+ getGenreSelect() +'</td>'+
            '</tr>' +
        '</tbody>');
    let addNewBookBtn = $('<button class="btn btn-primary mt-0 mr-3 confirm-add-book">').text('Add New Book');
    let addNewCancelBtn = $('<button class="btn btn-secondary mt-0 mr-3 cancel-add-book">').text('Cancel');
    addNewBookBtn.click(function () {
       confirmAddBook();
    });
    addNewCancelBtn.click(function(){
        $('button.add-book').toggleClass('d-none');
        $(this).prev().prev().remove();
        $(this).prev().remove();
        $(this).remove()
    });
    element.append([newTable, addNewBookBtn, addNewCancelBtn]);
}

function confirmAddBook() {
    $.ajax({
        url: mainUrl + 'book/',
        data: getNewBookJson(),
        type: 'POST',
        dataType: 'json'
    })
        .done(function () {
            console.log('added new book to db');
            location.reload();
        })
        .fail(function () {
            console.log('failed @ add new book');
        })
        .always(function () {
            console.log('complete add new book')
        })
}

function getNewBookJson() {
    let data = {};
    $.each($('table.new-book-table  input'), function () {
        let name = $(this).attr('name');
        let value = $(this).val();
        data[name] = value;
    });
    data['genre'] = $('table.new-book-table select[name="genre"]').val();
    return data
}


function getGenreSelect(num=0) {
    let rv = '<select name="genre">\n';
    if (num == 0) rv += '<option></option>';
    $.each(genres, function (key, val) {
        rv += '<option value="' + key + '" ';
        if (key == num) rv += 'selected';
        rv += '>' + val + '</option>\n';
    });
    rv += '</select>\n';
    return rv
}

function loadBooks() {
    $.ajax(
        {
            url: mainUrl + 'book/',
            data: {},
            type: 'GET',
            dataType: 'json',
            success: function (data){
                booksSuccess(data);
                createSectionAddBook();
            },
            error: function () {
                console.log('error @ loading books');
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
                '<th>Books</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>'
    );
    data.reverse().forEach(function (element) {
        let newRow = (
            '<tr data-bookid="' + element['id'] + '" class="text-center clickable">' +
            '<td>' + element['title'] + '&emsp;-&emsp;' + element['author'] + '</td>' +
            '</tr>'
        );
        let emptyRow = $('<div data-bookinfoid="' + element['id'] + '" class="d-block-flex d-none book-info">');
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

function resetActionButtonsAndFields() {
    $('.cancel-button').remove();
    $('.confirm-button').remove();
    $('.save-button').remove();
    $('.delete-button').removeClass('d-none');
    $('.edit-button').removeClass('d-none');
    restoreFields();
    restoreTables()
}

function restoreTables() {
    $.each($('.table-warning'), function () {
        $(this).toggleClass('table-secondary table-warning')
    });
    $.each($('.table-danger'), function () {
        $(this).toggleClass('table-success table-danger')
    });
}

function restoreFields() {
    $.each($('input'), function () {
        $(this).parent().text($(this).data('orgval'));
    });
    $.each($('select'), function () {
        $(this).parent().text($(this).find('option[selected]').text());
    });
}

function loadBookInfo(id, element) {
    if (element.children().length == 0) {
        if (id > 0) {
            $.ajax(
                {
                    url: mainUrl + 'book/' + id,
                    data: {},
                    type: 'GET',
                    dataType: 'json',
                    success: showBookInfoSuccess,
                    error: function () {
                        console.log('error @ loading specific book');
                    },
                    complete: function () {
                        console.log('Completed loading specific book');
                    }
                });
            resetActionButtonsAndFields()
        }
    } else {
        resetActionButtonsAndFields()
    }

    function showBookInfoSuccess(data) {
        let newTable = $('<table class="table table-striped table-secondary table-borderless table-hover flex mb-0">');
        $.each(data, function (key, val) {
            if (key != 'id') {
                let newRow = (
                    '<tr>' +
                    '<td>' + key.charAt(0).toUpperCase() + key.slice(1) + '</td>' +
                    '<td class="editable ' + key + '" ' + (key == 'genre' ? 'data-genrenum="' + val + '"' : '') + '>' + (key == 'genre' ? genres[val] : val) + '</td>' +
                    '</tr>'
                );
                newTable.append(newRow);
            }
        });
        element.append(newTable);
        element.append(addDeleteButton());
        element.append(addEditButton());
    }

    function addEditButton() {
        let editButton = $('<button class="btn btn-primary mt-0 mb-3 mr-3 edit-button">').text('Edit');
        editButton.click(function () {
            editBook()
        });
        return editButton
    }


    function editBook() {
        $('.delete-button').toggleClass('d-none');
        $('.edit-button').toggleClass('d-none');
        let cancelButton = $('<button class="btn btn-secondary mt-0 mb-3 mr-3 cancel-button">').text('Cancel');
        let saveButton = $('<button class="btn btn-primary mt-0 mb-3 mr-3 save-button">').text('Save');
        element.append(cancelButton);
        element.append(saveButton);
        cancelButton.click(function () {
            resetActionButtonsAndFields();
        });
        let editableFields = element.find('td.editable');
        editableFields.each(function () {
            let html = $(this).html();
            let input = '';
            if ($(this).hasClass('genre')) {
                input = getGenreSelect($(this).data('genrenum'));
            } else {
                input = $('<input name="' + $(this).siblings().html().toLowerCase() + '" type="text" data-orgval="' + html + '">');
                input.val(html);
            }
            $(this).html(input);
        });
        saveButton.click(function () {
            editBookConfirm(id, element);
            resetActionButtonsAndFields();
        })
    }

    function addDeleteButton() {
        let deleteButton = $('<button class="btn btn-danger mt-0 mb-3 mr-3 delete-button">').text('Delete');
        deleteButton.click(function () {
            deleteBook();
        });
        return deleteButton
    }

    function deleteBook() {
        $('.delete-button').toggleClass('d-none');
        $('.edit-button').toggleClass('d-none');
        let confirmButton = $('<button class="btn btn-danger mt-0 mb-3 mr-3 confirm-button">').text('Confirm');
        let cancelButton = $('<button class="btn btn-secondary mt-0 mb-3 mr-3 cancel-button">').text('Cancel');
        element.append(cancelButton);
        element.append(confirmButton);
        cancelButton.siblings('table').toggleClass('table-secondary table-warning');
        let dataToDeleteRow = cancelButton.parent().prev().toggleClass('table-success table-danger');
        console.log(dataToDeleteRow);
        cancelButton.click(function () {
            resetActionButtonsAndFields();
        });
        confirmButton.click(function () {
            confirmedDeleteBook(id);
        })
    }

    function editBookConfirm(id, element) {
        $.ajax({
            url: 'http://127.0.0.1:8000/book/' + id,
            data: getEditBookJson(element),
            type: 'PUT',
        })
            .done(function (data) {
                $('tr[data-bookid="' + data.id + '"]').children().html(data['title'] + '&emsp;-&emsp;' + data['author']);
                $('div[data-bookinfoid="' + data['id'] + '"]').html('');
                showBookInfoSuccess(data)
            })
            .fail(function (data) {
                console.log('error at saving book data' + data['responseText'])
            })
            .always(function () {
                console.log('complete saving book data')
            })
    }

    function confirmedDeleteBook(id) {
        $.ajax({
            url: "http://127.0.0.1:8000/book/" + id,
            data: {},
            type: "DELETE",
            dataType: "json",
            success: function () {
                console.log('delete book success');
                $('tr[data-bookid="' + id + '"]').remove();
                $('div[data-bookinfoid="' + id + '"]').remove();
            },
            error: function () {
                console.log('error @ delete book confirm');
            },
            complete: function () {
                console.log('complete delete book');
                resetActionButtonsAndFields();
            }
        })
    }

    function getEditBookJson(element) {
        let data = {};
        $.each(element.find('.editable > input'), function () {
            let name = $(this).attr('name');
            let value = $(this).val();
            data[name] = value;
        });
        data['genre'] = $('select[name="genre"]').val();
        return data
    }
}


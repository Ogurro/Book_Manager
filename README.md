# Book Manager
### First attempts of creating one page application using AJAX and REST 
I've used jQuery AJAX to connect to Django REST API endpoints to receive and modify data. 

* Main view

> Books are loaded when entering page.
> After clicking specific book more information about it is shown with additional options.

![Screenshot](/img/main_view.png)
![Screenshot](/img/main_view_2.png)

* Edit

> Enables option to edit specific book.
> Saving edited fields will update record in database vis REST API and refresh data for specific book.
> Expanding different book or clicking `Cancel button` will revert changes to previous state.

![Screenshot](/img/edit_view.png)

* Delete

> Enables option to remove specific book from data base. Require confirmation.
> Confirming deletion of book will remove specific book from existing view.
> Expanding different book or clicking `Cancel button` will revert changes to previous state.

![Screenshot](/img/delete_view.png)

* Add book

> Allows to add new book to data base by creating form. All fields are required for book to be added.

![Screenshot](/img/add_book_view.png)

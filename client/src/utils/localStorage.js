// Function to get saved book IDs from localStorage
export const getSavedBookIds = () => {
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : [];

  return savedBookIds;
};

// Function to save book IDs to localStorage
export const saveBookIds = (bookIdArr) => {
  if (bookIdArr.length) {
    // If there are book IDs, save them to localStorage
    localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
  } else {
    // If there are no book IDs, remove the 'saved_books' key from localStorage
    localStorage.removeItem('saved_books');
  }
};

// Function to remove a specific book ID from localStorage
export const removeBookId = (bookId) => {
  // Get saved book IDs from localStorage
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : null;

  if (!savedBookIds) {
    // If there are no saved book IDs, return false
    return false;
  }

  // Filter out the specified book ID
  const updatedSavedBookIds = savedBookIds?.filter((savedBookId) => savedBookId !== bookId);

  // //Testing
  //console.log("test", savedBookIds)
  //console.log("test", updatedSavedBookIds)

  // Save the updated book IDs to localStorage
  localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));

  return true;
};
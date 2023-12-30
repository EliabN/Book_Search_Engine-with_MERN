import { useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
// Clear the entire localStorage
//localStorage.clear();

const SavedBooks = () => {
  const [removeBook] = useMutation(REMOVE_BOOK);

  const { loading, data, refetch } = useQuery(GET_ME);

  const userData = data?.me || {};

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data: mutationData } = await removeBook({
        variables: { bookId, token },
      });

      // Check if there's an error in the mutation response
      if (mutationData.removeBook.error) {
        throw new Error('something went wrong!');
      }

      // Assuming 'updatedUser' is part of the response data
      const updatedUser = data.me;

      //setUserData(updatedUser);
      console.log(updatedUser)
      removeBookId(bookId);
      console.log("test", bookId)
      //data = refetch();
    } catch (err) {
      console.error(err);
    }
  };


  // if data isn't here yet, say so
  if (loading) {
    return <div>Loading...</div>;
  } else {
    // Now you can safely access data.me
    console.log(data);
    console.log(userData.savedBooks)
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container fluid>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => (
            <Col md="4" key={book.bookId}>
              <Card border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;




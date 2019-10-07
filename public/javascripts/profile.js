window.onload = () => {
  let coord = document.getElementById('coord').value;
  coord = `[${coord}]`;
  coord = JSON.parse(coord.toString());
  coord = {
    lat: coord[1],
    lng: coord[0],
  };
  addSingleMarker(coord);

  // build carousel for vegspot comments
  async function buildVegspotCommentCarousel() {
    document.getElementById('vegspotCommentJavascript').innerHTML = '';
    const userId = document.getElementById('authorId').value;
    const spotId = document.getElementById('spotId').value;
    const vegspotComment = await getComment({ spotId });
    console.log(vegspotComment);
    vegspotComment.forEach((comment) => {
      document.getElementById('vegspotCommentJavascript').innerHTML += ` 
        <div class="carousel-item eachCompleteReview">
          <input type="hidden" value=${comment.authorId} class="commentAuthorId">
          <input type="hidden" value=${comment._id} class="reviewId">
          <p class="carousel-review text-white authorNameReview">${comment.authorName}</p>
          <span class="carousel-review text-white">Avaliação: </span> <span class="carousel-review text-white ratingReview">${comment.rating}</span>
          <p class="carousel-review text-white titleReview">${comment.title}</p>
          <p class="carousel-review text-white textReview">${comment.text}</p>
          <div class="editAllowed"></div>
        </div>
      `;
    });

    // <p class="carousel-review text-white">${comment.date.day}/${comment.date.month}/${comment.date.year}</p>
    const editButton = document.querySelectorAll('.editAllowed');
    console.log(editButton)
    editButton.forEach((button, index) => {
      console.log('authorid', vegspotComment[index].authorId, 'userid', userId)
      if (vegspotComment[index].authorId === userId) {
        button.innerHTML += `
        <button class="editReviewButton">editar</button>
        <button class="deleteReviewButton">deletar</button>
        <div class="editFieldCheck"></div>
        `;
      }
    })
    document.querySelector('.eachCompleteReview').classList.add('active');
    reviewComment();
  }

  // Verify if vegspot comments are from the logged user, if it is, then he can edit
  function reviewComment() {
    const editReviewButton = document.querySelectorAll('.editReviewButton');
    const deleteReviewButton = document.querySelectorAll('.deleteReviewButton');
    if (editReviewButton.length) {
      let beingEdited = false;
      editReviewButton.forEach((editButton, index) => {
        editButton.onclick = function editReview() {
          document.getElementById('carouselVegspotReviews').setAttribute('data-interval', 'false');
          console.log(document.getElementById('carouselVegspotReviews'));
          if (beingEdited) {
            console.log('voce so pode editar um por vez');
          } else {
            beingEdited = true;
            const newCompleteReview = document.querySelectorAll('.eachCompleteReview')[index];
            const oldCompleteReview = document.querySelectorAll('.eachCompleteReview')[index].innerHTML;
            const titleField = document.querySelectorAll('.titleReview');
            const textField = document.querySelectorAll('.textReview');
            const ratingField = document.querySelectorAll('.ratingReview');
            const ratingCheckItem = Number(ratingField[index].textContent);
            titleField[index].innerHTML = `
            <input id="titleFieldEdit" value=${titleField[index].textContent}>
            `;
            textField[index].innerHTML = `
            <textarea id="textFieldEdit">${textField[index].textContent}</textarea>
            `;
            ratingField[index].innerHTML = `
            <div class="form-check form-check-inline">
              <input class="form-check-input checkValueEdit" type="radio" name="rating" value="1">
              <label class="form-check-label" for="rating1">1</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input checkValueEdit" type="radio" name="rating" value="2">
              <label class="form-check-label" for="rating2">2</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input checkValueEdit" type="radio" name="rating" value="3">
              <label class="form-check-label" for="rating3">3</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input checkValueEdit" type="radio" name="rating" value="4">
              <label class="form-check-label" for="rating4">4</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input checkValueEdit" type="radio" name="rating" value="5">
              <label class="form-check-label" for="rating5">5</label>
            </div><br>
            `;
            document.querySelectorAll('.checkValueEdit')[ratingCheckItem - 1].checked = true;
            editReviewButton[index].innerHTML = 'Enviar';
            deleteReviewButton[index].innerHTML = 'Cancelar';
            editReviewButton[index].onclick = async function sendReviewedComment() {
              document.querySelectorAll('.editFieldCheck')[index].innerHTML = '';
              const title = document.getElementById('titleFieldEdit').value;
              const text = document.getElementById('textFieldEdit').value;
              console.log(title, text);
              let rating;
              const ratingButton = document.querySelectorAll('.checkValueEdit');
              ratingButton.forEach((userEval, index) => {
                if (userEval.checked === true) {
                  rating = index + 1;
                }
              });
              const commentId = document.querySelectorAll('.reviewId')[index].value;
              const spotId = document.getElementById('spotId').value;
              const authorId = document.getElementById('authorId').value;
              const authorName = document.getElementById('authorName').value;
              console.log('commentid', commentId, 'spotid', spotId, 'authorid', authorId, authorName, title, text, rating);
              if (title === '' || text === '' || rating === '') {
                document.querySelectorAll('.editFieldCheck')[index].innerHTML = `
                <b>Complete todos os campos</b>
                `;
              } else {
                const editResult = await editComment({
                  commentId, spotId, authorId, authorName, title, text, rating,
                });
                if (editResult === true) {
                  console.log('dados editados com sucesso');
                  newCompleteReview.innerHTML = oldCompleteReview;
                  document.querySelectorAll('.ratingReview')[index].textContent = rating;
                  document.querySelectorAll('.titleReview')[index].textContent = title;
                  document.querySelectorAll('.textReview')[index].textContent = text;
                  buildVegspotCommentCarousel();
                }
              }
            };
            deleteReviewButton[index].onclick = function cancelReviewedComment() {
              newCompleteReview.innerHTML = oldCompleteReview;
              reviewComment();
              console.log('rodei de novo?');
            };
          }
        };
      });
      deleteReviewButton.forEach((deleteButton, index) => {
        deleteButton.onclick = async function deleteReview() {
          const newCompleteReview = document.querySelectorAll('.eachCompleteReview')[index];
          const commentId = document.querySelectorAll('.reviewId')[index].value;
          const deleteResult = await deleteComment({ commentId });
          if (deleteResult === true) {
            console.log('deletado com sucesso', commentId);
            buildVegspotCommentCarousel();
          }
        };
      });
    }
  }

  buildVegspotCommentCarousel();
  
  // verify if all information is complete when submitting a comment, if user is logged (mandatory)
  document.getElementById('sendComment').onclick = async function addComment(event) {
    event.preventDefault();
    let authorId;
    let authorName;
    document.getElementById('submitResult').innerHTML = '';
    if (document.getElementById('authorId') !== null) {
      authorId = document.getElementById('authorId').value;
      authorName = document.getElementById('authorName').value;
    } else {
      authorId = false;
      document.getElementById('submitResult').innerHTML = `
      <b>Voce precisa estar logado para enviar um comentario</b>
      `;
      return;
    }
    const spotId = document.getElementById('spotId').value;
    const title = document.getElementById('postTitle').value;
    const text = document.getElementById('postText').value;
    let rating;
    const ratingButton = document.querySelectorAll('.checkValue');
    ratingButton.forEach((userEval, index) => {
      if (userEval.checked === true) {
        rating = index + 1;
      }
    });
    if (title == '' || text == '' || rating === undefined) {
      document.getElementById('submitResult').innerHTML = `
      <b>Preencha todos os campos</b>
      `;
    } else {
      const saveResult = await saveComment({
        authorId, authorName, spotId, title, text, rating,
      });
      if (saveResult === true) {
        buildVegspotCommentCarousel();
        document.getElementById('submitResult').innerHTML = `
        <b>Comentario enviado com sucesso</b>
        `;
        document.getElementById('postTitle').value = '';
        document.getElementById('postText').value = '';
        document.querySelectorAll('.checkValue').forEach((ratingValue) => {
          ratingValue.checked = false;
        });
      }
    }
  };
};

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
    let userId = undefined;
    document.getElementById('vegspotCommentJavascript').innerHTML = '';
    if (document.getElementById('authorId') !== null) {
      userId = document.getElementById('authorId').value;
    }
    const spotId = document.getElementById('spotId').value;
    const vegspotComment = await getComment({ spotId });
    if (vegspotComment.length) {
      vegspotComment.forEach((comment) => {
        let edited = '';
        if (comment.created_at !== comment.updated_at) {
          edited = 'Editado em';
        }
        document.getElementById('vegspotCommentJavascript').innerHTML += ` 
          <div class="carousel-item eachCompleteReview">
            <input type="hidden" value=${comment.authorId} class="commentAuthorId">
            <input type="hidden" value=${comment._id} class="reviewId">
            <p class="carousel-review text-white authorNameReview">${comment.authorName}</p>
            <p class="carousel-review text-white">${edited} ${convertDate(comment.updated_at)}</p>
            <span class="carousel-review text-white">Avaliação: </span> <span class="carousel-review text-white ratingReview">${comment.rating}</span>
            <p class="carousel-review text-white titleReview">${comment.title}</p>
            <p class="carousel-review text-white textReview">${comment.text}</p>
            <div class="editAllowed"></div>
          </div>
        `;
      });
  
      //check if user is the same as author so edit button appears
      const editButton = document.querySelectorAll('.editAllowed');
      const reviewIndex = [];
      editButton.forEach((button, index) => {
        if (vegspotComment[index].authorId === userId) {
          reviewIndex.push(index);
          button.innerHTML += `
          <button class="editReviewButton btn btn-info">editar</button>
          <button class="deleteReviewButton btn btn-info">deletar</button>
          <div class="editFieldCheck"></div>
          `;
        }
      });
      document.querySelector('.eachCompleteReview').classList.add('active');
      reviewComment(reviewIndex);
    } else {
      document.getElementById('vegspotCommentJavascript').innerHTML = `
      <p class="text-center text-white">Ainda não temos avaliações, seja o primeiro a fazer!</p>
      `;
    }
  }

  // Verify if vegspot comments are from the logged user, if it is, then he can edit
  function reviewComment(reviewIndex) {
    const editReviewButton = document.querySelectorAll('.editReviewButton');
    const deleteReviewButton = document.querySelectorAll('.deleteReviewButton');
    if (editReviewButton.length) {
      let beingEdited = false;
      editReviewButton.forEach((editButton, index) => {
        editButton.onclick = function editReview() {
          $('#carouselVegspotReviews').carousel('pause');
          if (beingEdited) {
            Window.alert('voce so pode editar um por vez');
          } else {
            beingEdited = true;
            const newCompleteReview = document.querySelectorAll('.eachCompleteReview')[reviewIndex[index]];
            const oldCompleteReview = document.querySelectorAll('.eachCompleteReview')[reviewIndex[index]].innerHTML;
            const titleField = document.querySelectorAll('.titleReview');
            const textField = document.querySelectorAll('.textReview');
            const ratingField = document.querySelectorAll('.ratingReview');
            const ratingCheckItem = Number(ratingField[reviewIndex[index]].textContent);
            titleField[reviewIndex[index]].innerHTML = `
            <input id="titleFieldEdit" value=${titleField[reviewIndex[index]].textContent}>
            `;
            textField[reviewIndex[index]].innerHTML = `
            <textarea id="textFieldEdit">${textField[reviewIndex[index]].textContent}</textarea>
            `;
            ratingField[reviewIndex[index]].innerHTML = `
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
              let rating;
              const ratingButton = document.querySelectorAll('.checkValueEdit');
              ratingButton.forEach((userEval, ratingIndex) => {
                if (userEval.checked === true) {
                  rating = ratingIndex + 1;
                }
              });
              const commentId = document.querySelectorAll('.reviewId')[reviewIndex[index]].value;
              const spotId = document.getElementById('spotId').value;
              const authorId = document.getElementById('authorId').value;
              const authorName = document.getElementById('authorName').value;
              if (title === '' || text === '' || rating === '') {
                document.querySelectorAll('.editFieldCheck')[index].innerHTML = `
                <b>Complete todos os campos</b>
                `;
              } else {
                const editResult = await editComment({
                  commentId, spotId, authorId, authorName, title, text, rating,
                });
                if (editResult === true) {
                  buildVegspotCommentCarousel();
                }
              }
            };
            deleteReviewButton[index].onclick = function cancelReviewedComment() {
              newCompleteReview.innerHTML = oldCompleteReview;
              reviewComment(reviewIndex);
              $('#carouselVegspotReviews').carousel({
                interval: 2000,
                pause: 'true',
              });
            };
          }
        };
      });
      deleteReviewButton.forEach((deleteButton, index) => {
        deleteButton.onclick = async function deleteReview() {
          const commentId = document.querySelectorAll('.reviewId')[index].value;
          const deleteResult = await deleteComment({ commentId });
          if (deleteResult === true) {
            buildVegspotCommentCarousel();
            document.getElementById('submitResult').scrollIntoView();
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
      document.getElementById('submitResult').scrollIntoView();
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
        document.getElementById('submitResult').scrollIntoView();
        document.getElementById('postTitle').value = '';
        document.getElementById('postText').value = '';
        document.querySelectorAll('.checkValue').forEach((ratingValue) => {
          ratingValue.checked = false;
        });
      }
    }
  };
};

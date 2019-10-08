

// const url = 'https://project-vegspot.herokuapp.com';
const url = 'http://localhost:3000';

async function getNearPlaces(maxDistance, position) {
  const results = await axios.post(`${url}/`, { position, maxDistance });
  return results;
}

async function getComment(commentId) {
  const getResult = await axios.post(`${url}/comment/get`, commentId);
  return getResult.data;
}

async function saveComment(comment) {
  const saveResult = await axios.post(`${url}/comment/add`, comment);
  return saveResult.data;
}

async function editComment(comment) {
  const editResult = await axios.post(`${url}/comment/edit`, comment);
  return editResult.data;
}

async function deleteComment(commentId) {
  console.log(commentId);
  const deleteResult = await axios.post(`${url}/comment/delete`, commentId);
  return deleteResult.data;
}

function convertDate(isoDate) {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }
  return `${day}/${month}/${year}`;
}

function averageRating(commentArray) {
  let average = 0;
  if ((commentArray.length)) {
    commentArray.forEach((review) => {
      average += review.rating;
    });
    average /= commentArray.length;
  }
  return average;
}

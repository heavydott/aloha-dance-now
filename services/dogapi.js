const { default: axios } = require('axios');
const dogApi = 'https://dog.ceo/api/breeds/image/random/50';
const count = 100;

const getDataFromDogsApi = async () => {
  return Promise.resolve(axios.get(dogApi));
};

const prepareDataFromDogApi = async (data) => {
  const result = [];
  for (let i = 0; i < data.data.message.length; i++) {
    // for (let j = 0; j < data[i].data.message.length; j++) {
    result.push(breedParseUrl(data.data.message[i]));
    // }
  }
  return result;
};

const breedParseUrl = (url) => {
  const pathname = new URL(url).pathname;
  const match = pathname.match(/[^/?]*[^/?]/g);
  return {
    breed: match[1],
    title: match[2].split('.')[0],
    image: url,
  };
};

const prepareWithoutDoubles = (data, newData) => {
  const result = newData.filter(function (curr, index) {
    let flag = data.find(function (curr2) {
      if (curr.breed == curr2.breed) {
        return true;
      }
    });
    if (!flag && data.length + (index + 1) <= count) {
      return curr;
    }
  });
  return result;
};

const getData = async (arr) => {
  const dataFromApi = await getDataFromDogsApi(); // достаю рандомные 50
  const data = await prepareDataFromDogApi(dataFromApi); // привожу их в порядок, вид, которые мне нужен
  const checkedData = prepareWithoutDoubles(arr, data); // проверяю повторки
  let result = arr.concat(checkedData); // соединяю с общими данными (изначально пустой массив)
  if (result.length < count) {
    result = await getData(result); // если меньше ста - рекурсия
  }
  return result;
};

const get = async () => {
  const data = await getData([]);
  return data;
};

module.exports = { get };

const express = require('express');
const { connectDb } = require('./utils/db');
const cors = require('cors');
const dogApiService = require('./services/dogapi');
const dbService = require('./services/db');
const { CustomError } = require('./errors/db-error');
const { NO_CONTENT } = require('http-status-codes');
const { errorHandler, catchDecorator } = require('./utils/error-handling');

const app = express();

app.use(cors());
app.use(express.json());

async function bootstrap() {
  let data;
  let breedFilter, search;

  // get data from DogApi
  app.use(async (req, res, next) => {
    data = await dogApiService.get();
    next();
  });

  // pagination, breedFilter and searching
  app.use((req, res, next) => {
    if (req.query.breed) {
      breedFilter = req.query.breed;
    }
    if (req.query.q) {
      search = req.query.q;
    }
    next();
  });

  // db collections
  app.use(async (req, res, next) => {
    await dbService.removeAll();
    console.log('clear db');
    await dbService.save(data);
    next();
  });

  app.use('/', catchDecorator(async (req, res) => {
      res.json(await dbService.get(breedFilter, search));
  }));

  app.use(errorHandler);

  app.listen(3000, () => {
    console.log('App is running');
  });
}

connectDb(bootstrap);

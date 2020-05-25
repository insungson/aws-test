const express = require('express');
const { Client, Status } = require('@googlemaps/google-maps-services-js');

const router = express.Router();


router.post('/nearby', (req, res, next) => {
    const client = new Client({});
    client.placesNearby({
      params: {
        key: process.env.GOOGLE_KEY,
        location: req.body.data,
        radius: 2000,
        type: req.body.type,
        language: 'ko',
      }
    })
    .then((r) => {
      if (r.data.status === Status.OK) {
        console.log(r.data.results);
        return res.json(r.data.results);
      } else {
        console.log(r.data.error_message);
      }
    })
    .catch((e) => {
      console.log(e);
      next(e);
    });
  });

router.get('/:place', (req, res, next) => {
  const client = new Client({});
  client
  .findPlaceFromText({
    params: {
      key: process.env.GOOGLE_KEY,
      input: decodeURIComponent(req.params.place),
      inputtype: 'textquery',
      language: 'ko',
    },
    timeout: 1000, // milliseconds
  })
  .then((r) => {
    if (r.data.status === Status.OK) {
      console.log(r.data);
      return res.json(r.data.candidates[0]);
    } else {
      console.log(r.data.error_message);
    }
  })
  .catch((e) => {
    console.log(e);
  });

  // try {
  //   console.log('장소 던?',decodeURIComponent(req.params.place))
  //   const client = await new Client({});
  //   client.findPlaceFromText({
  //     key: process.env.GOOGLE_KEY,
  //     input: decodeURIComponent(req.params.place),
  //     inputtype: 'textquery',
  //     language: 'ko',
  //   }, (err, response) => {
  //     if(err) {
  //       return next(err);
  //     }
  //     console.log('위치정보', response.json.candidates);
  //     return res.json(response.json.candidates);
  //   });
  // } catch (e) {
  //   console.error(e);
  //   next(e);
  // }
});

router.post('/', (req, res, next) => {
  const client = new Client({});
  client.placeDetails({
    params: {
      key: process.env.GOOGLE_KEY,
      place_id: req.body.data.place_id,
      language: 'ko',
    },
  })
  .then((r) => {
    if (r.data.status === Status.OK) {
      console.log('장소디테일', r.data.result);
      return res.json(r.data.result);
    } else {
      console.log(r.data.error_message);
    }
  })
  .catch((e) => {
    console.log(e);
  });
});


module.exports = router;
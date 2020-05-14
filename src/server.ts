import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { config } from './config/config';

import Jimp = require('jimp');

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  const cfg = config;

  
// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get("/filteredimage", async (requests, response) => {
    //
    let { image_url } = requests.query;
    
    // return error if parameter is missing
    if (!image_url) {
      response.status(200).send("image url missing")
    }else {

      // return error if image url format is incorrect
      console.log(image_url.match(image_url_regex))
      if (!image_url.match(image_url_regex)) {
        res.status(200).send("image url format is incorrect, example url : https://some_domain(like google.com)/probably_some_more_paths/image_name.png/jpg/gif")
      }else {
        
        try {
          let image_response = await filterImageFromURL(image_url)
          // if image reader does not fail return image else return error
          if(image_response != "no image found"){
            response.status(400).sendFile(image_response, async callback=>{
              await deleteLocalFiles([image_response])
            })
          } else {
            response.status(400).send("no image found in the given url")
          }
        } catch (err) {
          // other errors
          console.error(err)
          response.status(400).send("image processing failed")
        }
      }
    }

    //
  } );



  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( requests, response ) => {
    response.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
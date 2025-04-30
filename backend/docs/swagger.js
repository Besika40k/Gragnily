const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });
require("dotenv").config();

const doc = {
  info: {
    title: "Gragnily API",
    version: "1.6.9",
    description: "Backend Of Gragnily Designed By Giorgi Mikaberidze",
  },
  servers: [
    {
      url: "https://gragnily.onrender.com",
      description: "Production Server",
    },
    {
      url: `http://localhost:${process.env.PORT}`,
      description: "Local Development",
    },
  ],
  components: {
    securitySchemes: {
      xAccessToken: {
        type: "apiKey",
        in: "header",
        name: "x-access-token",
      },
    },
    schemas: {
      Author: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          name_ge: { type: "string" },
          biography: { type: "string" },
          biography_ge: { type: "string" },
          birth_year: { type: "integer" },
          nationality: { type: "string" },
          profile_picture_url: { type: "string" },
          profile_picture_public_id: { type: "string" },
        },
      },
      Book: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          title_ge: { type: "string" },
          author: {
            type: "array",
            items: {
              type: "object",
              properties: {
                author_id: { type: "string" },
              },
            },
          },
          genre: {
            type: "array",
            items: { type: "string" },
          },
          genre_ge: {
            type: "array",
            items: { type: "string" },
          },
          description: { type: "string" },
          description_ge: { type: "string" },
          publisher_name: { type: "string" },
          publication_year: { type: "integer" },
          language: { type: "string" },
          language_ge: { type: "string" },
          page_count: { type: "integer" },
          cover_image_url: { type: "string" },
          ci_public_id: { type: "string" },
          pdf_url: {
            type: "array",
            items: { type: "string" },
          },
          pdf_public_id: {
            type: "array",
            items: { type: "string" },
          },
          epub_url: { type: "string" },
          epub_public_id: { type: "string" },
        },
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const routes = ["../server.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);

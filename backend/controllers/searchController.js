const asyncHandler = require("express-async-handler");
const book = require("../models/book");
const essay = require("../models/essay");

const searchController = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Search for Books and Essays'*/

  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query is required" });
  }

  const books = await book.aggregate([
    {
      $search: {
        index: "titleSearchIndex",
        text: {
          query,
          path: "title",
          fuzzy: { maxEdits: 2 },
        },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        cover_image_url: 1,
        score: { $meta: "searchScore" },
      },
    },
    { $sort: { score: -1 } },
    { $limit: 4 },
  ]);

  const essays = await essay.aggregate([
    {
      $search: {
        index: "essaysSearchIndex",
        text: {
          query,
          path: "title",
          fuzzy: { maxEdits: 2 },
        },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        cover_image_url: 1,
        score: { $meta: "searchScore" },
      },
    },
    { $sort: { score: -1 } },
    { $limit: 4 },
  ]);

  res.status(200).json({ books, essays });
});

const filterSearchBooks = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Search for Books with filters'*/
  const { page, limit, popularity, name, date, subject, searchInput } =
    req.query;

  // Sorting
  let sort = {};
  if (name) sort.title = name == "desc" ? -1 : 1;
  //   if (author) sort.author = author == "desc" ? -1 : 1;
  if (popularity) sort.popularity = popularity == "desc" ? -1 : 1;
  if (date) sort.publication_year = date == "desc" ? -1 : 1;

  // Pagination
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  let Books = [];
  let totalBooks = 0;
  const query = subject && subject.trim() !== "" ? { subject } : {};

  if (searchInput) {
    const pipeline = [];

    if (subject && subject.trim() !== "") {
      pipeline.push({ $match: { subject } });
    }
    if (sort && Object.keys(sort).length > 0) {
      pipeline.push({ $sort: sort });
    }

    pipeline.push({
      $search: {
        index: "titleSearchIndex",
        text: {
          query: searchInput, // Replace with your input
          path: "title",
          fuzzy: {
            maxEdits: 2, // Up to 2 character edits
            prefixLength: 1, // (optional) require first character to match
            maxExpansions: 50, // (optional) limit fuzzy candidates
          },
        },
      },
    });

    // Count total results
    const countResults = await book.aggregate([
      ...pipeline,
      { $count: "total" },
    ]);

    totalBooks = countResults[0]?.total || 0;

    console.log(pipeline);

    // Get paginated results
    Books = await book.aggregate([
      ...pipeline,
      {
        $project: {
          _id: 1,
          title: 1,
          cover_image_url: 1,
          score: { $meta: "searchScore" },
        },
      },
      { $skip: skip },
      { $limit: pageSize },
    ]);
  } else {
    totalBooks = await book.countDocuments(query);

    Books = await book
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .select("_id title title_ge cover_image_url");
  }

  const pages = Math.ceil(totalBooks / pageSize);

  res.status(200).json({ pages, Books });
});

const filterSearchEssays = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Search for Essays with filters'*/
  const { page, limit, popularity, name, date, subject, searchInput } =
    req.query;

  // Sorting
  let sort = {};
  if (name) sort.title = name == "desc" ? -1 : 1;
  //   if (author) sort.author = author == "desc" ? -1 : 1;
  if (popularity) sort.popularity = popularity == "desc" ? -1 : 1;
  if (date) sort.publication_year = date == "desc" ? -1 : 1;

  // Pagination
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  let Essays = [];
  let totalEssays = 0;
  const query = subject && subject.trim() !== "" ? { subject } : {};

  if (searchInput) {
    const pipeline = [];

    if (subject && subject.trim() !== "") {
      pipeline.push({ $match: { subject } });
    }
    if (sort && Object.keys(sort).length > 0) {
      pipeline.push({ $sort: sort });
    }

    pipeline.push({
      $search: {
        index: "essaysSearchIndex",
        text: {
          query: searchInput, // Replace with your input
          path: "title",
          fuzzy: {
            maxEdits: 2, // Up to 2 character edits
            prefixLength: 1, // (optional) require first character to match
            maxExpansions: 50, // (optional) limit fuzzy candidates
          },
        },
      },
    });

    // Count total results
    const countResults = await essay.aggregate([
      ...pipeline,
      { $count: "total" },
    ]);

    totalEssays = countResults[0]?.total || 0;

    console.log(pipeline);

    // Get paginated results
    Essays = await essay.aggregate([
      ...pipeline,
      {
        $project: {
          _id: 1,
          title: 1,
          cover_image_url: 1,
          score: { $meta: "searchScore" },
        },
      },
      { $skip: skip },
      { $limit: pageSize },
    ]);
  } else {
    totalEssays = await essay.countDocuments(query);

    Essays = await essay
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .select("_id title title_ge cover_image_url");
  }

  const pages = Math.ceil(totalEssays / pageSize);

  res.status(200).json({ pages, Essays });
});

module.exports = {
  searchController,
  filterSearchBooks,
  filterSearchEssays,
};

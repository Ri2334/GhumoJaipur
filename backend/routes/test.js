import { getTestData, postTestData } from "../controllers/testController.js";

import express from "express";

const router = express.Router();

// GET route - retrieve test data
router.get("/", getTestData);

// POST route - create test data
router.post("/", postTestData);

export default router;

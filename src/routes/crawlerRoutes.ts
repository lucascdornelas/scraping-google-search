import express from "express";
import CrawlerController from "../controllers/CrawlerController";

const router = express.Router();

router.get("/crawl-google", CrawlerController.crawlGooglePage);

export default router;
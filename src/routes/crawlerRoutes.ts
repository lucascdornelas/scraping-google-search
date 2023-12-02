import express from "express";
import CrawlerController from "../controllers/CrawlerController";
import { rateLimitMiddleware } from "../middlewares/RateLimitMiddleware";

const router = express.Router();

router.get("/crawl-google", rateLimitMiddleware, CrawlerController.crawlGooglePage);

export default router;
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import axios from "axios";

import { load } from "cheerio";

function parseGoogleResults(html: string) {
  const $ = load(html);

  const images: {imageUrl: string, sourceUrl: string}[] = [];

  $("div.idg8be > a").map((_, el) => {
    const href = $(el).attr("href");

    if (href) {
      const imageUrl = decodeURIComponent(href.split("imgurl=")[1]?.split("&imgrefurl=")[0] || "");
      const sourceUrl = decodeURIComponent(href.split("imgrefurl=")[1]?.split("&imgrefurl=")[1] || "");
      
      images.push({imageUrl, sourceUrl});
    }
  }).get();

  const sanitizedImages = images.filter(image => image.imageUrl !== "");


  const results = $("div#main > div")
    .map((_, el) => {
      const breadCrumb = $(el).find("div.UPmit").text();
      const link = $(el).find("a").attr("href");
      const title = $(el).find("h3").text();
      const description = $(el).find("div.kCrYT").text();

      const sanitizedLink = link?.split("&url=")[1]?.split("&ved=")[0] || "";

      return {
        breadCrumb,
        link: decodeURIComponent(sanitizedLink),
        title,
        description,
      };
    })
    .get();

  const sanitizedResults = results.filter(result => result.link !== "");

  return {results: sanitizedResults, images: sanitizedImages};
}

const headers = {
  "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
          "Accept-Language": "pt-BR,pt;q=0.5",
          "Accept-Charset": "utf-8",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1",
          Connection: "keep-alive",
}

class CrawlerController {
  async crawlGooglePage(req: Request, res: Response) {
    const searchQuery = req.query.q;

    try {
      const response = await axios.get("https://www.google.com/search", {
        params: {
          q: searchQuery,
        },
        headers,
      });

      const html = response.data;

      if (!fs.existsSync(path.join(__dirname, "..", "..", "searches"))) {
        fs.mkdirSync(path.join(__dirname, "..", "..", "searches"));
      }

      if (!fs.existsSync(path.join(__dirname, "..", "..", `searches/${searchQuery}`))) {
        fs.mkdirSync(path.join(__dirname, "..", "..", `searches/${searchQuery}`));
      }

      const {results, images} = parseGoogleResults(html);

      fs.writeFileSync(path.join(
        __dirname,
        "..",
        "..",
        "searches",
        `${searchQuery}`,
        `${searchQuery}.html`
      ), html);
      fs.writeFileSync(
        path.join(__dirname, "..", "..", "searches", `${searchQuery}`, `${searchQuery}.json`),
        JSON.stringify({results, images})
      );


      res.send({results, images});
    } catch (error) {
      console.error("Erro ao realizar a requisição:", error);
      res.status(500).json({ error: "Erro ao realizar a requisição" });
    }
  }
}

export default new CrawlerController();

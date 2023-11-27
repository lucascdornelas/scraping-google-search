import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import axios from "axios";

class CrawlerController {
  async crawlGooglePage(req: Request, res: Response) {
    const searchQuery = req.query.q;

    try {
      const response = await axios.get("https://www.google.com/search", {
        params: {
          q: searchQuery,
        },
        headers: {
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
        },
      });

      const html = response.data;

      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "searches",
        `${searchQuery}.html`
      );

      if (!fs.existsSync(path.join(__dirname, "..", "..", "searches"))) {
        fs.mkdirSync(path.join(__dirname, "..", "..", "searches"));
      }

      fs.writeFileSync(filePath, html);

      res.send(response.data);
    } catch (error) {
      console.error("Erro ao realizar a requisição:", error);
      res.status(500).json({ error: "Erro ao realizar a requisição" });
    }
  }
}

export default new CrawlerController();

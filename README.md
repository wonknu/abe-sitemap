# abe-sitemap

> plugin to generate sitemap.xml

```shell
abe add https://github.com/AdFabConnect/abe-sitemap.git
```

# config

```json
  "sitemap": {
  	"domain": "http://localhost:8000/",
  	"sitemapName": "index_sitemap.xml",
  	"prorities": {
  		"article": "0.5"
  	},
  	"folders": {
  		"regex": "^\/([a-zA-z-]*?\/",
  		"sitemapName": "directory-sitemap-$1.xml"
  	}
  }
```
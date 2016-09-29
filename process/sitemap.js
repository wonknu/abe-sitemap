var path = require('path');
var fs = require('fs');

var pConfig = {}
Array.prototype.forEach.call(process.argv, function(item) {
  if (item.indexOf('=') > -1) {
    var ar = item.split('=')
    pConfig[ar[0]] = ar[1]
  }
})

if(typeof pConfig.ABEJS_PATH === 'undefined' || pConfig.ABEJS_PATH === null) {
  pConfig.ABEJS_PATH = ''
}

if(typeof pConfig.ABE_WEBSITE !== 'undefined' && pConfig.ABE_WEBSITE !== null) {
	var cli = path.join(pConfig.ABEJS_PATH, 'cli')

  var abe = require(cli)
  if(pConfig.ABE_WEBSITE) abe.config.set({root: pConfig.ABE_WEBSITE.replace(/\/$/, '') + '/'})

	var Manager = abe.Manager

	Manager.instance.init()
		.then(function () {
			var shouldSaveXml = false;
			var list = Manager.instance.getList();
			var sitemapFileName = "sitemap.xml";
			var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
			xml += "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";

			var domain = ""
			if(typeof abe.config.sitemap !== 'undefined' && abe.config.sitemap !== null) {
				if(typeof abe.config.sitemap.domain !== 'undefined' && abe.config.sitemap.domain !== null) {
					domain = abe.config.sitemap.domain.replace(/\/$/, '') + '/'
				}
			}

			Array.prototype.forEach.call(list, (file) => {
				if (file.publish) {
					shouldSaveXml = true;
					var d = new Date(file.publish.date);
					var month = d.getUTCMonth() + 1; //months from 1-12
					var day = d.getUTCDate();
					var year = d.getUTCFullYear();

					newdate = year + "-" + ((month < 10) ? "0" + month : month) + "-" + ((day < 10) ? "0" + day : day);

					var priority = "0.5"
					if(typeof abe.config.sitemap !== 'undefined' && abe.config.sitemap !== null
						&& typeof abe.config.sitemap.prorities !== 'undefined' && abe.config.sitemap.prorities !== null
						&& typeof abe.config.sitemap.prorities[file.abe_meta.template] !== 'undefined' && abe.config.sitemap.prorities[file.abe_meta.template] !== null) {
						priority = abe.config.sitemap.prorities[file.abe_meta.template]
					}

				  xml += "  <url>\n";
				  xml += "    <loc>" + domain + file.publish.html.replace(/^\//, '') + "</loc>\n";
				  xml += "    <lastmod>" + newdate + "</lastmod>\n";
				  xml += "    <priority>" + priority + "</priority>\n";
				  xml += "  </url>\n";
				}
			})
			xml += "</urlset>";

			if (shouldSaveXml) {
				if(typeof abe.config.sitemap !== 'undefined' && abe.config.sitemap !== null
							&& typeof abe.config.sitemap.sitemapFileName !== 'undefined' && abe.config.sitemap.sitemapFileName !== null) {
					sitemapFileName = abe.config.sitemap.sitemapFileName
				}
				var saveToPath = path.join(abe.config.root, abe.config.publish.url, sitemapFileName)

				fs.writeFileSync(saveToPath, xml, {encoding: 'utf8'})
			}
		})
}
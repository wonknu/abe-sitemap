var path = require('path');
var fs = require('fs');

var pConfig = {}
Array.prototype.forEach.call(process.argv, function(item) {
  if (item.indexOf('=') > -1) {
    var ar = item.split('=')
    pConfig[ar[0]] = ar[1]
  }
})


function createXml(list, domain, priorities) {
	var shouldSaveXml = false;
	var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
	xml += "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";

	Array.prototype.forEach.call(list, function(file) {
		if (file.publish) {
			shouldSaveXml = true;
			var d = new Date(file.publish.date);
			var month = d.getUTCMonth() + 1; //months from 1-12
			var day = d.getUTCDate();
			var year = d.getUTCFullYear();

			var newdate = year + "-" + ((month < 10) ? "0" + month : month) + "-" + ((day < 10) ? "0" + day : day);

			var priority = "0.5";
			if(typeof priorities[file.abe_meta.template] !== 'undefined' && priorities[file.abe_meta.template] !== null) {
				priority = priorities[file.abe_meta.template];
			}

		  xml += "  <url>\n";
		  xml += "    <loc>" + domain + file.publish.html.replace(/^\//, '') + "</loc>\n";
		  xml += "    <lastmod>" + newdate + "</lastmod>\n";
		  xml += "    <priority>" + priority + "</priority>\n";
		  xml += "  </url>\n";
		}
	})
	xml += "</urlset>";

	if (!shouldSaveXml) {
		return false
	}
	return xml
}

if(typeof pConfig.ABECMS_PATH === 'undefined' || pConfig.ABECMS_PATH === null) {
  pConfig.ABECMS_PATH = ''
}

if(typeof pConfig.ABE_WEBSITE !== 'undefined' && pConfig.ABE_WEBSITE !== null) {
	var cli = cli = path.join(__dirname, '../../', 'abe-cli', 'dist', 'cli')

  var abe = require(cli)
  if(pConfig.ABE_WEBSITE) abe.config.set({root: pConfig.ABE_WEBSITE.replace(/\/$/, '') + '/'})

	var Manager = abe.Manager

	Manager.instance.init()
		.then(function () {
			var list = Manager.instance.getList();
			var splitFolder = false;

			var domain = "";
			var priorities = null;
			var sitemapName = "sitemap.xml";
			if(typeof abe.config.sitemap !== 'undefined' && abe.config.sitemap !== null) {
				if(typeof abe.config.sitemap.domain !== 'undefined' && abe.config.sitemap.domain !== null) {
					domain = abe.config.sitemap.domain.replace(/\/$/, '') + '/'
				}
				if(typeof abe.config.sitemap.priorities !== 'undefined' && abe.config.sitemap.priorities !== null) {
					priorities = abe.config.sitemap.priorities
				}
				if(typeof abe.config.sitemap.sitemapName !== 'undefined' && abe.config.sitemap.sitemapName !== null) {
					sitemapName = abe.config.sitemap.sitemapName
				}
				if(typeof abe.config.sitemap.folders !== 'undefined' && abe.config.sitemap.folders !== null) {
					splitFolder = true
				}
			}

			if (splitFolder) {
				var folders = []
				var regex = new RegExp(abe.config.sitemap.folders.regex)
				Array.prototype.forEach.call(list, function(file) {
					if (file.publish) {
						var match = regex.exec(file.publish.html)
						if(typeof match !== 'undefined' && match !== null
							&& typeof match[1] !== 'undefined' && match[1] !== null) {
							if(typeof folders[match[1]] === 'undefined' || folders[match[1]] === null) {
								folders[match[1]] = []
							}
							folders[match[1]].push(file)
						}
					}
				})

				var sitemapXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
				sitemapXml += "<sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";

				Array.prototype.forEach.call(Object.keys(folders), (key) => {
					var xml = createXml(folders[key], domain, priorities)
					var name = key.replace(new RegExp('(' + key + ')'), abe.config.sitemap.folders.sitemapName)
					if (xml !== false) {
						var saveToPath = path.join(abe.config.root, abe.config.publish.url, name)
						fs.writeFileSync(saveToPath, xml, {encoding: 'utf8'})
					}
					sitemapXml += "  <sitemap><loc>" + domain + name + "</loc></sitemap>\n";
				})
				sitemapXml += "</sitemapindex>";
				saveToPath = path.join(abe.config.root, abe.config.publish.url, sitemapName)
				fs.writeFileSync(saveToPath, sitemapXml, {encoding: 'utf8'})
			}else {
				var xml = createXml(list, domain, priorities)

				if (xml !== false) {
					var saveToPath = path.join(abe.config.root, abe.config.publish.url, sitemapName)
					fs.writeFileSync(saveToPath, xml, {encoding: 'utf8'})
				}
			}

			process.send('finished');
			process.exit(0)
		})
}
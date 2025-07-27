import puppeteer from 'puppeteer';

export async function scrapeAmazonPrice(url: string): Promise<void> {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.setUserAgent(
		'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
	);

	await page.setRequestInterception(true);
	page.on('request', (req) => {
		const resourceType = req.resourceType();
		if (['image', 'stylesheet', 'font'].includes(resourceType)) {
			req.abort();
		} else {
			req.continue();
		}
	});

	try {
		await page.goto(url, { waitUntil: 'domcontentloaded' });

		const price: string | null = await page.evaluate(() => {
			const selectors = [
				'#priceblock_ourprice',
				'#priceblock_dealprice',
				'#priceblock_saleprice',
				'[data-asin-price]',
				'[data-a-color="price"] .a-offscreen',
				'.a-price .a-offscreen',
			];

			for (const selector of selectors) {
				const el = document.querySelector(selector);
				if (el && el.textContent) {
					return el.textContent.trim();
				}
			}

			return null;
		});

		if (price) {
			console.log(`Price: ${price}`);
		} else {
			console.log('Price not found or blocked.');
		}
	} catch (error) {
		console.error('Error scraping page:', error);
	} finally {
		await browser.close();
	}
}

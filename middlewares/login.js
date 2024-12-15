require('dotenv').config();
const puppeteer = require('puppeteer');
const getOrders = require('./getOrders');
const trackerOrders = require('./trackerOrders');

const run = async () => {
    const browser = await puppeteer.launch({
        headless: false, // true
    });
    const page = await browser.newPage({
        waitUntil: 'networkidle2',
    });

    await page.setCookie({
        name: 'jwt',
        value: process.env.JWT,
        domain: '.hepsiburada.com',
    });
    await page.goto(process.env.URL, {
        waitUntil: 'networkidle2',
    });
    await page.waitForSelector('.filter-button', {
        waitUntil: 'networkidle2',
        visible: true,
        timeout: 1000,
    });

    const buttons = await page.$$('.filter-button');

    await buttons[1].click();

    const ids = await getOrders(page);

    await page.close();

    const cargoPage = await browser.newPage({
        waitUntil: 'networkidle2',
    });

    await cargoPage.goto(process.env.CARGO, {
        waitUntil: 'networkidle2',
    });

    const data = await trackerOrders(cargoPage, ids);

    console.log(data);
}

module.exports = run;

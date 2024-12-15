const trackOrders = async (page, ids) => {
    const data = [];
    await page.waitForSelector('.hj-home-tracking-input', {
        waitUntil: 'networkidle2',
        visible: true,
        timeout: 1000,
    });

    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];

        if (i > 0) {
            //:.
            // .delivery-search-input || .delivery-search-button
            return;
        }

        await (await page.$('input.hj-home-tracking-input')).click();
        await page.type('input.hj-home-tracking-input', id, {delay: 10});
        await (await page.$('#hepsijet-gonderi-sorgula-link')).click();
        await page.waitForSelector('div.hj-gonderi-status-alt-heading', {
            waitUntil: 'networkidle2',
        });
        await page.waitForSelector('small.hj-gonderi-status-alt-text', {
            waitUntil: 'networkidle2',
        });

        const heading = await page.evaluate(el => el.textContent, await page.$('div.hj-gonderi-status-alt-heading'));
        const time = await page.evaluate(el => el.textContent, await page.$('small.hj-gonderi-status-alt-text'));
        const sp = heading.split('-').map(el => el.trim());

        const obj = {
            status: sp[0],
            location: sp[1].replace(time, ''),
            time,
        }

        data.push(obj);
    }

    return data;
}

module.exports = trackOrders;

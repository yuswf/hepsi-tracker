const getOrders = async (page) => {
    await page.waitForSelector('.orders-page__order-list__item', {
        waitUntil: 'networkidle2',
        visible: true,
        timeout: 1000,
    });

    const trackerIds = [];
    const orders = await page.$$('.orders-page__order-list__item');

    if (!orders || orders.length < 1) return trackerIds;

    // not tested for multi-orders
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];

        order.click();

        await page.waitForSelector('.action-button--cargo-tracking', {
            waitUntil: 'networkidle2',
            visible: true,
            timeout: 1000,
        });
        await (await page.$('a.action-button--cargo-tracking')).click();
        await page.waitForSelector('.tracking-number__code', {
            waitUntil: 'networkidle2',
            visible: true,
            timeout: 1000,
        });

        const trackerId = await page.evaluate(el => el.textContent.slice(12, el.textContent.length).split(' ').join(''), await page.$('button.tracking-number__code'));

        trackerIds.push(trackerId);
    }

    return trackerIds;
}

module.exports = getOrders;

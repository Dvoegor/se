var express = require('express');
var router = express.Router();
const pool = require('../pool/pool');
const session = require('express-session');

/* GET home page. */
router.get('/', async (req, res) => {
    const promisePool = pool.promise();
    const id = session.products
    // console.log(id.length === 0)
    if (id.length === 0) {
        res.render('cart', { alert: 'В вашей корзине нет товаров' })
    } else {
        const products = [err, rows] = await promisePool.query(`SELECT * FROM products WHERE products.id in (${id})`);
        // const ids = [err, rows] = await promisePool.query(`SELECT id FROM products WHERE products.id in (${id})`);
        let productsCounts = products[0];
        // session.prodCounts.push({id: req.body.id, count: count + 1})
        // console.log(session.prodCounts[0][0].count == undefined)
        session.prodCounts = productsCounts.map(item => [{
            id: item.id,
            // image: item.image,
            name: item.name,
            // description: item.description,
            // composition: item.composition,
            // kcal: item.kcal,
            // proteins: item.proteins,
            // fats: item.fats,
            // carbohydrates: item.carbohydrates,
            price: item.price,
            newPrice: session.item === undefined ? item.price : session.prodCounts[item.id - 1][0].newPrice,
            // category_id: item.category_id,
            // count: 1
            count: session.item === undefined ? 1 : session.prodCounts[item.id - 1][0].count
        }]);
        session.allPrice = 0;
        // console.log(session.prodCounts.length)
        for (let i = 0; i < session.prodCounts.length; i++) {
            session.allPrice += session.prodCounts[i][0].newPrice
        }
        res.render('cart', { products: session.prodCounts, allPrice: session.allPrice })

    }
})

router.post('/add/:id', (req, res) => {
    const id = req.body.id
    session.prodCounts[req.body.id - 1][0].count = session.prodCounts[req.body.id - 1][0].count + 1;
    session.prodCounts[req.body.id - 1][0].newPrice = session.prodCounts[req.body.id - 1][0].price * session.prodCounts[req.body.id - 1][0].count;
    session.item = true
    // console.log(session.prodCounts[req.body.id - 1][0].newPrice)
    res.redirect('/cart')

})

router.post('/minus/:id', (req, res) => {
    const id = req.body.id
    if (session.prodCounts[req.body.id - 1][0].count !== 1) {
        session.prodCounts[req.body.id - 1][0].count = session.prodCounts[req.body.id - 1][0].count - 1;
        session.prodCounts[req.body.id - 1][0].newPrice = session.prodCounts[req.body.id - 1][0].price * session.prodCounts[req.body.id - 1][0].count;
    } else {
        session.prodCounts[req.body.id - 1][0].count = 1;
        session.prodCounts[req.body.id - 1][0].newPrice = session.prodCounts[req.body.id - 1][0].price * session.prodCounts[req.body.id - 1][0].count;
    }
    session.item = true
    // console.log(session.prodCounts[req.body.id - 1][0].newPrice)
    res.redirect('/cart')

})

router.post('/delete/:id', (req, res) => {
    session.products = session.products.filter(function(value, index, arr){ return value !== req.body.id;});
    res.redirect('/cart')

})

router.post('/order', (req, res) => {
    console.log(session.prodCounts)
    console.log(session.allPrice)
    res.redirect('/cart')
})

module.exports = router;

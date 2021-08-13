// "priceblock_ourprice" || "priceblock_saleprice"

// "https://www.amazon.com/OFIKA-Ergonomic-Adjustable-Computer-Executive/dp/B08P77XH3H/"
require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const nightmare = require('nightmare')()

const args = process.argv.slice(2)
const url = args[0]
const minPrice = args[1]

checkPrice()

async function checkPrice () {
    try {
        const priceString = await nightmare
        .goto(url)
        .wait('#priceblock_saleprice')
        .evaluate(() => document.getElementById('priceblock_saleprice').innerText)
    
        const priceNumber = parseFloat(priceString.replace('$', ''))
        if(priceNumber < minPrice) {
            await sendEmail('price is low', 
            `The price on ${url} has dropped below ${minPrice}`)
        }

    } catch(e) {
        await sendEmail('Amazon Price Checker Error', e.message)
        throw e
    }
  
}

function sendEmail(subject, body) {
    const email = {
        to: 'nifek88163@asmm5.com', 
        from: 'iaconom821@gmail.com',
        subject: subject,
        text: body,
        html: body
    }

    return sgMail.send(email)
}
let expect = require('chai').expect;
let mocha = require('mocha');
let crawler = require('./crawler');
let request = require('request');
let cheerio = require('cheerio');

describe('Crawl website for links, tags, and sequences', () => {
  let webpage = 'https://pitchbook.com/about-pitchbook';

  let testLinks = [
    'https://pitchbook.com/about-pitchbook',
    'https://pitchbook.com/img/social-media/facebook/PitchBook-Facebook-About.jpg?uq=rcvnUrNU',
    'https://pitchbook.com/img/social-media/twitter/PitchBook-Twitter-CTA-About.jpg',
    'http://schema.org',
    'https://www.pitchbook.com',
    'https://www.facebook.com/PitchBookData',
    'https://twitter.com/PitchBook',
    'https://www.linkedin.com/company/pitchbook-data-inc-',
    'https://plus.google.com/+pitchbook',
    'https://www.youtube.com/user/PitchBook',
    'https://www.instagram.com/pitchbookdata/',
    'https://my.pitchbook.com',
    'https://my.pitchbook.com',
    'https://pitchbook-2.wistia.com/embed/iframe/nqerquyl3o',
    'https://www.linkedin.com/company/pitchbook-data-inc-',
    'https://twitter.com/PitchBook',
    'https://www.facebook.com/PitchBookData',
    'https://plus.google.com/+pitchbook',
    'https://www.instagram.com/pitchbookdata/',
    'https://www.google.com/recaptcha/api.js?onload=reCaptchaOnloadCallback&render=explicit&uq=rcvnUrNU',
    'https://snap.licdn.com/li.lms-analytics/insight.min.js',
    'https://connect.facebook.net/en_US/fbevents.js',
    'https://www.facebook.com/tr?id=1752955298289295&ev=PageView&noscript=1'
  ];

  it('should provide a list of all links​ embedded within the HTML page', done => {
    request(webpage, (error, response, body) => {
      if (error) console.log('Error: ' + error);
      if (response.statusCode === 200) {
        let actualLinks = crawler.collectLinks(body);
        expect(actualLinks).to.deep.equal(testLinks);
        done();
      }
    });
  });

  let testTags =
    `<html>
    <head>
     <title>About PitchBook | Private Financial Data, Technology, and Service</title>
    <meta name="description" content="Learn more about PitchBook, our company history, our
    leadership team, career opportunities and how to partner with us.">
    <meta property="og:title" content="Learn more about PitchBook, our company history,
    our leadership team, career opportunities and how to partner with us."/>
    <meta property="og:type" content="website"/>
    <script type="application/ld+json">
    </script>
    <link rel="shortcut icon" href="/favicon.ico?uq=Ba6s4HMR"/>
    <link href="/css/reset.css?uq=Ba6s4HMR" rel="stylesheet" type="text/css"/>
    </head>
    <body>
    <div data-mega-menu class="mega-menu__container">
     <div class="login-part">
     <div class="container clearfix main-horizontal-offset-L">
     <div data-close-cookie-policy class="cookie-policy">
     <span class="close-cookie-policy"></span>
     <p data-cookie-policy-text></p>
     </div>
    </body>
    </html>`;

  let expectedTags =
    `<html><head><title></title><meta><meta/><meta/><script></script><link/><link/></head><body><div><div><div><div><span></span><p></p></div></body></html>`;

  it('should extract the set of raw HTML tags​ contained in the document', done => {
    request(webpage, (error, response, body) => {
      if (error) console.log('Error: ' + error);
      if (response.statusCode === 200) {
        let actualTags = crawler.collectTags(testTags);
        expect(actualTags).to.deep.equal(expectedTags);
        done();
      }
    });
  });

  let testSequences =
    `<html>
    <body>
    <table>
    <tr class=tb1><td>John Gabbert is the CEO of the company</td></tr>
    <tr class=tb1><td>Rod Diefendorf is the Chief Operating Officer at Pitchbook</td></tr>
    <tr><td>Fabrice Forget serves as the Chief Product Officer</td></tr>
    <tr><td>The VP of Market Development and Analysis is Adley Bowden</td></tr>
    </table>
    </body>
    </html>`;

  let expectedSequences = [
    'John Gabbert',
    'Rod Diefendorf',
    'Chief Operating Officer',
    'Fabrice Forget',
    'Chief Product Officer',
    'The VP',
    'Market Development',
    'Adley Bowden'
  ];

  it('should output all sequences​ of two or more words with first letter capitalized', done => {
    request(webpage, (error, response, body) => {
      if (error) console.log('Error: ' + error);
      if (response.statusCode === 200) {
        let actualSequences = crawler.collectSequences(testSequences);
        expect(actualSequences).to.deep.equal(expectedSequences);
        done();
      }
    });
  });

});

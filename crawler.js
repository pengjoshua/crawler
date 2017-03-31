let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');
let prompt = require('prompt');

// let website = 'http://pitchbook.com/about-pitchbook';
// let output = 'output.txt';

let crawl = (website, output) => {
  request(website, (error, response, body) => {
    console.log('Visiting page:', website);
    if (error) console.log('Error:', error);

    // Check status code (200 is HTTP OK)
    console.log('Status code:', response.statusCode);
    if (response.statusCode === 200) {

      // Parse the document body
      let $ = cheerio.load(body);

      // Collect links
      let links = collectLinks(body);

      // Collect tags
      let tags = collectTags(body);

      // Collect sequences
      let sequences = collectSequences(body);

      // Write to output file
      console.log('Writing to output file:', output);
      let stream = fs.createWriteStream(output);
      stream.once('open', fd => {
        stream.write('[links]\n');
        links.forEach(link => {
          stream.write(link + '\n');
        });

        stream.write('[HTML]\n');
        stream.write(tags + '\n');

        stream.write('[sequences]\n');
        sequences.forEach(sequence => {
          stream.write(sequence + '\n');
        });

        stream.end();
      });
    }
  });
};

let collectLinks = (body) => {
  let links = body.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
  // console.log(links);

  return links;
};

let collectTags = (body) => {

  // Collect all tags
  let tags = body.match(/<\/?[\w\s="/.':;#-\/\?]+>/gi);
  // console.log(tags);

  // Strip whitespace, content, and parameters from tags
  let strippedTags = tags.map(tag => {
    let findSpace = tag.indexOf(' ');
    let findSelfClose = tag.lastIndexOf('/>');
    let findClose = tag.lastIndexOf('>');
    if (findSpace === -1) return tag;
    else if (findSelfClose !== -1) return tag.substring(0, findSpace) + tag.substr(findSelfClose, 2);
    else return tag.substring(0, findSpace) + tag.substr(findClose, 2);
  });
  // console.log(strippedTags);

  return strippedTags.join('');
};

let collectSequences = (body) => {

  // Strip tags
  let text = body.replace(/(<([^>]+)>)/ig,"");
  // console.log(text);

  // Find consecutive words with first letter capitalized
  let words = text.match(/([A-Z][a-zA-Z0-9-]*)([\s][A-Z][a-zA-Z0-9-]*)+/g);
  // console.log(words);

  return words;
};

module.exports = {
  crawl: crawl,
  collectLinks: collectLinks,
  collectTags: collectTags,
  collectSequences: collectSequences
};

prompt.start();

console.log('Enter website URL:');
let app = () => {
  prompt.get(['input'], (err, website) => {
    if (err) console.log('Invalid website');
    console.log('Website URL:', website.input);
    console.log('Enter output file name:')

    prompt.get(['input'], (err, output) => {
      if (err) console.log('Invalid file name');
      console.log('Output file name:', output.input);
      crawl(website.input, output.input);
    });
  });
};

app();


import fs from 'fs'
import fm from 'front-matter'

var uri = process.argv[2];
const CONTENT_MAX_CHARS = 280;

fs.readFile(uri, 'utf8', function(err, data){
  if (err) throw err

  var content = fm(data);
  var output = [content.attributes.title];
  output = output.concat(convertTextToTweets(content.body));
  
  output.forEach(function(tweet){
    
    // remove markdown images from tweet and just leave the image url
    tweet = tweet.replace(/!\[.*\]\((.*)\)/g, '$1');
    // remove markdown header syntax from tweet
    tweet = tweet.replace(/^#+\s/g, '');

    if(tweet){
      console.log(tweet);
      console.log('\n');
    }
  });
})

function convertTextToTweets(text){
  var currentChar = 0;
  var tweetThread = [];

  while(currentChar < text.length){
    var tweet = getNextTweet(currentChar, text);
    currentChar += tweet.length + 1;
    tweetThread.push(tweet.trim());
  }

  return tweetThread;
}

function getNextTweet(currentChar, text)
{
  var tweet = text.substr(currentChar, CONTENT_MAX_CHARS);
  // if tweet contains # make tweet a substring of tweet up to and not including #
  var newSectionIndex = tweet.indexOf('\n#');
  if(newSectionIndex > -1){
    tweet = tweet.substr(0, newSectionIndex);
  }

  var lastSpace = tweet.lastIndexOf('. ');
  var lastNewLine = tweet.lastIndexOf('\n');
  var lastNewLineHash = tweet.lastIndexOf('\n#');
  // last new line that doesn't start with a #

  if(lastNewLineHash > lastNewLine){
    return tweet.substr(0, lastNewLineHash);
  } else if(lastNewLine > lastSpace){
    return tweet.substr(0, lastNewLine);
  } else {
    return tweet.substr(0, lastSpace);
  }
}
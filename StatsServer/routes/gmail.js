var express = require('express');
var router = express.Router();
var verifyAuthenticated = require('../lib/auth').verifyAuthenticated;
var natural = require('natural');

var googleapis = require('googleapis');

router.get('/list', verifyAuthenticated, function(req, res) {
  console.log('Using refresh token: ' + req.user.googleRefreshToken);
  var refreshToken = req.user.googleRefreshToken;
  var oauthClient = new googleapis.google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000/auth/google/callback'
  );
  oauthClient.setCredentials({
    refresh_token: refreshToken
  });

  const gmail = googleapis.google.gmail({
    version: 'v1',
    auth: oauthClient
  });

  var query = {
    userId: 'me'
  };
  if (req.query.q) {
    query.q = req.query.q;
  }
  var Analyzer = require('natural').SentimentAnalyzer;
  var stemmer = require('natural').PorterStemmer;
  var tokenizer = new natural.WordTokenizer();
  var analyzer = new Analyzer("English", stemmer, "afinn")

  gmail.users.threads.list(query).then(function(gmailRes) {
    var threads = gmailRes.data.threads;

    // calculate Sentiment.
    threads.forEach(function(thread) {
      var snippet = thread.snippet;
      var sentiment = analyzer.getSentiment(tokenizer.tokenize(snippet));
      thread.sentiment = sentiment;
    });

    res.render('gmail/list', {
      threads: threads
    });
  });
});



module.exports = router;

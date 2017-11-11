/* THIS PAGE IS NOT USED -- CAN BE DELETED*/


// used to get pdf
var page = require('webpage').create();

var filename = "test.pdf";
page.paperSize = {
  format: 'Legal',
  orientation: 'landscape',

}

page.onLoadFinished = function() {
  console.log("page load finished");
  page.render(filename);
  phantom.exit();
}

page.open("http://localhost:3000/displayJSON.html", function() {
  // executes javascript
  page.evaluate(function() {
    console.log(document.title);
  });
  //console.log("Page is " + title);
})

page.onConsoleMessage = function(msg) {
  console.log('Page title is ' + msg);
};

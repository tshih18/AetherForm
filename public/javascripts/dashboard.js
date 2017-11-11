// display usernames on left panel
if ($('#get-user').text() != "") {
  var usernames = $('#get-user').text();
  var userArray = usernames.split(',');
  // 2D array of alphabetically sorted users
  var sortedUserArray = sortMultiArrayAtIndex(userArray, 0, 2);

  // create a button for each user
  for (var i = 0; i < sortedUserArray.length; i++) {
    $('<div/>', {
      'class': 'users',
      'id': 'user'+i,
    }).appendTo($('#left-panel'));

    $('<button/>', {
      'class': 'user',
      'html': sortedUserArray[i][0]
    }).appendTo($('#user'+i));

    // need to calculate time last active
    var now = new Date();
    var ms = now.getTime();
    var lastActiveMS = ms - sortedUserArray[i][1];
    var lastActiceS = lastActiveMS / 1000;
    var lastActiveMin = lastActiceS / 60;

    if (lastActiveMin < 60) {
      $('<div/>', {
        'class': 'activity',
        'html': Math.floor(lastActiveMin) + 'm'
      }).appendTo($('#user'+i));
    }
    else {
      var lastActiveHr = lastActiveMin / 60;
      if (lastActiveHr < 24) {
        $('<div/>', {
          'class': 'activity',
          'html': Math.floor(lastActiveHr) + 'h'
        }).appendTo($('#user'+i));
      }
      else {
        var lastActiveDay = lastActiveHr / 24;
        $('<div/>', {
          'class': 'activity',
          'html': Math.floor(lastActiveDay) + 'd'
        }).appendTo($('#user'+i));
      }
    }

    $('<div/>', {
      'class': 'break'
    }).appendTo($('#user'+i));
  }
}

// sorts elemnents of 2D array[[_,_,...,_],[],...,[]] at array[][index]
function sortMultiArrayAtIndex(array, index, section) {
  // make array in 2D first
  var array2D = [];
  for (var i = 0; i < array.length; i+=section) {
    var innerArray = [];
    for (var j = 0; j < section; j++) {
      innerArray.push(array[i+j]);
    }
    array2D.push(innerArray);
  }

  // put elements to be sored in separate array
  var sortData = [];
  var sortDict = [];
  for (var i = 0; i < array2D.length; i++) {
    sortData.push(array2D[i][index]);
    sortDict[array2D[i][index]] = i;
  }

  // sort
  sortData.sort();

  // use dictionary to put back sorted data in 2D array
  var sorted2DArray = [];
  for (var i = 0; i < sortData.length; i++) {
    // element to be pushed in
    var elem = sortData[i];
    // get index of element in array2D that holds all the values in each section
    var indexInArray2D = sortDict[elem];
    sorted2DArray.push(array2D[indexInArray2D]);
  }
  return sorted2DArray;
}

// objects that hold data of elements parsed from server side
var metaObj = {};
var problemObj = {};
var questionObj = {};
var suggestionObj = {};

// get metadata passed from server side
if ($('#get-metadata').text() != "") {
  // the data is passed as a string from server
  var metaObjFromServer = $('#get-metadata').html();
  // parse data as JSON object
  metaObj = JSON.parse(metaObjFromServer);
}

// get problem data from server side
if ($('#get-problem').text != "") {
  // the data is passed as string from server
  var problemObjFromServer = $('#get-problem').html();
  // parse data as JSON object
  // this data is already sorted from oldest-newest
  problemObj = JSON.parse(problemObjFromServer);
  // now data is sorted from newest-oldest
  problemObj.reverse();
}

// get question data from server side
if ($('#get-question').text != "") {
  // the data is passed as string from server
  var questionObjFromServer = $('#get-question').html();
  // parse data as JSON object
  // this data is already sorted from oldest-newest
  questionObj = JSON.parse(questionObjFromServer);
  // now data is sorted from newest-oldest
  questionObj.reverse();
}

// get suggestion data from server side
if ($('#get-suggestion').text != "") {
  // the data is passed as string from server
  var suggestionObjFromServer = $('#get-suggestion').html();
  // parse data as JSON object
  // this data is already sorted from oldest-newest
  suggestionObj = JSON.parse(suggestionObjFromServer);
  // now data is sorted from newest-oldest
  suggestionObj.reverse();
}

// save user to know which data to display
var selectedUser = "";
// save email to send replies
var selectedUserEmail = "";

// handle selecting the users on left panel
$('#left-panel').on('click', '.users', function() {
  $('.users').css("background-color", "#333333");
  $(this).css("background-color", "gray");
  // reset tag filters and remove displayed data
  $('.tags').css("background-color", "rgb(69, 196, 191)");
  // reset the right dashboard where data is displayed
  $('.subtag').remove();

  // get first child - .user
  selectedUser = $(this).children(':first').html();
  var userMetadata = metaObj[selectedUser].user;
  selectedUserEmail = metaObj[selectedUser].email;
  // fill out metadata fields
  $('#email-data').html(metaObj[selectedUser].email);
  $('#key-data').html(metaObj[selectedUser].key);
  $('#posts-data').html(metaObj[selectedUser].posts);
  $('#dateLastActive-data').html(metaObj[selectedUser].dateLastActive);
  $('#timeLastActive-data').html(metaObj[selectedUser].timeLastActive);
});

// save original height of section before clicked
var originalHeight;
// save reference of selected section
var selectedSection;
// fix problem of calling both 'click' functions
var replyEnable = true;
// only allow it to be clicked once
var replyClicked = false;

// handle displaying reply section when clicking a data entry
$('#data').on('click', '[id^="section"]', function() {
  if (replyEnable) {
    replyClicked = true;
    originalHeight = $(this).css("height");
    selectedSection = $(this);

    // hide all subtags elements
    $('.subtag').css("display", "none");
    // only display the selected section along with subtag title
    $(this).parent().parent().css("display" , "initial");
    $(this).siblings().css("display", "none");
    $(this).animate({
      height: '+=290px'
    });

    $('<form/>', {
      'id': 'reply',
      'action': "/dashboard/reply",
      'method': 'post'
    }).appendTo($(this));
    $('<input/>', {
      'id': 'reply-title',
      'placeholder': 'Title',
      'name': 'replyTitle'
    }).appendTo($('#reply'));
    $('<input/>', {
      'id': 'reply-email',
      'name': 'replyEmail',
      'val': selectedUserEmail
    }).appendTo($('#reply'));
    $('<br>').appendTo($('#reply'));
    $('<textarea/>', {
      'id': 'reply-content',
      'placeholder': 'Response',
      'name': 'replyContent'
    }).appendTo($('#reply'));
    $('<br>').appendTo($('#reply'));
    $('<button/>', {
      'type': 'submit',
      'html': 'Reply'
    }).appendTo($('#reply'));
    $('<br>').appendTo($('#reply'));
    $('<img/>', {
      'id': 'arrow',
      'src': '/images/arrow.png'
    }).appendTo($('#reply'));
  }

  // if reply hasnt been clicked, enable reply
  // disable reply after it has been clicked already
  (!replyClicked) ? replyEnable = true: replyEnable = false;

});

// handles when the close arrow is clicked
$('#data').on('click change', '#arrow', function() {

  replyEnable = false;
  replyClicked = false;
  // delete form
  $('#reply').fadeOut(function() {
    $(this).remove();
  });

  // fix height
  selectedSection.animate({
    height: originalHeight
  }, 500, function() {
    // display everything else
    $('.subtag').css("display", "initial");
    selectedSection.parent().css("display", "initial");
    selectedSection.siblings().css("display", "block");
  });

});

// handle clicking tag filters
$('.tags').click(function() {
  // when selected - make gray
  if ($(this).css("background-color") == "rgb(69, 196, 191)") {
    $(this).css("background-color", "gray");

    // show corresponding data
    var tag = $(this).html();
    switch(tag) {
      case "Problems":
        for (var i = 0; i < Object.keys(problemObj).length; i++) {
          var username = problemObj[i].user;
          if (username == selectedUser) {
            // need to check subtag and put in right category
            var subtag = problemObj[i].subtag;
            switch (subtag) {
              case "Software":
                // only append this the first time
                if (!$('#p-software').length) {
                  $('<div/>', {
                    'class': 'subtag problem',
                    'id': 'p-software'
                  }).appendTo($('#data'));
                  $('<div/>', {
                    'class': 'subtag-title',
                    'html': 'Software'
                  }).appendTo($('#p-software'));
                  $('<div/>', {
                    'id': 'p-software-data'
                  }).appendTo($('#p-software'));
                }

                // create title and content elements to inserted
                // put each entry in its own section
                $('<div/>', {
                  'class': 'problem-data',
                  'id': 'sectionP'+i
                }).appendTo($('#p-software-data'));
                $('<div/>', {
                  'class': 'dates',
                  'html': problemObj[i].date
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'titles',
                  'html': problemObj[i].title
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'times',
                  'html': problemObj[i].time
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'contents',
                  'html': problemObj[i].content
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionP'+i));
                $('<br/>', {
                  'class': 'problem-data'
                }).appendTo($('#p-software-data'));
                break;
              case "Mechanical":
                // only append this the first time
                if (!$('#p-mechanical').length) {
                  $('<div/>', {
                    'class': 'subtag problem',
                    'id': 'p-mechanical'
                  }).appendTo($('#data'));
                  $('<div/>', {
                    'class': 'subtag-title',
                    'html': 'Mechanical'
                  }).appendTo($('#p-mechanical'));
                  $('<div/>', {
                    'id': 'p-mechanical-data'
                  }).appendTo($('#p-mechanical'));
                }

                // create title and content elements to inserted
                // put each entry in its own section
                $('<div/>', {
                  'class': 'problem-data',
                  'id': 'sectionP'+i
                }).appendTo($('#p-mechanical-data'));
                $('<div/>', {
                  'class': 'titles',
                  'html': problemObj[i].title
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'dates',
                  'html': problemObj[i].date
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'contents',
                  'html': problemObj[i].content
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'times',
                  'html': problemObj[i].time
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionP'+i));
                $('<br/>', {
                  'class': 'problem-data'
                }).appendTo($('#p-mechanical-data'));
                break;
              case "Electrical":
                // only append this the first time
                if (!$('#p-electrical').length) {
                  $('<div/>', {
                    'class': 'subtag problem',
                    'id': 'p-electrical'
                  }).appendTo($('#data'));
                  $('<div/>', {
                    'class': 'subtag-title',
                    'html': 'Electrical'
                  }).appendTo($('#p-electrical'));
                  $('<div/>', {
                    'id': 'p-electrical-data'
                  }).appendTo($('#p-electrical'));
                }

                // create title and content elements to inserted
                // put each entry in its own section
                $('<div/>', {
                  'class': 'problem-data',
                  'id': 'sectionP'+i
                }).appendTo($('#p-electrical-data'));
                $('<div/>', {
                  'class': 'titles',
                  'html': problemObj[i].title
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'dates',
                  'html': problemObj[i].date
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'contents',
                  'html': problemObj[i].content
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'times',
                  'html': problemObj[i].time
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionP'+i));
                $('<br/>', {
                  'class': 'problem-data'
                }).appendTo($('#p-electrical-data'));
                break;
              case "Connectivity":
                // only append this the first time
                if (!$('#p-connectivity').length) {
                  $('<div/>', {
                    'class': 'subtag problem',
                    'id': 'p-connectivity'
                  }).appendTo($('#data'));
                  $('<div/>', {
                    'class': 'subtag-title',
                    'html': 'Connectivity'
                  }).appendTo($('#p-connectivity'));
                  $('<div/>', {
                    'id': 'p-connectivity-data'
                  }).appendTo($('#p-connectivity'));
                }

                // create title and content elements to inserted
                // put each entry in its own section
                $('<div/>', {
                  'class': 'problem-data',
                  'id': 'sectionP'+i
                }).appendTo($('#p-connectivity-data'));
                $('<div/>', {
                  'class': 'titles',
                  'html': problemObj[i].title
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'dates',
                  'html': problemObj[i].date
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'contents',
                  'html': problemObj[i].content
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'times',
                  'html': problemObj[i].time
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionP'+i));
                $('<br/>', {
                  'class': 'problem-data'
                }).appendTo($('#p-connectivity-data'));
                break;
              case "Others":
                // only append this the first time
                if (!$('#p-others').length) {
                  $('<div/>', {
                    'class': 'subtag problem',
                    'id': 'p-others'
                  }).appendTo($('#data'));
                  $('<div/>', {
                    'class': 'subtag-title',
                    'html': 'Others'
                  }).appendTo($('#p-others'));
                  $('<div/>', {
                    'id': 'p-others-data'
                  }).appendTo($('#p-others'));
                }

                // create title and content elements to inserted
                // put each entry in its own section
                $('<div/>', {
                  'class': 'problem-data',
                  'id': 'sectionP'+i
                }).appendTo($('#p-others-data'));
                $('<div/>', {
                  'class': 'titles',
                  'html': problemObj[i].title
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'dates',
                  'html': problemObj[i].date
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'contents',
                  'html': problemObj[i].content
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'times',
                  'html': problemObj[i].time
                }).appendTo($('#sectionP'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionP'+i));
                $('<br/>', {
                  'class': 'problem-data'
                }).appendTo($('#p-others-data'));
                break;
              default:
                break;
            }// switch subtag
          }// if
        }// for
        break;

      case "Questions":
        for (var i = 0; i < Object.keys(questionObj).length; i++) {
          var username = questionObj[i].user;
          if (username == selectedUser) {
            // need to check subtag and put in right category
            var subtag = questionObj[i].subtag;
            switch (subtag) {
              case "Printer":
                // only append this the first time
                if (!$('#q-printer').length) {
                  $('<div/>', {
                    'class': 'subtag question',
                    'id': 'q-printer'
                  }).appendTo($('#data'));
                  $('<div/>', {
                    'class': 'subtag-title',
                    'html': 'Printer'
                  }).appendTo($('#q-printer'));
                  $('<div/>', {
                    'id': 'q-printer-data'
                  }).appendTo($('#q-printer'));
                }

                // create title and content elements to inserted
                // put each entry in its own section
                $('<div/>', {
                  'class': 'question-data',
                  'id': 'sectionQ'+i
                }).appendTo($('#q-printer-data'));
                $('<div/>', {
                  'class': 'titles',
                  'html': questionObj[i].title
                }).appendTo($('#sectionQ'+i));
                $('<div/>', {
                  'class': 'dates',
                  'html': questionObj[i].date
                }).appendTo($('#sectionQ'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionQ'+i));
                $('<div/>', {
                  'class': 'contents',
                  'html': questionObj[i].content
                }).appendTo($('#sectionQ'+i));
                $('<div/>', {
                  'class': 'times',
                  'html': questionObj[i].time
                }).appendTo($('#sectionQ'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionQ'+i));
                $('<br/>', {
                  'class': 'question-data'
                }).appendTo($('#q-printer-data'));
                break;
              case "Software":
                // only append this the first time
                if (!$('#q-software').length) {
                  $('<div/>', {
                    'class': 'subtag question',
                    'id': 'q-software'
                  }).appendTo($('#data'));
                  $('<div/>', {
                    'class': 'subtag-title',
                    'html': 'Software'
                  }).appendTo($('#q-software'));
                  $('<div/>', {
                    'id': 'q-software-data'
                  }).appendTo($('#q-software'));
                }

                // create title and content elements to inserted
                // put each entry in its own section
                $('<div/>', {
                  'class': 'question-data',
                  'id': 'sectionQ'+i
                }).appendTo($('#q-software-data'));
                $('<div/>', {
                  'class': 'titles',
                  'html': questionObj[i].title
                }).appendTo($('#sectionQ'+i));
                $('<div/>', {
                  'class': 'dates',
                  'html': questionObj[i].date
                }).appendTo($('#sectionQ'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionQ'+i));
                $('<div/>', {
                  'class': 'contents',
                  'html': questionObj[i].content
                }).appendTo($('#sectionQ'+i));
                $('<div/>', {
                  'class': 'times',
                  'html': questionObj[i].time
                }).appendTo($('#sectionQ'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionQ'+i));
                $('<br/>', {
                  'class': 'question-data'
                }).appendTo($('#q-software-data'));
                break;
              case "Others":
                // only append this the first time
                if (!$('#q-others').length) {
                  $('<div/>', {
                    'class': 'subtag question',
                    'id': 'q-others'
                  }).appendTo($('#data'));
                  $('<div/>', {
                    'class': 'subtag-title',
                    'html': 'Others'
                  }).appendTo($('#q-others'));
                  $('<div/>', {
                    'id': 'q-others-data'
                  }).appendTo($('#q-others'));
                }

                // create title and content elements to inserted
                // put each entry in its own section
                $('<div/>', {
                  'class': 'question-data',
                  'id': 'sectionQ'+i
                }).appendTo($('#q-others-data'));
                $('<div/>', {
                  'class': 'titles',
                  'html': questionObj[i].title
                }).appendTo($('#sectionQ'+i));
                $('<div/>', {
                  'class': 'dates',
                  'html': questionObj[i].date
                }).appendTo($('#sectionQ'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionQ'+i));
                $('<div/>', {
                  'class': 'contents',
                  'html': questionObj[i].content
                }).appendTo($('#sectionQ'+i));
                $('<div/>', {
                  'class': 'times',
                  'html': questionObj[i].time
                }).appendTo($('#sectionQ'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionQ'+i));
                $('<br/>', {
                  'class': 'question-data'
                }).appendTo($('#q-others-data'));
                break;
              default:
                break;
            }// switch subtag
          }// if
        }// for
        break;
      case "Suggestions":
        for (var i = 0; i < Object.keys(suggestionObj).length; i++) {
          var username = suggestionObj[i].user;
          if (username == selectedUser) {
            // need to check subtag and put in right category
            var subtag = suggestionObj[i].subtag;
            switch (subtag) {
              case "Configuration":
                // only append this the first time
                if (!$('#s-configuration').length) {
                  $('<div/>', {
                    'class': 'subtag suggestion',
                    'id': 's-configuration'
                  }).appendTo($('#data'));
                  $('<div/>', {
                    'class': 'subtag-title',
                    'html': 'Configuration'
                  }).appendTo($('#s-configuration'));
                  $('<div/>', {
                    'id': 's-configuration-data'
                  }).appendTo($('#s-configuration'));
                }

                // create title and content elements to inserted
                // put each entry in its own section
                $('<div/>', {
                  'class': 'suggestion-data',
                  'id': 'sectionS'+i
                }).appendTo($('#s-configuration-data'));
                $('<div/>', {
                  'class': 'titles',
                  'html': suggestionObj[i].title
                }).appendTo($('#sectionS'+i));
                $('<div/>', {
                  'class': 'dates',
                  'html': suggestionObj[i].date
                }).appendTo($('#sectionS'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionS'+i));
                $('<div/>', {
                  'class': 'contents',
                  'html': suggestionObj[i].content
                }).appendTo($('#sectionS'+i));
                $('<div/>', {
                  'class': 'times',
                  'html': suggestionObj[i].time
                }).appendTo($('#sectionS'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionS'+i));
                $('<br/>', {
                  'class': 'suggestion-data'
                }).appendTo($('#s-configuration-data'));
                break;
              case "Features":
                // only append this the first time
                if (!$('#s-features').length) {
                  $('<div/>', {
                    'class': 'subtag suggestion',
                    'id': 's-features'
                  }).appendTo($('#data'));
                  $('<div/>', {
                    'class': 'subtag-title',
                    'html': 'Features'
                  }).appendTo($('#s-features'));
                  $('<div/>', {
                    'id': 's-features-data'
                  }).appendTo($('#s-features'));
                }

                // create title and content elements to inserted
                // put each entry in its own section
                $('<div/>', {
                  'class': 'suggestion-data',
                  'id': 'sectionS'+i
                }).appendTo($('#s-features-data'));
                $('<div/>', {
                  'class': 'titles',
                  'html': suggestionObj[i].title
                }).appendTo($('#sectionS'+i));
                $('<div/>', {
                  'class': 'dates',
                  'html': suggestionObj[i].date
                }).appendTo($('#sectionS'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionS'+i));
                $('<div/>', {
                  'class': 'contents',
                  'html': suggestionObj[i].content
                }).appendTo($('#sectionS'+i));
                $('<div/>', {
                  'class': 'times',
                  'html': suggestionObj[i].time
                }).appendTo($('#sectionS'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionS'+i));
                $('<br/>', {
                  'class': 'suggestion-data'
                }).appendTo($('#s-features-data'));
                break;
              case "Others":
                // only append this the first time
                if (!$('#s-others').length) {
                  $('<div/>', {
                    'class': 'subtag suggestion',
                    'id': 's-others'
                  }).appendTo($('#data'));
                  $('<div/>', {
                    'class': 'subtag-title',
                    'html': 'Others'
                  }).appendTo($('#s-others'));
                  $('<div/>', {
                    'id': 's-others-data'
                  }).appendTo($('#s-others'));
                }

                // create title and content elements to inserted
                // put each entry in its own section
                $('<div/>', {
                  'class': 'suggestion-data',
                  'id': 'sectionS'+i
                }).appendTo($('#s-others-data'));
                $('<div/>', {
                  'class': 'titles',
                  'html': suggestionObj[i].title
                }).appendTo($('#sectionS'+i));
                $('<div/>', {
                  'class': 'dates',
                  'html': suggestionObj[i].date
                }).appendTo($('#sectionS'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionS'+i));
                $('<div/>', {
                  'class': 'contents',
                  'html': suggestionObj[i].content
                }).appendTo($('#sectionS'+i));
                $('<div/>', {
                  'class': 'times',
                  'html': suggestionObj[i].time
                }).appendTo($('#sectionS'+i));
                $('<div/>', {
                  'class': 'break'
                }).appendTo($('#sectionS'+i));
                $('<br/>', {
                  'class': 'suggestion-data'
                }).appendTo($('#s-others-data'));
                break;
              default:
                break;
            }// switch subtag
          }// if
        }// for
        break;
      default:
        break;
    }// switch tag

  }// if selected
  // when de-selected
  else {
    $(this).css("background-color", "rgb(69, 196, 191)");
    var tag = $(this).html();

    // remove all sections corresponding to the tag
    switch(tag) {
      case "Problems":
        $('.subtag.problem').remove();
        break;
      case "Questions":
        $('.subtag.question').remove();
        break;
      case "Suggestions":
        $('.subtag.suggestion').remove();
        break;
    }
  }
});

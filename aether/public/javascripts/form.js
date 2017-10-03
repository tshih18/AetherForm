/*
var jqScript = document.createElement('script');
jqScript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js';
document.getElementsByTagName('head')[0].appendChild(jqScript);

var quillScript = document.createElement('script');
quillScript.src = 'https://cdn.quilljs.com/1.1.3/quill.js';
document.getElementsByTagName('head')[0].appendChild(quillScript);

var quillMinScript = document.createElement('script');
quillMinScript.src = 'https://cdn.quilljs.com/1.1.3/quill.min.js';
document.getElementsByTagName('head')[0].appendChild(quillMinScript);
*/

/*var globalsjs = document.createElement('script');
globalsjs.src = 'globals.js';
document.getElementsByTagName('head')[0].appendChild(globalsjs);
*/
/*
var toolbarOptions = [
  [{'header': [1, 2, 3, 4, 5, 6, false]}],
  [{'size': ['small', false, 'large', 'huge']}],
  [{'align': []}],
  [{'color': []}, {'background': []}],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'image', 'code-block'],
  [{'list': 'ordered'}, {'list': 'bullet'}],
  [{'script': 'sub'}, {'script': 'super'}]
];

var quill = new Quill('.editor', {
    modules: {
        toolbar: toolbarOptions
    },
    placeholder: 'Add description',
    theme: 'snow'
});
*/

// make all dynamically added buttons work
$('.section').on('click', '[class^="buttons"]', function() {

  // split id on -
  var splitID = $(this).attr("id").split('-');
  var firstID = splitID[0];
  var size = splitID.length
  var indexNum = splitID[size-1];

  // if button is lightblue
  if ($(this).css("background-color") == "rgb(173, 216, 230)") {

    // make only one button selectable
    $('.buttons-'+indexNum).css("background-color", "lightblue");
    $(this).css("background-color", "gray");

    // depending on which button, make only one sub button selectable (gray)
    if (firstID == "suggestions") {
      $('.sub-buttons-'+indexNum).css("display", "none");
      $('.suggestion-buttons-'+indexNum).css("display", "initial");
    }
    else if (firstID == "questions") {
      $('.sub-buttons-'+indexNum).css("display", "none");
      $('.question-buttons-'+indexNum).css("display", "initial");
    }
    else if (firstID == "problems") {
      $('.sub-buttons-'+indexNum).css("display", "none");
      $('.problem-buttons-'+indexNum).css("display", "initial");
    }
  }
  // if button is gray change back to lightblue
  else {
    $(this).css("background-color", "lightblue");
    // remove all sub-buttons pertaining to that section
    $('.sub-buttons-'+indexNum).css("display", "none");
  }
  // de-select all other sub-buttons
  $('.sub-buttons-'+indexNum).css("background-color", "lightblue");
});

// handles dynamically added sub suggestion buttons
$('.section').on('click', '[class^="suggestion-buttons"]', function() {
  var splitID = $(this).attr("id").split('-');
  var size = splitID.length;
  var indexNum = splitID[size-1];

  // if background is lightblue
  if ($(this).css("background-color") == "rgb(173, 216, 230)") {
    // make all other sub buttons lightblue
    $('.suggestion-buttons-'+indexNum).css("background-color", "lightblue");
    // change that button to gray
    $(this).css("background-color", "gray");
  }
  // if background is gray, change back to lightblue
  else {
    $(this).css("background-color", "lightblue");
  }
})

// handles dynamically added sub suggestion buttons
$('.section').on('click', '[class^="question-buttons"]', function() {
  var splitID = $(this).attr("id").split('-');
  var size = splitID.length;
  var indexNum = splitID[size-1];

  // if background is lightblue
  if ($(this).css("background-color") == "rgb(173, 216, 230)") {
    // make all other sub buttons lightblue
    $('.question-buttons-'+indexNum).css("background-color", "lightblue");
    // change that button to gray
    $(this).css("background-color", "gray");
  }
  // if background is gray, change back to lightblue
  else {
    $(this).css("background-color", "lightblue");
  }
})

// handles dynamically added sub problem buttons
$('.section').on('click', '[class^="problem-buttons"]', function() {
  var splitID = $(this).attr("id").split('-');
  var size = splitID.length;
  var indexNum = splitID[size-1];

  // if background is lightblue
  if ($(this).css("background-color") == "rgb(173, 216, 230)") {
    // make all other sub buttons lightblue
    $('.problem-buttons-'+indexNum).css("background-color", "lightblue");
    // change that button to gray
    $(this).css("background-color", "gray");
  }
  // if background is gray, change back to lightblue
  else {
    $(this).css("background-color", "lightblue");
  }
})


$('#submit').click(function() {
  //window.delta = quill.getContents();
  //console.log(window.delta)
  /*var key = $('.title').val();
  var value = quill.container.firstChild.innerHTML;
  console.log(key, value);*/
  console.log("submit clicked");

});


// differentiate each section
var sectionCount = 0;

function addNewSection() {

  var separation = document.getElementById("separation" + sectionCount);
  // make names for each section unique
  sectionCount++;

  // add buttons
  $('<div/>', {
    'class': 'buttons-'+sectionCount,
    'name': 'suggestions-button-'+sectionCount,
    'id': 'suggestions-button-'+sectionCount,
    'html': 'Suggestions'
  }).appendTo(separation);

  $('<div/>', {
    'class': 'buttons-'+sectionCount,
    'name': 'questions-button-'+sectionCount,
    'id': 'questions-button-'+sectionCount,
    'html': 'Questions'
  }).appendTo(separation);

  $('<div/>', {
    'class': 'buttons-'+sectionCount,
    'name': 'problems-button-'+sectionCount,
    'id': 'problems-button-'+sectionCount,
    'html': 'Problems'
  }).appendTo(separation);

  $('<div/>', {
    'class': 'break'
  }).appendTo(separation);

  // add sub-buttons
  // suggestion sub buttons
  $('<div/>', {
    'class': 'suggestion-buttons-'+sectionCount + ' sub-buttons-' +sectionCount,
    'name': 'other-suggestion-button-'+sectionCount,
    'id': 'other-suggestion-button-'+sectionCount,
    'html': 'Others'
  }).appendTo(separation);

  $('<div/>', {
    'class': 'suggestion-buttons-'+sectionCount + ' sub-buttons-' +sectionCount,
    'name': 'feature-suggestion-button-'+sectionCount,
    'id': 'feature-suggestion-button-'+sectionCount,
    'html': 'Features'
  }).appendTo(separation);

  $('<div/>', {
    'class': 'suggestion-buttons-'+sectionCount + ' sub-buttons-' +sectionCount,
    'name': 'configuration-suggestion-button-'+sectionCount,
    'id': 'configuration-suggestion-button-'+sectionCount,
    'html': 'Configuration'
  }).appendTo(separation);

  // question sub buttons
  $('<div/>', {
    'class': 'question-buttons-'+sectionCount + ' sub-buttons-' +sectionCount,
    'name': 'other-question-button-'+sectionCount,
    'id': 'other-question-button-'+sectionCount,
    'html': 'Others'
  }).appendTo(separation);

  $('<div/>', {
    'class': 'question-buttons-'+sectionCount + ' sub-buttons-' +sectionCount,
    'name': 'software-question-button-'+sectionCount,
    'id': 'software-question-button-'+sectionCount,
    'html': 'Software'
  }).appendTo(separation);

  $('<div/>', {
    'class': 'question-buttons-'+sectionCount + ' sub-buttons-' +sectionCount,
    'name': 'printer-question-button-'+sectionCount,
    'id': 'printer-question-button-'+sectionCount,
    'html': 'Printer'
  }).appendTo(separation);

  // problem sub buttons
  $('<div/>', {
    'class': 'problem-buttons-'+sectionCount + ' sub-buttons-' +sectionCount,
    'name': 'other-problems-button-'+sectionCount,
    'id': 'other-problems-button-'+sectionCount,
    'html': 'Others'
  }).appendTo(separation);

  $('<div/>', {
    'class': 'problem-buttons-'+sectionCount + ' sub-buttons-' +sectionCount,
    'name': 'connectivity-problems-button-'+sectionCount,
    'id': 'connectivity-problems-button-'+sectionCount,
    'html': 'Connectivity'
  }).appendTo(separation);

  $('<div/>', {
    'class': 'problem-buttons-'+sectionCount + ' sub-buttons-' +sectionCount,
    'name': 'electrical-problems-button-'+sectionCount,
    'id': 'electrical-problems-button-'+sectionCount,
    'html': 'Electrical'
  }).appendTo(separation);

  $('<div/>', {
    'class': 'problem-buttons-'+sectionCount + ' sub-buttons-' +sectionCount,
    'name': 'mechanical-problems-button-'+sectionCount,
    'id': 'mechanical-problems-button-'+sectionCount,
    'html': 'Mechanical'
  }).appendTo(separation);

  $('<div/>', {
    'class': 'problem-buttons-'+sectionCount + ' sub-buttons-' +sectionCount,
    'name': 'software-problems-button-'+sectionCount,
    'id': 'software-problems-button-'+sectionCount,
    'html': 'Software'
  }).appendTo(separation);

  // set up input title section
  $('<input/>', {
    'type': 'text',
    'class': 'title',
    'name': 'title'+sectionCount,
    'placeholder': 'Title'
  }).appendTo(separation);

  /* set up toolbar section
  $('<div/>', {
    'class': 'toolbar',
  }).appendTo(separation);*/

  // set up editor section
  $('<textarea/>', {
    'type': 'text',
    'class': 'editor',
    'name': 'content'+sectionCount,
    'placeholder': 'Write description'
  }).appendTo(separation);

  $('<div/>', {
    'id': 'separation'+sectionCount
  }).appendTo(separation);

}


$('#plus').click(function() {
    addNewSection();
});

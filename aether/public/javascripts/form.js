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
$('[class^="section"]').on('click', '[class^="buttons"]', function() {
  // split id on -
  var splitID = $(this).attr("id").split('-');
  var firstID = splitID[0];
  var size = splitID.length
  var indexNum = splitID[size-1];

  // if button is lightblue
  if ($(this).css("background-color") == "rgb(69, 196, 191)") {

    // set value of input main button equal to the text of button pressed
    var mainButtonVal = $(this).text();
    $('#tag-'+indexNum).val(mainButtonVal);

    // make only one button selectable
    $('.buttons-'+indexNum).css("background-color", "rgb(69, 196, 191)");
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
    // when de-selected remove value from input main button
    $('#tag-'+indexNum).val("");

    $(this).css("background-color", "rgb(69, 196, 191)");
    // remove all sub-buttons pertaining to that section
    $('.sub-buttons-'+indexNum).css("display", "none");
  }
  // de-select all other sub-buttons
  $('.sub-buttons-'+indexNum).css("background-color", "rgb(69, 196, 191)");
});

// handles dynamically added sub suggestion buttons
$('[class^="section"]').on('click', '[class^="suggestion-buttons"]', function() {
  var splitID = $(this).attr("id").split('-');
  var size = splitID.length;
  var indexNum = splitID[size-1];

  // if background is lightblue
  if ($(this).css("background-color") == "rgb(69, 196, 191)") {

    // set value of input sub button equal to the text of sub button pressed
    var subButtonVal = $(this).text();
    $('#sub-tag-'+indexNum).val(subButtonVal);


    // make all other sub buttons lightblue
    $('.suggestion-buttons-'+indexNum).css("background-color", "rgb(69, 196, 191)");
    // change that button to gray
    $(this).css("background-color", "gray");
  }
  // if background is gray, change back to lightblue
  else {
    // when de-selected remove value from input sub button
    $('#sub-tag-'+indexNum).val("");
    $(this).css("background-color", "rgb(69, 196, 191)");
  }
})

// handles dynamically added sub suggestion buttons
$('[class^="section"]').on('click', '[class^="question-buttons"]', function() {
  var splitID = $(this).attr("id").split('-');
  var size = splitID.length;
  var indexNum = splitID[size-1];

  // if background is lightblue
  if ($(this).css("background-color") == "rgb(69, 196, 191)") {

    // set value of input sub button equal to the text of sub button pressed
    var subButtonVal = $(this).text();
    $('#sub-tag-'+indexNum).val(subButtonVal);

    // make all other sub buttons lightblue
    $('.question-buttons-'+indexNum).css("background-color", "rgb(69, 196, 191)");
    // change that button to gray
    $(this).css("background-color", "gray");
  }
  // if background is gray, change back to lightblue
  else {
    // when de-selected remove value from input sub button
    $('#sub-tag-'+indexNum).val("");
    $(this).css("background-color", "rgb(69, 196, 191)");
  }
})

// handles dynamically added sub problem buttons
$('[class^="section"]').on('click', '[class^="problem-buttons"]', function() {
  var splitID = $(this).attr("id").split('-');
  var size = splitID.length;
  var indexNum = splitID[size-1];

  // if background is lightblue
  if ($(this).css("background-color") == "rgb(69, 196, 191)") {

    // set value of input sub button equal to the text of sub button pressed
    var subButtonVal = $(this).text();
    $('#sub-tag-'+indexNum).val(subButtonVal);

    // make all other sub buttons lightblue
    $('.problem-buttons-'+indexNum).css("background-color", "rgb(69, 196, 191)");
    // change that button to gray
    $(this).css("background-color", "gray");
  }
  // if background is gray, change back to lightblue
  else {
    // when de-selected remove value from input sub button
    $('#sub-tag-'+indexNum).val("");
    $(this).css("background-color", "rgb(69, 196, 191)");
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
  var separation = $('#separation' + sectionCount);
  // make names for each section unique
  sectionCount++;

  $('<div/>', {
    'id': 'closeImg-'+sectionCount
  }).appendTo(separation)

  $('<img/>', {
    'src': '/images/close.png',
    'class': 'closed'
  }).appendTo($('div#closeImg-'+sectionCount))

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
    'text': 'Others'
  }).appendTo(separation);

  $('<div/>', {
    'class': 'suggestion-buttons-'+sectionCount + ' sub-buttons-' +sectionCount,
    'name': 'feature-suggestion-button-'+sectionCount,
    'id': 'feature-suggestion-button-'+sectionCount,
    'text': 'Features'
  }).appendTo(separation);

  $('<div/>', {
    'class': 'suggestion-buttons-'+sectionCount + ' sub-buttons-' +sectionCount,
    'name': 'configuration-suggestion-button-'+sectionCount,
    'id': 'configuration-suggestion-button-'+sectionCount,
    'text': 'Configuration'
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


  // put hidden input fields to store main/sub buttons
  $('<input/>', {
    'type': 'hidden',
    'name': 'tag-'+sectionCount,
    'id': 'tag-'+sectionCount
  }).appendTo(separation);

  $('<input/>', {
    'type': 'hidden',
    'name': 'sub-tag-'+sectionCount,
    'id': 'sub-tag-'+sectionCount
  }).appendTo(separation);


  // set up input title section
  $('<input/>', {
    'type': 'text',
    'class': 'title',
    'name': 'title-'+sectionCount,
    'id': 'title-'+sectionCount,
    'placeholder': 'Title'
  }).appendTo(separation);


  // set up editor section
  $('<textarea/>', {
    'type': 'text',
    'class': 'editor',
    'name': 'content-'+sectionCount,
    'id': 'content-'+sectionCount,
    'placeholder': 'Write description'
  }).appendTo(separation);


  $('<div/>', {
    'id': 'separation'+sectionCount
  }).appendTo(separation);

}

// delete section based on numSection
function deleteSection(numSection) {
  // remove main buttons
  $('#suggestions-button-'+numSection).remove();
  $('#questions-button-'+numSection).remove();
  $('#problems-button-'+numSection).remove();
  // remove sub buttons
  // remove suggestion buttons
  $('#other-suggestion-button-'+numSection).remove();
  $('#feature-suggestion-button-'+numSection).remove();
  $('#configuration-suggestion-button-'+numSection).remove();
  // remove question buttons
  $('#other-question-button-'+numSection).remove();
  $('#software-question-button-'+numSection).remove();
  $('#printer-question-button-'+numSection).remove();
  // remove problem buttons
  $('#other-problems-button-'+numSection).remove();
  $('#connectivity-problems-button-'+numSection).remove();
  $('#electrical-problems-button-'+numSection).remove();
  $('#mechanical-problems-button-'+numSection).remove();
  $('#software-problems-button-'+numSection).remove();
  // remove hidden inputs for div buttons
  $('#tag-'+numSection).remove();
  $('#sub-tag-'+numSection).remove();
  // remove input fields
  $('#title-'+numSection).remove();
  $('#content-'+numSection).remove();
  // remove delete button
  $('#closeImg-'+numSection).remove();

}

$('[class^="section"]').on('click', '[id^="closeImg"]', function() {
  var splitID = $(this).attr("id").split('-');
  var numSection = splitID[1];
  deleteSection(numSection);
})


$('#plus').click(function() {
    addNewSection();
});

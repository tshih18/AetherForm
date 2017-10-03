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

// make all dynamically added buttons work
$('.section').on('click', '.buttons', function() {
  // if button is lightblue
  if ($(this).css("background-color") == "rgb(173, 216, 230)") {
    // make only one button selectable
    $('.buttons').css("background-color", "lightblue");
    $(this).css("background-color", "gray");

    //console.log($(this).attr("id"));

    // split id on -
    var splitID = $(this).attr("id").split('-');
    var firstID = splitID[0];
    var firstIDNum = splitID[2];

    //if ($(this).attr('id') == "problems-button") {
    //if ($('[id^=problems-button]')) {
    if (firstID == "problems") {
      $('.sub-buttons').css("display", "none");
      $('.problem-buttons-'+firstIDNum).css("display", "initial");
    }
    /*else if ($(this).attr('id') == "prints-button") {
      $('.sub-buttons').css("display", "none");
      $('.print-buttons').css("display", "initial");
    }*/
    //else if ($(this).attr('id') == "suggestions-button") {
    //else if ($('[id^=suggestions-button]')) {
    //else if ($(this[id^="suggestions-button"])) {
    else if (firstID == "suggestions") {
      $('.sub-buttons').css("display", "none");
      $('.suggestion-buttons-'+firstIDNum).css("display", "initial");
    }
    //else if ($(this).attr('id') == "questions-button") {
    //else if ($('[id^=questions-button]')) {
    //else if ($(this[id^='questions-button'])) {
    else if (firstID == "questions") {
      $('.sub-buttons').css("display", "none");
      $('.question-buttons-'+firstIDNum).css("display", "initial");
    }
  }
  // if button is gray change back to lightblue
  else {
    $(this).css("background-color", "lightblue");
    $('.sub-buttons').css("display", "none");
  }
  // de-select all other sub-buttons
  $('.sub-buttons').css("background-color", "lightblue");
});

// handle sub-buttons click events -- need to make it dynamicly active
$('.problem-buttons').click(function() {
  if ($(this).css("background-color") == "rgb(173, 216, 230)") {

    $('.problem-buttons').css("background-color", "lightblue");
    $(this).css("background-color", "gray");
  }
  else {
    $(this).css("background-color", "lightblue");
  }
})
/*
$('.print-buttons').click(function() {
  if ($(this).css("background-color") == "rgb(173, 216, 230)") {

    $('.print-buttons').css("background-color", "lightblue");
    $(this).css("background-color", "gray");
  }
  else {
    $(this).css("background-color", "lightblue");

  }
})*/

$('.suggestion-buttons').click(function() {
  if ($(this).css("background-color") == "rgb(173, 216, 230)") {

    $('.suggestion-buttons').css("background-color", "lightblue");
    $(this).css("background-color", "gray");
  }
  else {
    $(this).css("background-color", "lightblue");
  }
})

$('.question-buttons').click(function() {
  if ($(this).css("background-color") == "rgb(173, 216, 230)") {

    $('.question-buttons').css("background-color", "lightblue");
    $(this).css("background-color", "gray");
  }
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

//var newSection = '<div class="section"><form action="/insert" method="post"><input type="text" class="title" name="title" placeholder="Title"><div class="toolbar"></div><input type="text" class="editor" name="content"> </form></div>'

var sectionCount = 0;

function addNewSection() {

  var separation = document.getElementById("separation" + sectionCount);

  // make names for each section unique
  sectionCount++;

  // add buttons
  $('<div/>', {
    'class': 'buttons',
    'name': 'suggestions-button-'+sectionCount,
    'id': 'suggestions-button-'+sectionCount,
    'html': 'Suggestions'
  }).appendTo(separation);

  $('<div/>', {
    'class': 'buttons',
    'name': 'questions-button-'+sectionCount,
    'id': 'questions-button-'+sectionCount,
    'html': 'Questions'
  }).appendTo(separation);

  $('<div/>', {
    'class': 'buttons',
    'name': 'problems-button-'+sectionCount,
    'id': 'problems-button-'+sectionCount,
    'html': 'Problems'
  }).appendTo(separation);

  // add sub-buttons






  // set up input title section
  $('<input/>', {
    'type': 'text',
    'class': 'title',
    'name': 'title'+sectionCount,
    'placeholder': 'Title'
  }).appendTo(separation);

  // set up toolbar section
  $('<div/>', {
    'class': 'toolbar',
  }).appendTo(separation);


  // set up editor section
  $('<input/>', {
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

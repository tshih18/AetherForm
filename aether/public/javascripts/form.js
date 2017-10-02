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

$('.buttons').click(function() {
  // if button is lightblue
  if ($(this).css("background-color") == "rgb(173, 216, 230)") {
    // make only one button selectable
    $('.buttons').css("background-color", "lightblue");
    $(this).css("background-color", "gray");
    if ($(this).attr('id') == "problems-button") {
      $('.sub-buttons').css("display", "none");
      $('.problem-buttons').css("display", "initial");
    }
    else if ($(this).attr('id') == "prints-button") {
      $('.sub-buttons').css("display", "none");
      $('.print-buttons').css("display", "initial");
    }
    else if ($(this).attr('id') == "suggestions-button") {
      $('.sub-buttons').css("display", "none");
      $('.suggestion-buttons').css("display", "initial");
    }
    else if ($(this).attr('id') == "questions-button") {
      $('.sub-buttons').css("display", "none");
      $('.question-buttons').css("display", "initial");
    }
  }
  // if button is gray
  else {
    $(this).css("background-color", "lightblue");
    $('.sub-buttons').css("display", "none");
  }
  $('.sub-buttons').css("background-color", "lightblue");
});

$('.problem-buttons').click(function() {
  if ($(this).css("background-color") == "rgb(173, 216, 230)") {

    $('.problem-buttons').css("background-color", "lightblue");
    $(this).css("background-color", "gray");
  }
  else {
    $(this).css("background-color", "lightblue");

  }
})

$('.print-buttons').click(function() {
  if ($(this).css("background-color") == "rgb(173, 216, 230)") {

    $('.print-buttons').css("background-color", "lightblue");
    $(this).css("background-color", "gray");
  }
  else {
    $(this).css("background-color", "lightblue");

  }
})

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

function button_onClick() {
   $('#a').click();
}
function linkClicked() {
    console.log("get data clicked");
}


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

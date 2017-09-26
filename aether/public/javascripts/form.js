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
      $('.problem-buttons').css("display", "initial");
      $('.print-buttons').css("display", "none");
      $('.suggestion-buttons').css("display", "none");
      $('.question-buttons').css("display", "none");
    }
    else if ($(this).attr('id') == "prints-button") {
      $('.print-buttons').css("display", "initial");
      $('.problem-buttons').css("display", "none");
      $('.suggestion-buttons').css("display", "none");
      $('.question-buttons').css("display", "none");
    }
    else if ($(this).attr('id') == "suggestions-button") {
      $('.suggestion-buttons').css("display", "initial");
      $('.problem-buttons').css("display", "none");
      $('.print-buttons').css("display", "none");
      $('.question-buttons').css("display", "none");
    }
    else if ($(this).attr('id') == "questions-button") {
      $('.question-buttons').css("display", "initial");
      $('.problem-buttons').css("display", "none");
      $('.print-buttons').css("display", "none");
      $('.suggestion-buttons').css("display", "none");
    }
  }
  // if button is gray
  else {
    $(this).css("background-color", "lightblue");
    $('.problem-buttons').css("display", "none");
    $('.print-buttons').css("display", "none");
    $('.suggestion-buttons').css("display", "none");
    $('.question-buttons').css("display", "none");
  }
  $('.problem-buttons').css("background-color", "lightblue");
  $('.print-buttons').css("background-color", "lightblue");
  $('.suggestion-buttons').css("background-color", "lightblue");
  $('.question-buttons').css("background-color", "lightblue");
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
  var newInputTitle = document.createElement("input");

  var typeAtt = document.createAttribute("type");
  typeAtt.value = "text";
  newInputTitle.setAttributeNode(typeAtt);

  var classAtt = document.createAttribute("class");
  classAtt.value = "title";
  newInputTitle.setAttributeNode(classAtt);

  var nameAtt = document.createAttribute("name");
  nameAtt.value = "title" + sectionCount;
  newInputTitle.setAttributeNode(nameAtt);

  var placeholderAtt = document.createAttribute("placeholder");
  placeholderAtt.value = "Title";
  newInputTitle.setAttributeNode(placeholderAtt);

  // set up toolbar section
  var newToolbar = document.createElement("div");

  var toolClassAtt = document.createAttribute("class");
  toolClassAtt.value = "toolbar";
  newToolbar.setAttributeNode(toolClassAtt);

  // set up editor section
  var newEditor = document.createElement("input");

  var editorTypeAtt = document.createAttribute("type");
  editorTypeAtt.value = "text"
  newEditor.setAttributeNode(editorTypeAtt);

  var editorClassAtt = document.createAttribute("class");
  editorClassAtt.value = "editor";
  newEditor.setAttributeNode(editorClassAtt);

  var editorNameAtt = document.createAttribute("name");
  editorNameAtt.value = "content" + sectionCount;
  newEditor.setAttributeNode(editorNameAtt);

  var newSeparation = document.createElement("div");

  var separationIdAtt = document.createAttribute("id");
  separationIdAtt.value = "separation" + sectionCount;
  newSeparation.setAttributeNode(separationIdAtt);


  separation.appendChild(newInputTitle);
  separation.appendChild(newToolbar);
  separation.appendChild(newEditor);
  separation.appendChild(newSeparation);

  // print name of title and editor
  console.log(newInputTitle.getAttribute("name"));
  console.log(newEditor.getAttribute("name"));
}



$('#plus').click(function() {
    addNewSection();
});

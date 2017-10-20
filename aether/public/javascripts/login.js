// calculates width of text
function calcWidth(text, ref) {
  var html_calc = '<span>' + text + '</span>';
  ref.html(html_calc);  // was html
  var width = ref.find('span:first').width();
  ref.html(text); // was html
  return width;
}

// re-adjust size of server-error messages
if ($('#success').text() != "") {
  var text = $('#success').html();
  var width = calcWidth(text, $('#success'));
  $('#success').css("width", width+10);
  $('#success').css("display", "none");
  $('#success').animate({
    height: 'toggle'
  }, 'slow');
}

// if there is error message in registration form, make it show
// need text() because html() will return <?logError/?>
if ($('#register .server-error').text() != "") {
  // handle width of messages
  var text = $('#register .server-error').text();
  $('#register .server-error').css("width", text.length*7);
  // handle button
  $('.button').css("background-color", "black");
  $('#register-button').css("background-color", "rgb(69, 196, 191)");
  // handle form
  $('#login').css("display", "none");
  $('#forgotButton').css("display", "none");
  $('#register').css("display", "initial");
}

// handle width of login server error messages
if ($('#login .server-error').text() != "") {
  var text = $('#login .server-error').text();
  $('#login .server-error').css("width", text.length*7);
}

// handle forgot password field when button clicked
$('#forgotButton').click(function() {
  //$('#forgotPassword').css("display", "initial");
  if ($('#forgotPassword').css("display") == "none") {
    $('#forgotPassword').slideDown("slow");
  }
  else {
    $('#forgotPassword').slideUp("slow");
  }
});

// if there is error message in forgot password, make it show
if ($('#forgot-error').text() != "") {
  $('#forgotPassword').css("display", "initial");
}


// handles displaying error messages
$('#register input').focusout(function() {
  switch ($(this).attr("id")) {
    case "username":
      if ($(this).val() == "") {
        $('#field-username #check').css("display", "none");
        $('#field-username #cross').css("display", "initial");
        $('#field-username .error').text("Enter a username");
        var text = $('#field-username .error').text();
        var width = calcWidth(text, $('#field-username .error'));
        $('#field-username .error').css("width", width+20);
      }
      else if ($(this).val().length < 6) {
        $('#field-username #check').css("display", "none");
        $('#field-username #cross').css("display", "initial");
        $('#field-username .error').text("Username must be at least 6 characters");
        var text = $('#field-username .error').text();
        var width = calcWidth(text, $('#field-username .error'))
        $('#field-username .error').css("width", width+20);
      }
      // if username checking passes
      else if ($(this).val().length >= 6) {
        $('#field-username #cross').css("display", "none");
        $('#field-username #check').css("display", "initial");
        $('#field-username .error').text("");
      }
      break;
    case "email":
      if ($(this).val() == "") {
        $('#field-email #check').css("display", "none");
        $('#field-email #cross').css("display", "initial");
        $('#field-email .error').text("Enter a email");
        var text = $('#field-email .error').text();
        var width = calcWidth(text, $('#field-email .error'))
        $('#field-email .error').css("width", width+20);
      }
      else {
        var email = $(this).val();
        // if email checking passes
        if (validateEmail(email)) {
          $('#field-email #cross').css("display", "none");
          $('#field-email #check').css("display", "initial");
          $('#field-email .error').text("");
        }
        else {
          $('#field-email #check').css("display", "none");
          $('#field-email #cross').css("display", "initial");
          $('#field-email .error').text("Enter a valid email");
          var text = $('#field-email .error').text();
          var width = calcWidth(text, $('#field-email .error'))
          $('#field-email .error').css("width", width+32);
        }
      }
      break;
      case "key":
        if ($(this).val() == "") {
          $('#field-key #check').css("display", "none");
          $('#field-key #cross').css("display", "initial");
          $('#field-key .error').text("Enter a key");
          var text = $('#field-key .error').text();
          var width = calcWidth(text, $('#field-key .error'))
          $('#field-key .error').css("width", width+20);
        }
        else if ($(this).val().length < 10 || $(this).val().length > 10) {
          $('#field-key #check').css("display", "none");
          $('#field-key #cross').css("display", "initial");
          $('#field-key .error').text("Key must be 10 characters");
          var text = $('#field-key .error').text();
          var width = calcWidth(text, $('#field-key .error'))
          $('#field-key .error').css("width", width+20);
        }
        // if key checking passes
        else {
          $('#field-key #cross').css("display", "none");
          $('#field-key #check').css("display", "initial");
          $('#field-key .error').text("");
        }
        break;
      case "password":
        if ($(this).val() == "") {
          $('#field-password #check').css("display", "none");
          $('#field-password #cross').css("display", "initial");
          $('#field-password .error').text("Enter a password");
          var text = $('#field-password .error').text();
          var width = calcWidth(text, $('#field-password .error'))
          $('#field-password .error').css("width", width+20);
        }
        else if ($(this).val().length < 6) {
          $('#field-password #check').css("display", "none");
          $('#field-password #cross').css("display", "initial");
          $('#field-password .error').text("Password must be at least 6 characters");
          var text = $('#field-password .error').text();
          var width = calcWidth(text, $('#field-password .error'))
          $('#field-password .error').css("width", width+20);
        }
        // if password checking passes
        else {
          $('#field-password #cross').css("display", "none");
          $('#field-password #check').css("display", "initial");
          $('#field-password .error').text("");
        }
        break;
      case "confirmPassword":
        if ($(this).val() == "") {
          $('#field-confirmPassword #check').css("display", "none");
          $('#field-confirmPassword #cross').css("display", "initial");
          $('#field-confirmPassword .error').text("Confirm your password");
          var text = $('#field-confirmPassword .error').text();
          var width = calcWidth(text, $('#field-confirmPassword .error'))
          $('#field-confirmPassword .error').css("width", width+20);
        }
        else if ($(this).val() != $('#password').val()) {
          $('#field-confirmPassword #check').css("display", "none");
          $('#field-confirmPassword #cross').css("display", "initial");
          $('#field-confirmPassword .error').text("Passwords must match");
          var text = $('#field-confirmPassword .error').text();
          var width = calcWidth(text, $('#field-confirmPassword .error'))
          $('#field-confirmPassword .error').css("width", width+20);
        }
        else {
          $('#field-confirmPassword #cross').css("display", "none");
          $('#field-confirmPassword #check').css("display", "initial");
          $('#field-confirmPassword .error').text("");
        }
        break;
      default:
        break;
    }//switch
})

// check if email matches regular expression
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}


// handles selecting buttons when clicked and displaying fields
$('#buttons').on('click', '.button', function() {
  // if not selected (black), make cyan
  if ($(this).css("background-color") == "rgb(0, 0, 0)") {
    $('.button').css("background-color", "black");
    $(this).css("background-color", "rgb(69, 196, 191)");

    // if login unhide login page
    if ($(this).attr("id") == "login-button") {
      $('#register').css("display", "none");
      $('#forgotPassword').css("display", "none");
      $('#forgotButton').css("display", "initial");
      $('#login').css("display", "initial");
    }
    // if register unhide register page
    else {
      $('#login').css("display", "none");
      $('#forgotPassword').css("display", "none");
      $('#forgotButton').css("display", "none");
      $('#register').css("display", "initial");
    }
  }
});

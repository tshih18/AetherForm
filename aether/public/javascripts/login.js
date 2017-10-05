$('#buttons').on('click', '.button', function() {
  // if not selected, make gray
  if ($(this).css("background-color") == "rgb(69, 196, 191)") {
    $('.button').css("background-color", "rgb(69, 196, 191)");
    $(this).css("background-color", "gray");

    // if login unhide login page
    if ($(this).attr("id") == "login-button") {
      $('#register').css("display", "none");
      $('#login').css("display", "initial");
    }
    // unhide register page
    else {
      $('#login').css("display", "none");
      $('#register').css("display", "initial");
    }
  }
});

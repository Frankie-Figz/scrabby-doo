console.log('js loaded');
// Grab the articles as a json
$.getJSON("savedarticles", data => {
    console.log(data);
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      console.log("This is data[i]");
      console.log(data[i]);
      let card = $('<div class="card" style="width: 36rem;" />');
      card.attr("id","card-" + data[i]._id);
      let cardBody = $('<div class="card-body" />');
      let cardTitle = $('<h5 class="card-title">');
      cardTitle.text(data[i].title);
      let cardArticleLink = $('<a class="card-link">Article Link</a>');
      cardArticleLink.attr('href', data[i].link);
      let cardSummary = $('<p class="card-text"></p>');
      cardSummary.text(data[i].summary);
      let cardNoteLink = $('<button class="btn btn-success float-right note-btn">New Note</button>');
      cardNoteLink.attr('data-id', data[i]._id);
      let cardOpenNotes = $('<button class="btn btn-success float-right note-open">Open Notes</button>');
      cardOpenNotes.attr('data-id',data[i]._id);

      cardBody.append([cardTitle, cardSummary, cardArticleLink, cardOpenNotes, cardNoteLink]);
      card.append([cardBody, notes]);
      $('#articles').append(card);
  }
});

$(document).on('click',".note-open", function(){
  var thisId = $(this).attr("data-id");
  let miniForm = $('<form> </form>');
  // let textBox = $('<textarea class="form-control" rows="5"></textarea>');
  console.log("card-" + thisId);
  var card = $("#card-" + thisId);
  var notes = [];
  var notesId = [];

  $.getJSON("/articles/" + thisId + "/comments", data => {
    // Iterate over our notes and append the note to the minibox
    // console.log(data.note.toString());
    console.log("This is the myarticles js ");
    console.log(data);
    for(var i = 0; i < data.length; i++){
      let cardSummary = $('<p class="card-text"></p>');
      cardSummary.text(data[i].body);
      card.append(cardSummary);
    };

    console.log("I am here trying to show my notes !");
  })

})

$(document).on('click', ".note-btn", function() {
  var thisId = $(this).attr("data-id");
  let miniForm = $('<form/>');
  let textbox = $('<textarea class="form-control" rows="5"></textarea>');
  let noteSubmit = $('<button class="btn btn-primary float-right note-submit" type="submit">Save</button>');
  noteSubmit.attr('data-id', thisId);
  miniForm.append([textbox, noteSubmit]);
  $(this).parent().append(miniForm);

});

$(document).on('click', ".note-submit", function(e) {
  e.preventDefault();
  var thisId = $(this).attr("data-id");
  let noteText = $(this).parent().find("textarea").val();

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId + "/comments",
    data: {
      body: noteText
    }
  }).then(data => {
    console.log(data);
  });

});


  
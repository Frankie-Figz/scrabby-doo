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
      let cardOpenNotes = $('<button class="btn float-right note-open">Open Notes</button>');
      cardOpenNotes.attr('data-id',data[i]._id);
      // Append all the previous elements to be displayed to the card
      cardBody.append([cardTitle, cardSummary, cardArticleLink, cardOpenNotes, cardNoteLink]);
      card.append([cardBody, notes]);
      $('#articles').append(card);
  }
});

$(document).on('click',".note-open", function(){
  // Get the id of the article
  var thisId = $(this).attr("data-id");
  // If their is a previous container with notes, get it. 
  // We will empty it to avoid having duplicity in comments.
  $(".container-notes").remove();
  // Create a new container to be used to append the notes to it.
  var container = $("<div>");
  container.attr("class","container-notes");
  // let textBox = $('<textarea class="form-control" rows="5"></textarea>');
  var card = $("#card-" + thisId);
  // A call to retrieve all the notes associated to an article
  $.getJSON("/articles/" + thisId + "/comments", data => {
    // Iterate over our notes and append the notes to the cards
    for(var i = 0; i < data.length; i++){
      let cardSummary = $('<p class="card-text"></p>');
      cardSummary.text(data[i].body);
      container.append(cardSummary);
    };
  // Closes the getJSON call
  });
  // Append the container to the card
  card.append(container);
});

$(document).on('click', ".note-btn", function() {
  $(".miniform-notes").remove();
  var thisId = $(this).attr("data-id");
  let miniForm = $('<form/>');
  miniForm.addClass("miniform-notes");
  miniForm.attr("id", "miniForm-" + thisId);
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
  var miniForm = $("#miniForm-" + thisId);
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId + "/comments",
    data: {
      body: noteText
    }
  }).then(data => {
    console.log(data);
    miniForm.remove();
  });
});


  
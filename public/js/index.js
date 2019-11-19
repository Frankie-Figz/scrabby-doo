console.log('js loaded');
// Grab the articles as a json
$.getJSON("/scrape", data => {
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    console.log(data[i])
    let card = $('<div class="card" style="width: 36rem;" />');
    let cardBody = $('<div class="card-body" />');
    let cardTitle = $('<h5 class="card-title">');
    cardTitle.text(data[i].title);
    let cardSummary = $('<p class="card-text"></p>');
    cardSummary.text(data[i].summary);
    let cardArticleLink = $('<a class="card-link">Article Link</a>');
    cardArticleLink.attr('href', data[i].link);
    
    let cardNoteLink = $('<button class="btn btn-success float-right save-btn">Save Article</button>'); 

    cardNoteLink.attr('data-id', data[i]._id)
    cardBody.append([cardTitle, cardSummary, cardArticleLink, cardNoteLink]);
    card.append(cardBody);
    $('#articles').append(card);
  }
});
 
$(document).on('click', ".save-btn", function() {
  let thisId = $(this).attr("data-id");
  console.log(thisId);
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      saved: true
    }
  });

  
});
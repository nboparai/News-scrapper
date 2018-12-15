$("#scrape").on("click", function () {
    
  $.get("/api/scrape", function(data){

    // res.send(data);
    alert("scrape complete")
  // console.log(`getting reponse back ${data}`);
  });
  // location.reload();

})

$("#getSaved").on("click", function () {
  $.get("/articles", function(data) {

  })
})

$('.delete-button').on('click', function(e){
  e.preventDefault();
  var qURL = location.href +'/' + $(this).data('comment');
  $.ajax({
    method:"DELETE",
    url:qURL
  })
  location.reload();
})


// function getSavedArticles () {

//     $.get('/api/savedArticles', function(data){
//         console.log(data, "this should be our articles")
//         data.forEach(object => {
//             $("#content").append(`<div class="articleCard"><div>${object.title}</div><div>${object.link}</div></div>`);
            
//         });
//     });
// }

// getSavedArticles();
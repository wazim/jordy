chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({ url: "http://project-jordan.herokuapp.com/jordan" });
});

function getItems() {
  console.log("Checking Jordan...");
  $.get("http://project-jordan.herokuapp.com/jordan/api?format=json", function(result){
        var currentItems = new Array();

        var items = localStorage.getItem("films");
        if(items === null) {
          items = new Array();
        } else {
          var myItems = jQuery.parseJSON(items);
          $.each(myItems, function(i, field){
            currentItems.push(field.name);
          });
        }

        var newItems = new Array();

        $.each(result, function(i, field){
          var item = jQuery.parseJSON(field);
          newItems.push(item.name);
        });

        if(currentItems.length === 0){
          localStorage.setItem("films", "["+result+"]");
        }
        else if(newItems.length > currentItems.length) {
          var newlyListedItems;
          newlyListedItems = $(newItems).not(currentItems).get();
          var count = 0;
          $.each(newlyListedItems, function(i, field){
            var opt = {
              type: "basic",
              title: field,
              message: "is now on Project Jordan",
              iconUrl: "icon.png"
            }

            chrome.notifications.create("Added"+count, opt, function(data) {});
            count++;
          });
          localStorage.setItem("films", "["+result+"]");
        }
        else {
          console.log("Nothing new");
        }
        console.log("Done!");
  });
}

setInterval(function() {getItems()}, 60000);

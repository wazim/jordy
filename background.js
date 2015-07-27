chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({ url: "http://project-jordan.herokuapp.com/jordan" });
});

function getItems() {
  $.getJSON("http://project-jordan.herokuapp.com/jordan/api/all?format=json", function(result){
        var currentItems = new Array();
        var items = localStorage.getItem("items");
        if(items === null) {
          items = new Array();
        }

        $.each(items, function(i, field){
          var obj = jQuery.parseJSON( field );
          currentItems.push(obj.name);
        });

        var newItems = new Array();
        $.each(result, function(i, field){
          var obj = jQuery.parseJSON( field );
          newItems.push(obj.name);
        });

        if(currentItems.length === 0){
          localStorage.setItem("items", result);
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

            chrome.notifications.create("Added"+count, opt, function(data) {
              console.log(data);
            });
            count++;
          });
          localStorage.setItem("items", result);
        }
  });
}

setInterval(getItems(), 60000);

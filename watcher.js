
console.log('dom ready');
// Request permission to show notifications
    Notification.requestPermission(function (permission) {
        if (permission !== 'granted') {
            alert('To use the watcher plugin, you have to allow notifications. Refresh the page to try again.');
        }
    });

    var url = location.href;

// Check that we are on a forum index page. 
    var index = url.indexOf('https://e-learn.sdu.dk/webapps/discussionboard/do/forum');
    if (index === 0) {

        // Get all unread posts
        var unreads = document.querySelectorAll('.unread-count');

        // Uncase there are no unread notifications, then there is nothing to check.
        if (unreads.length !== 0) {

            var newMessage = false;

            for (var i = 0; i < unreads.length; i++) {
                var unread = unreads[i];
                var text = unread.innerText;
                // Trim the text to remove any extra whitespace
                text = text.trim();

                if (text != '0') {
                    // We have a new message!! Whoop Whoop
                    // Also js doesn't have a type system :P
                    newMessage = unread.parentNode.parentNode.querySelector('a').href;
                    break;
                }
            }

            if (!newMessage) {
                // Wait one minute before refreshing the site
                setTimeout(function () {
                    localStorage.setItem("causedRefresh", "true");
                    location.reload(true);
                }, 10 * 1000);
                localStorage.removeItem("causedRefresh");
            } else {
                var did = localStorage.getItem("causedRefresh");
                if (did === 'true') {
                    var notification = new Notification("There are new messages on the current blackboard forum. Please check them!");
                    notification.onclick = function () {
                        window.focus();
                        location.href = newMessage;
                        notification.close();
                    };
                    localStorage.removeItem("causedRefresh");
                }
            }
        }
    } else {
        index = url.indexOf('https://e-learn.sdu.dk/webapps/discussionboard/do/message');
        if (index === 0) {
            var inter = setInterval(function() {
                console.log('querying');
                let posts = document.querySelectorAll('.db-message-wrapper');
                console.log(window.displayMessage);
                if(posts.length > 0 && window.displayMessage) {
                    // There is now things we can do
                    clearInterval(inter);

                    debugger;
                    for (let i = 0; i < posts.length; i++) {
                        let post = posts[i];
                        console.log('loading message', post.id);
                        window.displayMessage(null, post.id, false, true);
                    }
                }
            }, 1000);
            // We are in a thread

        }
    }
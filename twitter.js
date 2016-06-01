JQTWEET = {
	
	// Set twitter username, number of tweets & id/class to append tweets
	user: 'vniatia',
	numTweets: 20,
	appendTo: '#jstwitter',

	// core function of jqtweet
	loadTweets: function() {
		$.ajax({
			url: 'tweets.php',
			type: 'post',
			dataType: 'json',
			data: {
				q: JQTWEET.user,
				count: JQTWEET.numTweets,
        api: 'statuses/user_timeline'
			},
			success: function(data, textStatus, xhr) {

			 var html = '<div class="grid-item">TWEET_IMG<img class="img-user" src="PHOTO"/><span class="name">NAME</span><span class="user_name">@USER</span><br>TWEET_TEXT<div class="time">AGO</div>';
             
                var dataNew = data;
                if (oldListTweets.length > 0){
                    dataNew = newTeets(oldListTweets, data);
                }
                
                oldListTweets = data;
                data = dataNew;
                
				// append tweets into page
				for (var i = data.length-1; i >=0; i--) {
                    /*if(data[i].text.indexOf("RT") < 0)*/ {
                       $(JQTWEET.appendTo).prepend(
						html.replace('TWEET_TEXT', JQTWEET.ify.clean(data[i].text))
							.replace(/USER/g, data[i].user.screen_name)
							.replace('AGO', JQTWEET.timeAgo(data[i].created_at))
							.replace(/ID/g, data[i].id_str)
                            .replace('PHOTO', data[i].user.profile_image_url)
                            .replace('NAME', data[i].user.name)
              .replace('TWEET_IMG', (data[i].entities.media && data[i].entities.media.length ? '<img src="' + data[i].entities.media[0].media_url + '"/>': ''))
					);
                     
                    }

				}					
			}	

		});
		
	}, 
	
		
	/**
      * relative time calculator FROM TWITTER
      * @param {string} twitter date string returned from Twitter API
      * @return {string} relative time like "2 minutes ago"
      */
    timeAgo: function(dateString) {
		var rightNow = new Date();
		var then = new Date(dateString);
		
		/*if ($.browser.msie) {
			// IE can't parse these crazy Ruby dates
			then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
		}*/

		var diff = rightNow - then;

		var second = 1000,
		minute = second * 60,
		hour = minute * 60,
		day = hour * 24,
		week = day * 7;

		if (isNaN(diff) || diff < 0) {
			return ""; // return blank string if unknown
		}

		if (diff < second * 2) {
			// within 2 seconds
			return "right now";
		}

		if (diff < minute) {
			return Math.floor(diff / second) + " seconds ago";
		}

		if (diff < minute * 2) {
			return "about 1 minute ago";
		}

		if (diff < hour) {
			return Math.floor(diff / minute) + " minutes ago";
		}

		if (diff < hour * 2) {
			return "about 1 hour ago";
		}

		if (diff < day) {
			return  Math.floor(diff / hour) + " hours ago";
		}

		if (diff > day && diff < day * 2) {
			return "yesterday";
		}

		if (diff < day * 365) {
			return Math.floor(diff / day) + " days ago";
		}

		else {
			return "over a year ago";
		}
	}, // timeAgo()
    
	
    /**
      * The Twitalinkahashifyer!
      * http://www.dustindiaz.com/basement/ify.html
      * Eg:
      * ify.clean('your tweet text');
      */
    ify:  {
      link: function(tweet) {
        return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
          var http = m2.match(/w/) ? 'http://' : '';
          return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
        });
      },

      at: function(tweet) {
        return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
          return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
        });
      },

      list: function(tweet) {
        return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
          return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
        });
      },

      hash: function(tweet) {
        return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
          return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
        });
      },

      clean: function(tweet) {
        return this.hash(this.at(this.list(this.link(tweet))));
      }
    } // ify

	
};


var oldListTweets = [];


function newTeets(oldList, newList){
    var resultNewTeets = [];
    //var cptNL = 0;
    
    var cptMaxOld = oldList.length;
    var cptMaxNew = newList.length;
    var isOld = false;
    
    
    
    for(var i=0; i < cptMaxNew ;i++){
        vNL = newList[i];
        isOld = false;
        //cptNL = 0;
        for(var j=0; j < cptMaxOld && isOld == false ; j++){
            vOL = oldList[j];
           if (vNL['id'] == vOL['id']) {
               isOld = true;
           }
        }
        if ( isOld == false){
            resultNewTeets.push(vNL);
            console.log("new teets "+vNL['id']);
        }
    }
    
    return resultNewTeets;
}


$(document).ready(function () {
	JQTWEET.loadTweets();
    $('.grid').masonry({
        itemSelector: '.grid-item',
        columnWidth: 300
    }); 
    setInterval(function (){
        JQTWEET.loadTweets();
        $(".grid").masonry('reloadItems');
    }, 6000);
});



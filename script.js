// UUID Generator function using the browser's native crypto API
function generateUUID() {
    return crypto.randomUUID();
}

// Event listener for all click events in the document
document.addEventListener('click', function(e){
    
    // Handle like button clicks
    if (e.target.dataset.like) {
       handleLikeClick(e.target.dataset.like) 
    }
    
    // Handle retweet button clicks
    else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)
    }
    
    // Handle reply button clicks
    else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply)
    }
    
    // Handle new tweet button clicks
    else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick()
    }
})
 
// Handles the like button click event
// @param {string} tweetId - The UUID of the tweet to like/unlike

function handleLikeClick(tweetId){ 

    // Find the tweet object in the data array
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    // Toggle like status and update count
    if (targetTweetObj.isLiked) {
        targetTweetObj.likes--
    }

    else {
        targetTweetObj.likes++ 
    }
    
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

// Handles the retweet button click event
// @param {string} tweetId - The UUID of the tweet to retweet/unretweet

function handleRetweetClick(tweetId){

    // Find the tweet object in the data array
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    // Toggle retweet status and update count
    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets--
    }

    else {
        targetTweetObj.retweets++
    }
    
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

// Handles the reply button click event
// @param {string} replyId - The UUID of the tweet to show/hide replies for

function handleReplyClick(replyId){

    // Toggle visibility of replies section
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

// Handles creating and posting a new tweet

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    // Only create tweet if there is content
    if(tweetInput.value){

        // Add new tweet to the beginning of tweets array
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: generateUUID()
        })
        
        // Update the UI and clear input
        render()
        tweetInput.value = ''
    }
}


// Generates HTML for the tweet feed
// @returns {string} HTML string containing all tweets and their replies

function getFeedHtml(){
    let feedHtml = ``
    
    // Loop through each tweet and generate its HTML
    tweetsData.forEach(function(tweet){

        // Set like button styling
        let likeIconClass = ''
        if (tweet.isLiked) {
            likeIconClass = 'liked'
        }
        
        // Set retweet button styling
        let retweetIconClass = ''
        if (tweet.isRetweeted) {
            retweetIconClass = 'retweeted'
        }
        
        // Generate HTML for replies if they exist
        let repliesHtml = ''
        if(tweet.replies.length > 0) {
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>
                    `
            })
        }
        
        // Build the tweet HTML with all its components  
        feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots"
                                data-reply="${tweet.uuid}"
                                ></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}"
                                data-retweet="${tweet.uuid}"
                                ></i>
                                ${tweet.retweets}
                            </span>
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                </div>   
            </div>
            `
   })
   
   return feedHtml 
}

// Updates the DOM with the current state of tweets
function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

// Initial render of the feed
render()



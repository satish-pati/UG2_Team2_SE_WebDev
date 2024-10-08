(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentvideo = "";

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const {type, value, videoId} = obj;

        if(type == "NEW"){
            currentVideo = videoId;
            newVideoLoaded();
        }
    });

    const newVideoLoaded = () =>{
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];

        if (!bookmarkBtnExists){
            const bookmarkBtn = document.createElement("img");

            bookmarkBtn.src = crome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            bookmarkBtn.title = "click to bookmark current timestamp";
        }
    }
})();
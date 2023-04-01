
/**************** SET UP DATA *******************************/

const musicVideos = [
  { song: 'I Am the Wind', filepath: 'videos/IAmTheWind_Hendin.mp4', caption: "One of the most fun recordings and videos I have ever done. Animation by the amazing Yuliya Osaka" },
  { song: 'The Test of Time', filepath: 'videos/TheTestOfTime_Hendin.mov', caption: "Video was done using a rented camera, hand figures, wood, props and paint from Blick Art. Also super fund to record." },
  { song: 'Rosalie McFall', filepath: 'videos/RosalieMcFall_Hendin.m4v', caption: "Cover song of Grateful Dead version. Always loved this song." },
  { song: 'I\'m a Survivor', filepath: 'videos/ImASurvivor_Hendin.mp4', caption: "Inspired by a terrible loss that changed me, but also connected me with others who had been through the same thing." },
  { song: 'Monkey Dance', filepath: 'videos/MonkeyDance_Hendin.mp4', caption: "Random experience with this one: Some goofy fun done with garageband. Written during nights at a tennis camp for adults." },
  { song: 'Once in a While', filepath: 'videos/OnceInAWhile_Hendin.mp4', caption: "This was an old recording that revived by amazing animator Gosha Loshadkin - Gosha created the concept and executed beautifully and I am forever grateful to him." },
  { song: 'Henry Poole is Here', filepath: 'videos/HenryPooleIsHere_Hendin.mp4', caption: "Written for a Movie/Song Contest - Movie is Henry Poole is Here which is a quirky indie film" }
];

/**************** GRAB DOM ELEMENTS *************************/

// dropdown to select video
const select = document.querySelector('#select');

// text for title of song - every time we choose song from dropdown title of song should populate here:
let titleText = document.querySelector('#titleText');

// text for caption of song - every time we choose song from dropdown caption of song should populate here:
let captionText = document.querySelector('#captionText');

//player
const player = document.querySelector('.player');
// note that inside of player we have everythign else
// so we will call player.querySelector() for elements inside the player

// element that contains link to actual video
const video = player.querySelector('.viewer');

// progress bar
const progress = player.querySelector('.progress');

// progress bar filled 
const progressBar = player.querySelector('.progress__filled');

// button that will toggle between pause and play
const toggle = player.querySelector('.toggle');

// skip buttons for skip forward and skip back
const skipButtons = player.querySelectorAll('[data-skip]');

// slider to scrub video:
const ranges = player.querySelectorAll('.player__slider');

// fullscreen
const fullscreen = player.querySelector("#fullscreen");

/**************** BUILD OUT FUNCTIONS *************************/
// feed dropdown with array of music videos
const mysongs = musicVideos.map(musicVideo => {
    let option = document.createElement("OPTION");
    let txt = document.createTextNode(musicVideo.song);
    option.appendChild(txt);
    option.setAttribute("value", musicVideo.filepath);
    option.setAttribute("data-title", musicVideo.song);
    option.setAttribute("data-caption", musicVideo.caption);    
    select.insertBefore(option, select.lastChild);    
});

// Update the Video Source with the filename from Select dropdown option
function changeVideoSrc(event){
// get the filepath value from select element
select[this.filepath] = this.value;
  console.log(select.value);
  video.setAttribute("src", select[this.filepath]);   
}

// Update the Song Title and Caption displayed - when I select a song, I want to see its respective title and caption
function updateTitleAndCaption(event){
  let titleDS = event.target.options[event.target.selectedIndex].dataset.title;
  let captionDS = event.target.options[event.target.selectedIndex].dataset.caption;
  console.log("Song Title: " + titleDS);
  console.log("Song Caption: " + captionDS);
  titleText.textContent=titleDS;
  captionText.textContent=captionDS;
};


// toggle play and pause
function togglePlay() {
// if video is playing, pause it, and vice versa
/*    
if(video.paused) {     // Note: "paused" is a property that lives on the video
  video.play(); 
} else {
  video.pause();
}  
*/
// because method name is in a string 
// you can call video and access the method name this way:
const method = video.paused ? 'play' : 'pause';
video[method]();
}  

// We will hook this up to event listener 
// both when you click video as well as when you click the togglebutton

//****************************** 
// update the button depending on  
// whether video is playing or if video is paused
// Note that button is actually just text of play and pause
function updateButton() {
  // we can use "this" because it's bound to the video itself
const icon = this.paused ? '►' : '❚ ❚';
console.log(icon);
//set the toggle button 
toggle.textContent = icon;
}

// Go Full Screen
function openFullscreen() { 
video.requestFullscreen && video.requestFullscreen();
};


// skip - note with skip buttons in index.html 
// each dom element button for skip (fwd, bkwd) 
// has a data-skip attribute 
function skip() {
// how much to skip the video?  
// set current time in video to the data-skip value (in <button> elements)
video.currentTime += parseFloat(this.dataset.skip);
}

// Range for playbackRate and volume
// NOTE in index.html you will see input type="range"
// one input with name volume to matcch the actual video property volume
// one input with name playbackRate to match the actual video property playbackRate
function handleRangeUpdate() {
// name will either be volume or playbackRate
 video[this.name] = this.value;
//     console.log(this.name);
//     console.log(this.value);
}

// when we play video, progress bar should be updating in real time
// we will use a percentage
// we will update the flexBasis value of the progress bar depending on where we are in the video
function handleProgress() {
// calculate percent based oo
// 1-duration of video: video.duration (duration is a property of "video")
// 2-current time in video: video.currentTime) (currentTime is a property of "video")
const percent = (video.currentTime / video.duration) * 100;
// set the flexBasis of progressBar = this percent
 progressBar.style.flexBasis = `${percent}%`;
}
// We will listen for the video to emit an event called "timeupdate"
// when that happens we will run handleProgress()

// **************************************************
// scrub the video!
// we will listen for a click on the video bar
// wherever I have clicked (if prog bar is 640 pixels wide and I click at 320 pixels x position)
                          // 320 is half way and I would scrub video 50% of its duration 
// Note: we have a "MouseEvent" that has a property called offsetX 
// we will use offsetX property 
function scrub(e) {
  // percentage to scrub = 
  // (offsetX position / grab width of progress bar ) * duration of video 
 const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
 video.currentTime = scrubTime;
}

/********** HOOK UP EVENT LISTENERS *********************/


// LISTEN for dropdown selection - change the video source
select.addEventListener('change', changeVideoSrc);

// LISTEN for dropdown selection - change the song title and song caption
select.addEventListener('change', updateTitleAndCaption);


// listen: when you click video as well as when you click the togglebutton
// then we will run togglePlay function
video.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);

// listen: when video is playing/paused
// then we will run updateButton and update the play button 
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);



// listen: when video emits timeupdate event
// run handleProgress which will handle progress bar via handleProgress() function
video.addEventListener('timeupdate', handleProgress);

// listen: anything that has a data-skip attribute
// then run the skip function which will skip back or forward 
// so this is applying to all buttons (see "skipButtons") above
// with data-skip attribute 
skipButtons.forEach(button => button.addEventListener('click', skip));

// listen: listen for change and mousemove on each slider/range inputs
// then execute handleRangeUpdate 
// this will address both volume and playbackRate
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

// listen: for click on progress bar and then run scrub to scrub the video
// we will run scrub function
// mousedown is a variable that is being used as a flag to determine when to scrub
// We need to 1) scrub to point we click at
// We need to 2) scrub when/while clicking and dragging 
// Once we mouse down, we'll listen for when you mouse move over top of it)
let isMouseDown = false;


// SCRUB VIDEO LISTENERS
// CLICK on progress bar >> scrub to that point in video
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => isMouseDown  && scrub(e));
// when person mouses down set mousedown to true
// note here the event is mousedown and also our variable mousedown is true

progress.addEventListener('mousedown', () => isMouseDown  = true);
// when someone mouses up set mousedown variable to false
progress.addEventListener('mouseup', () => isMouseDown  = false);
progress.addEventListener('mouseleave', () => isMouseDown  = false);

// listen for click of Fullscreen icon
fullscreen.addEventListener("click", openFullscreen);

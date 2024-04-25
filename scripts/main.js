document.addEventListener('DOMContentLoaded', function() {

    /* =============================== header js starts =============================== */
    // Selecting elements
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const youtubeLogo = document.querySelector('.youtube-logo');
    const searchIcon = document.querySelector('.search-button'); // Selecting the search icon
    const searchBar = document.querySelector('.search-bar');
    const rightSection = document.querySelector('.right-section');
    const arrowback = document.querySelector('.arrowback');

    // Function to handle resizing
    function handleResize() {
        if (window.innerWidth <= 650) { // Check if window width is less than or equal to 650 pixels
            // Adding event listener for the search icon
            searchIcon.addEventListener('click', () => { // Styling the event listener
                // Making the search bar visible by changing opacity
                searchBar.style.opacity = 1;
                arrowback.style.opacity = 1;
                hamburgerMenu.style.display = 'none';
                youtubeLogo.style.display = 'none';
                rightSection.style.display = 'none';
            });

            // Adding event listener for the search icon
            arrowback.addEventListener('click', () => { // Styling the event listener
                // Making the search bar visible by changing opacity
                searchBar.style.opacity = 0;
                arrowback.style.opacity = 0;
                hamburgerMenu.style.display = 'flex';
                youtubeLogo.style.display = 'flex';
                rightSection.style.display = 'flex';
            });
        } else {
            // Remove event listeners if the window width is greater than 650 pixels
            searchIcon.removeEventListener('click', () => {});
            arrowback.removeEventListener('click', () => {});
        }
    }

    // Initial call to handleResize
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);


    /* =============================== header js ends =============================== */

    /* =============================== sidebar js starts =============================== */
    
    const menuIcon = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const container = document.querySelector('.container');
    const subcribeList = document.querySelector('.subcribe-list');
    const sidebarRight = document.querySelectorAll('.sidebar-right');
    const iconTitle = document.querySelectorAll('.icon-title');
    const sub_side_bar = document.querySelectorAll('.sub-side-bar');


    menuIcon.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-width-decrease');
        container.classList.toggle("large-cotainer");
        subcribeList.classList.toggle('samll-sidebar');

        // Toggle display of sidebarRight elements based on sidebar visibility
        if (sidebar.classList.contains('sidebar-width-decrease')) {
            sidebarRight.forEach(element => {
                element.style.opacity= 1; // Hide all elements with class sidebar-right
            });
        } else {
            sidebarRight.forEach(element => {
                element.style.opacity = 0; // Display all elements with class sidebar-right
            });
        }

        if(sidebar.classList.contains('sidebar-width-decrease')){
            iconTitle.forEach(items => {
                items.style.opacity = 0;
            });
        }else{
            iconTitle.forEach(items => {
                items.style.opacity = 1;
            });
        }

        console.log("Sidebar width decrease:", sidebar.classList.contains('sidebar-width-decrease'));

        if(sidebar.classList.contains('sidebar-width-decrease')){
            sub_side_bar.forEach(titleIcon => {
                titleIcon.style.marginBottom = '0rem !important';
                
            });
        }else{
            sub_side_bar.forEach(titleIcon => {
                console.log('Setting margin for:', titleIcon);
                titleIcon.style.marginBottom = '.5rem';
            });
        }

        console.log(sub_side_bar);

    });

    /* =============================== sidebar js ends =============================== *

    const allVideos = document.querySelectorAll('.side-video-list');

    /*const video2 = document.getElementById("video2");
    video2.addEventListener('click', function() {
        changeVideo('image/video.mp4');
    });

    const video1 = document.getElementById("video1");
    video1.addEventListener('click', function() {
    changeVideo('image/ineedYou.mp4');
    });*/

    /*const allVideos = document.querySelectorAll('.side-video-list');

    allVideos.forEach((video) =>{
        console.log(video.children[0].id);
        video.children[0].addEventListener('click', () => {
            changeVideo(video.children[0].id);
        });

    });

    let currentVideo = localStorage.getItem('currentVideo');
    const homeVideos = document.querySelectorAll('.video-preview');
    homeVideos.forEach((video) => {
        console.log(video);
        
        video.addEventListener('click', () =>{
            localStorage.setItem('currentVideo', video.id);
        });
    });

    console.log(typeof(currentVideo));

    let videoSource = document.getElementById("video-source");

    if(currentVideo === ''){
        console.log('Video par défaut : ');
        videoSource.src = 'video/ineedYou.mp4';
    }else{
        console.log('vidéo couraante : ' + currentVideo); 
        if(videoSource){

            videoSource.src = currentVideo;
            let mainVideo = document.getElementById("main-video");
            mainVideo.load(); // Load the new video
            mainVideo.play(); // Play the new video

        }
    }

    function changeVideo(newSrc) {
        console.log("Changing video source to:", newSrc);
        console.log(currentVideo);
        console.log("Current video source:", videoSource.src);
        videoSource.src = newSrc;
        console.log("New video source:", videoSource.src);
        let mainVideo = document.getElementById("main-video");
        mainVideo.load(); // Load the new video
        mainVideo.play(); // Play the new video

    }*/





    

});

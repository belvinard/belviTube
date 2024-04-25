
$(document).ready(function() {
    /* =============================== play-video jQuery starts =============================== */

    // Array to store video paths and titles
    let videoPaths = [
        "video/ineedYou.mp4",
        "video/video.mp4",
        "video/succesKey.mp4"
    ];

    let videoTitles = [
        "Matt Maher - Lord, I Need You",
        "Avenir Sim Tebegue A Nti Vidéo officielle",
        "LE CULTE EN DIRECT - La clé de tout succès"
    ];

    let currentIndex = 0;

    // Function to update the number of views and time ago
    function updateViewsAndTimeAgo(views, daysAgo) {
        $('.play-video-info .time-ago .views').text(views);
        $('.play-video-info .time-ago .days').text(daysAgo);
    }

    // Function to simulate updating the views and days ago when a video is clicked
    function updateVideoStats(videoIndex) {
        let newViews = Math.floor(Math.random() * 1000); // Example: Random views count
        let newDaysAgo = Math.floor(Math.random() * 7); // Example: Random days ago
        updateViewsAndTimeAgo(newViews + " Views", newDaysAgo + " days ago");
    }

    // Function to clear the active state from all thumbnails
    function clearActiveThumbnails() {
        $('.small-thimbmail').removeClass('active-thumbnail');
    }

    // Function to clear the active background from all video containers
    function clearActiveContainers() {
        $('.side-video-list').removeClass('active-video-container');
    }

    // Function to load and play a video
    function loadAndPlayVideo(index, thumbnail) {
        clearActiveThumbnails();
        clearActiveContainers();
        
        // Set the new video source and title
        $('#video-source').attr('src', videoPaths[index]);
        $('.play-video-title').text(videoTitles[index]);
        
        // Load and play the new video
        $('#main-video')[0].load();
        $('#main-video')[0].play();
        
        // Add active state to the clicked thumbnail
        $(thumbnail).addClass('active-thumbnail');

        // Add active state to the container of the clicked thumbnail
        $(thumbnail).closest('.side-video-list').addClass('active-video-container');

        updateVideoStats(index);

        // Update the href attribute of the download button to point to the current video
        $('#download-button').attr('href', videoPaths[index]);
    }

    // Attach event listeners to video thumbnails
    $('.small-thimbmail').each(function(index) {
        $(this).on('click', function() {
            loadAndPlayVideo(index, this);
        });
    });

    // Function to play the next video
    function playNextVideo() {
        // Remove active state from the previous thumbnail and video container
        $('.small-thimbmail').eq(currentIndex).removeClass('active-thumbnail');
        $('.small-thimbmail').eq(currentIndex).closest('.side-video-list').removeClass('active-video-container');

        currentIndex = (currentIndex + 1) % videoPaths.length;
        $('#video-source').attr('src', videoPaths[currentIndex]);
        $('#main-video')[0].load();
        $('#main-video')[0].play();

        // Clear active state from all thumbnails
        clearActiveThumbnails();

        // Add active state to the next thumbnail
        $('.small-thimbmail').eq(currentIndex).addClass('active-thumbnail');

        // Add active state to the next video container
        $('.small-thimbmail').eq(currentIndex).closest('.side-video-list').addClass('active-video-container');

        // Update video stats for the next video
        updateVideoStats(currentIndex);

        // Set the title for the main video
        $('.play-video-title').text(videoTitles[currentIndex]);
    }


    // Event listener for the 'ended' event of the video
    $('#main-video').on('ended', function() {
        playNextVideo();
    });

    // Function to load and play the first video when the document is ready
    function loadAndPlayFirstVideo() {
        $('#video-source').attr('src', videoPaths[currentIndex]);
        $('#main-video')[0].load();
        $('#main-video')[0].play();

        // Add active state to the next thumbnail
        $('.small-thimbmail').addClass('active-thumbnail');

        // Set the title for the main video
        $('.play-video-title').text(videoTitles[currentIndex]);

    }

    // Initial call to load and play the first video
    loadAndPlayFirstVideo();

    /* =============================== play-video jQuery ends =============================== */

    /* =============================== comments jQuery ends =============================== */
    
    // Hide submit and cancel buttons initially
    $('#submit, #cancel-comment').hide();

    // Function to show buttons when user starts typing
    $('#input').on('input', function() {
        if ($(this).val().trim() !== '') {
            $('#submit, #cancel-comment').show();
            // Show comment section if hidden
            $('.comment-section').show();
        } else {
            $('#submit, #cancel-comment').hide();
        }
    });

    // Function to clear comment textarea
    function clearComment() {
        $('#input').val('');
        $('#submit, #cancel-comment').hide();
    }

    // Clear comment textarea when cancel button is clicked
    $('#cancel-comment').click(function() {
        clearComment();
    });

    function getTimeAgo(dateTime) {
        const minute = 60, hour = minute * 60, day = hour * 24, week = day * 7;
        let delta = (new Date() - new Date(dateTime)) / 1000;
        if (delta < 30) {
            return 'Commented just now';
        } else if (delta < minute) {
            return 'Commented ' + Math.floor(delta) + ' seconds ago';
        } else if (delta < 2 * minute) {
            return 'Commented a minute ago';
        } else if (delta < hour) {
            return 'Commented ' + Math.floor(delta / minute) + ' minutes ago';
        } else if (Math.floor(delta / hour) == 1) {
            return 'Commented 1 hour ago';
        } else if (delta < day) {
            return 'Commented ' + Math.floor(delta / hour) + ' hours ago';
        } else if (delta < day * 2) {
            return 'Commented yesterday';
        } else if (delta < week) {
            return 'Commented ' + Math.floor(delta / day) + ' days ago';
        } else if (delta < week * 2) {
            return 'Commented last week';
        } else {
            return 'Commented ' + Math.floor(delta / week) + ' weeks ago';
        }
    }
    

    // Function to load comments and display "time ago" format
    function loadComments() {
        $.ajax({
            url: 'video.php', // Current file (video.php)
            type: 'GET',
            dataType: 'json',
            // Updated success function in loadComments
            success: function(data) {
                var commentSection = $('#commentSection');
                var commentsNumber = $('#commentsNumber'); // Add this line to select the comments number element
                commentSection.empty(); // Clear existing comments

                data.forEach(function(comment) {
                    let timeAgo = getTimeAgo(comment.created_at);
                    let commentHTML = '<p>' + comment.comment + '<br><span class="time-ago">' + timeAgo + '</span></p>';
                    commentSection.append(commentHTML);
                });

                // Update comments number
                commentsNumber.text(data.length + (data.length === 1 ? ' comment' : ' comments'));
            },

            error: function(xhr, status, error) {
                console.log('Error fetching comments:', error);
                console.log('Response:', xhr.responseText); // Log the response for debugging
            }
        });
    }

    // Load comments and display "time ago" format on page load
    loadComments();

    // Handle comment submission using AJAX
    $('#submit').click(function() {
        var comment = $('#input').val().trim();

        if (comment !== '') {
            $.ajax({
                url: 'video.php', // Current file (video.php)
                type: 'POST',
                data: { action: 'submit_comment', comment: comment },
                success: function(response) {
                    console.log('Server response:', response);
                    $('#input').val(''); // Clear textarea
                    loadComments(); // Reload comments after submission
                },
                error: function(xhr, status, error) {
                    console.log('Error submitting comment:', error);
                }
            });
        }
    });


    /* =============================== comments jQuery ends =============================== */

    /* =============================== header jQuery starts =============================== */
    const searchIcon = $('.search-button'); // Selecting the search icon
    const searchBar = $('.search-bar');
    const arrowback = $('.arrowback');
    // Function to handle resizing
    function handleResize() {
        if ($(window).width() <= 650) {
            searchIcon.on('click', function() {
                searchBar.css('opacity', 1);
                arrowback.css('opacity', 1);
                $('.hamburger-menu, .youtube-logo, .right-section').hide();
            });
            arrowback.on('click', function() {
                searchBar.css('opacity', 0);
                arrowback.css('opacity', 0);
                $('.hamburger-menu, .youtube-logo, .right-section').show();
            });
        } else {
            searchIcon.off('click');
            arrowback.off('click');
        }
    }
    // Initial call to handleResize
    handleResize();
    // Add event listener for window resize
    $(window).resize(handleResize);

    /* =============================== header jQuery ends =============================== */

    /* =============================== sidebar jQuery starts =============================== */
    const sidebar = $('.sidebar');
    const youtube = $('.subSidebar');
    $('.hamburger-menu').on('click', function() {
        sidebar.toggleClass('show-sidebar');
        youtube.toggleClass('show-sidebar');
    });
    $('.closeBtn').on('click', function() {
        sidebar.removeClass('show-sidebar');
        youtube.removeClass('show-sidebar');
    });
    /* =============================== sidebar js ends =============================== */

    const likeCountDisplay = $('.like-count');
    const dislikeCountDisplay = $('.dislike-count');
    const likeButton = $('.like-button');
    const dislikeButton = $('.dislike-button');

    // Fonction pour formater le nombre pour l'affichage
    function formatCount(count) {
        if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'k'; // Affiche le nombre en milliers avec une décimale
        } else {
            return count.toString(); // Affiche le nombre tel quel s'il est inférieur à 1000
        }
    }

    // Fonction pour récupérer les compteurs initiaux
    async function fetchInitialCounts() {
        try {
            const responseLike = await fetch('video.php?action=fetchLikeCount');
            const responseDislike = await fetch('video.php?action=fetchDislikeCount');

            // const initialLikeCount = await responseLike.text();
            // const initialDislikeCount = await responseDislike.text();
            const initialLikeCount = await responseLike.json(); // Modifié pour analyser le JSON
            const initialDislikeCount = await responseDislike.json(); // Modifié pour analyser le JSON

            // Affiche le nombre formaté
            // Affiche seulement le nombre sans le texte "Likes" ou "Dislikes"
            likeCountDisplay.text(formatCount(initialLikeCount.like_count));
            dislikeCountDisplay.text(formatCount(initialDislikeCount.dislike_count));


            /* OR const initialLikeCount = parseInt(await responseLike.text()); // Parse le texte en nombre entier
            const initialDislikeCount = parseInt(await responseDislike.text()); // Parse le texte en nombre entier
            likeCountDisplay.text(initialLikeCount); // Affiche le nombre de likes
            dislikeCountDisplay.text(initialDislikeCount); // Affiche le nombre de dislikes
            */
        } catch (error) {
            console.error('Error fetching initial counts:', error);
        }
    }

    // Fonction pour incrémenter le compteur
    async function incrementCount(action) {
        try {
            const response = await fetch('video.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    action: action
                })
            });

            // const updatedCount = await response.text();
            const updatedCount = await response.json(); // Utilise response.json() pour traiter la réponse comme JSON

            // OR const updatedCount = parseInt(await response.text()); // Parse le texte en nombre entier

            if (action === 'like') {
                // likeCountDisplay.text(`${updatedCount} Likes`);
                likeCountDisplay.text(formatCount(updatedCount.like_count));
                // Affiche une émoticône (par exemple, un cœur) à côté du bouton like
                // likeButton.after('<span class="like-emoji">❤️</span>');
                const emojiSpan = $('<span>❤️</span>');
                likeButton.after(emojiSpan);
                // Supprime l'émoticône après 5 secondes
                setTimeout(() => {
                    // $('.like-emoji').remove(); // Supprime l'élément avec la classe like-emoji
                    emojiSpan.remove(); // Supprime l'élément après 5 secondes
                }, 5000); // 5000 millisecondes (5 secondes)
            } else if (action === 'dislike') {
                // dislikeCountDisplay.text(`${updatedCount} Dislikes`);
                dislikeCountDisplay.text(formatCount(updatedCount.dislike_count));
            }
        } catch (error) {
            console.error(`Error incrementing ${action} count:`, error);
        }
    }

    // Appel de la fonction pour récupérer les compteurs initiaux au chargement de la page
    fetchInitialCounts();

    // Ajout des écouteurs d'événements aux boutons
    likeButton.on('click', () => {
        incrementCount('like');
    });

    dislikeButton.on('click', () => {
        incrementCount('dislike');
    });

    // Exemple de requête AJAX pour récupérer le nombre de likes

});

/* =============================== like and dislike js starts =============================== */

/*$(window).on('load', async function() {
    const likeCountDisplay = $('.like-count');
    const dislikeCountDisplay = $('.dislike-count');
    const likeButton = $('.like-button');
    const dislikeButton = $('.dislike-button');

    async function fetchInitialCounts() {
        try {
            const responseLike = await fetch('video.php?action=fetchLikeCount');
            const responseDislike = await fetch('video.php?action=fetchDislikeCount');

            const initialLikeCount = await responseLike.text();
            const initialDislikeCount = await responseDislike.text();

            likeCountDisplay.text(`${initialLikeCount} Likes`);
            dislikeCountDisplay.text(`${initialDislikeCount} Dislikes`);
        } catch (error) {
            console.error('Error fetching initial counts:', error);
        }
    }

    async function incrementCount(action) {
        try {
            const response = await fetch('video.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    action: action
                })
            });

            const updatedCount = await response.text();

            if (action === 'like') {
                likeCountDisplay.text(`${updatedCount} Likes`);
            } else if (action === 'dislike') {
                dislikeCountDisplay.text(`${updatedCount} Dislikes`);
            }
        } catch (error) {
            console.error(`Error incrementing ${action} count:`, error);
        }
    }

    await fetchInitialCounts();

    likeButton.click(function() {
        incrementCount('like');
    });

    dislikeButton.click(function() {
        incrementCount('dislike');
    });
});*/

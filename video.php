<?php
    // Reporting error
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    // Include database connection like_counter_bd
    include './connect/connection_video.php';

    // Include database connection video_db
    include './connect/connect.php';

    // Fetch video paths from the database
    try {
        // Select all videos from the database
        $sql = "SELECT video_name, video_path FROM videos";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $videos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage() . "<br>";
    }

    // Display videos
    if (!empty($videos)) {

        foreach ($videos as $video) {
            // echo "<div class='thumbnail' onclick=\"loadVideo('{$video['video_path']}')\">";
            // echo "<img src='thumbnail.jpg' alt='{$video['video_name']}'>";
            // echo "<span>{$video['video_name']}</span>";
            // echo "</div>";
        }
    } else {
        echo "No videos found.";
    }

    /* ====================================== section add comments php starts ====================================== */
   
    // Function to handle comment submission
    function handleCommentSubmission($conn_comments) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['comment'])) {
            $comment = $_POST['comment'];
            try {
                $stmt = $conn_comments->prepare("INSERT INTO user_comments (comment) VALUES (:comment)");
                $stmt->bindParam(':comment', $comment, PDO::PARAM_STR);
                $stmt->execute();
                echo "Comment submitted successfully!";
                echo json_encode(['message' => 'Comment submitted successfully!', 'total_comments' => $totalComments]);
            } catch (PDOException $e) {
            echo "Error submitting comment: " . $e->getMessage();
            }
        }
    }

    // Function to retrieve comments
    function retrieveComments($conn_comments) {
        try {
            $stmt = $conn_comments->query("SELECT * FROM user_comments ORDER BY created_at DESC");
            $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $comments;
        } catch (PDOException $e) {
            echo "Error fetching comments: " . $e->getMessage();
            return [];
        }
    }

    // Handle comment submission or retrieve comments based on action
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'submit_comment') {
        handleCommentSubmission($conn_comments);
        exit; // Stop further execution
    }
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
        header('Content-Type: application/json');
        echo json_encode(retrieveComments($conn_comments));
        exit;
    }


    // Fetch comments for initial display
    $comments = retrieveComments($conn_comments);

    /* ====================================== section add comments php starts ====================================== */

    /* ====================================== like and dislike php starts ====================================== */

    // Function to fetch the current like count from the database
function fetchLikeCount($conn_comments) {
    $sql = "SELECT like_count FROM like_counter WHERE id = 1";
    $stmt = $conn_comments->query($sql);
    // $row = $stmt->fetch();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ? $row['like_count'] : 0;
}

// Function to fetch the current dislike count from the database
function fetchDislikeCount($conn_comments) {
    $sql = "SELECT dislike_count FROM dislike_counter WHERE id = 1";
    $stmt = $conn_comments->query($sql);
    // $row = $stmt->fetch();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ? $row['dislike_count'] : 0;
}

// Check if a GET request is received to fetch initial counts
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])) {
    if ($_GET['action'] === 'fetchLikeCount') {
        header('Content-Type: application/json');
        echo json_encode(['like_count' => fetchLikeCount($conn_comments)]);
        exit; // Arrête l'exécution après l'envoi de la réponse JSON
    } elseif ($_GET['action'] === 'fetchDislikeCount') {
        header('Content-Type: application/json');
        echo json_encode(['dislike_count' => fetchDislikeCount($conn_comments)]);
        exit; // Arrête l'exécution après l'envoi de la réponse JSON
    }
}

// Check if a POST request is received to increment the count
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'like') {
        $sql = "UPDATE like_counter SET like_count = like_count + 1 WHERE id = 1";
        $stmt = $conn_comments->prepare($sql);
        $stmt->execute();
        header('Content-Type: application/json');
        echo json_encode(['like_count' => fetchLikeCount($conn_comments)]);
        exit; // Arrête l'exécution après l'envoi de la réponse JSON
    } elseif ($_POST['action'] === 'dislike') {
        $sql = "UPDATE dislike_counter SET dislike_count = dislike_count + 1 WHERE id = 1";
        $stmt = $conn_comments->prepare($sql);
        $stmt->execute();
        header('Content-Type: application/json');
        echo json_encode(['dislike_count' => fetchDislikeCount($conn_comments)]);
        exit; // Arrête l'exécution après l'envoi de la réponse JSON
    }
}


// Check if a GET request is received to fetch initial counts
/*if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])) {
    if ($_GET['action'] === 'fetchLikeCount') {
        echo fetchLikeCount($conn_comments);
    } elseif ($_GET['action'] === 'fetchDislikeCount') {
        echo fetchDislikeCount($conn_comments);
    }
}

// Check if a POST request is received to increment the count
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'like') {
        $sql = "UPDATE like_counter SET like_count = like_count + 1 WHERE id = 1";
        $stmt = $conn_comments->prepare($sql);
        $stmt->execute();
        echo fetchLikeCount($conn_comments); // Output the updated like count
    } elseif ($_POST['action'] === 'dislike') {
        $sql = "UPDATE dislike_counter SET dislike_count = dislike_count + 1 WHERE id = 1";
        $stmt = $conn_comments->prepare($sql);
        $stmt->execute();
        echo fetchDislikeCount($conn_comments); // Output the updated dislike count
    }
}
*/


    /* ====================================== like and dislike php ends ====================================== */
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Player</title>

    <!-- Link to google fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Serif:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&display=swap" rel="stylesheet">

    <!-- Add icon library -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <!-- Link to css file -->
    <link rel="stylesheet" href="css/video.css">

</head>
<body>
    <!-- ********************************* Header section starts ********************************* -->
    <section class="header">

        <div class="left-section">
            <img src="image/hamburger-menu.svg" class="hamburger-menu">
            <img src="image/youtube-logo.svg" class="youtube-logo">
            <img src="image/arrowback.svg" class="arrowback">
            
        </div>

        <div class="midle-section">

            <input type="text" placeholder="Search" class="search-bar"> 

            <button class="search-button">

                <img src="image/search.svg" class="searc-icon">
                <div class="tooltip">Search</div>

            </button>

            <button class="voice-button">
                <img src="image/voice-search-icon.svg" class="voice-search-icon">
                <div class="tooltip">Search width your voice</div>
            </button>

        </div>

        <div class="right-section"> 

            <div class="upload-icon-container">
                <img src="image/upload.svg" class="upload-icon">
                <div class="tooltip">Create</div>
            </div>
            
            <div class="youtube-apps-icon-container">
                <img src="image/youtube-apps.svg" class="youtube-apps-icon">
                <div class="tooltip">Youtube apps</div>
            </div>

            <div class="notification-container">
                <div class="notifications-icon-container">
                    <img src="image/notifications.svg" class="notifications-icon">
                    <div class="notification-count">3</div>
                </div>

                <div class="tooltip">Notifications</div>
            </div>

            <img src="image/user.svg" class="my-channel-icon">
        </div>
        
    </section>

    <!-- ********************************* Header section ends ********************************* -->

    <!-- ********************************* sidebar section starts ********************************* -->
    <div class="subSidebar">
        <div class="youtube">
            <img src="image/hamburger-menu.svg" class="menu">
            <img src="image/youtube-logo.svg" class="youtube-logo">

            <div class="closeBtn">
                <img src="image/cross.png" alt="Close button">
            </div>
        </div>
    </div>
    <div class="sidebar">
        <div class="sous">

            <div class="sidebar-link">
                <img src="image/home.svg">
                <a class="icon-title" href="index.html">Home</a>
            </div>

            <div class="sidebar-link">
                <img src="image/explore.svg">
                <a class="icon-title">Explore</a>
            </div>

            <div class="sidebar-link">
                <img src="image/subscriptions.svg">
                <a class="icon-title">subscriptions</a>
            </div>

            <div class="sidebar-link">
                <img src="image/originals.svg">
                <a class="icon-title">Originals</a>
            </div>

            <div class="sidebar-link">
                <img src="image/youtube-music.svg">
                <a class="icon-title">youtube music</a>
            </div>

            <div class="sidebar-link">
                <img src="image/library.svg">
                <a class="icon-title">Library</a>
            </div>

        </div>

        <div><hr></div>

        <div class="subcribe-list">
            <h3>SUBSCRIBED</h3>
            <div class="sidebar-link">
                <img src="image/unnamed.jpg">
                <a class="icon-title">Ahmed Moussa</a>
            </div>

            <div class="sidebar-link">
                <img src="image/aSim.jpg">
                <a class="icon-title">Soko Pierre</a>
            </div>
        </div>
    
    </div>

    <!-- ********************************* sidebar section ends ********************************* -->

    <!-- ********************************* container section starts ********************************* -->

    <div class="container play-container">

        <div class="row">
            <div class="play-video">
                <!-- Video Player -->
                <video id="main-video" controls autoplay>
                    <source id="video-source" src="video/video.mp4" type="video/mp4">
                </video>

                <div class="play-video-title"></div>

                <div class="">
                    <a href="#">#Coding</a> <a href="#">#HTML</a> <a href="#">#CSS</a>
                    <a id="download-button" href="" download><i class="fa fa-download"></i>Download</a>
                    <!-- <button id="download-button" href="" download><i class="fa fa-download"></i>Download</button> -->
                </div>
               
                <div class="play-video-info">
                    <p class="time-ago"><span class="views"></span> &bull; <span class="days"></span></p>
                    <div class="save">
                        <a>
                            <img src="image/like.png" class="like-button">
                            <span class="like-count"></span>
                        </a>

                        <a>
                            <img src="image/thumb-down-button.png" class="dislike-button">
                            <span class="dislike-count"></span>
                        </a>

                        <a href=""><img src="image/share.png">Share</a>
                        <a href=""><img src="image/folder.png">Save</a>
                    </div>
                </div>

                <hr>

                <div class="pusblisher">
                    <img src="image/subscribers4.svg">
                    <div>
                        <p>Easy Tutorials</p>
                        <span>500k Suscribers</span>
                    </div>
                    <button type="button">Suscribe</button>
                </div>

                <div class="vid-description">

                    <div class="comments-numbers" id="commentsNumber">0 comments</div>

                    <div class="add-comment">
                        <img src="image/subscriber3.svg">
                        <textarea placeholder="Write comments..." id="input"></textarea>
                        <button type="button" id="submit">Submit</button>
                        <button type="button" id="cancel-comment">Cancel</button>
                    </div>
                    <div class="comment-section" id="commentSection">
                        <?php foreach ($comments as $comment): ?>
                            <p> <?php echo htmlspecialchars($comment['comment']); ?></p>
                        <?php endforeach; ?>
                    </div>
                    
                </div>

            </div>

            <div class="right-sidebar">

                <div class="side-video-list">
                                    
                    <div class="small-thimbmail" onclick="loadAndPlayVideo(0, this)" data-title="Lord, I Need You">
                        <img src="image/needYou.webp" alt="Video 1">
                    </div>

                    <div class="vid-info">
                        <a href="">Matt Maher - Lord, I Need You</a>
                        <p>Block Music</p>
                        <p>18 M views &#183; 7 years ago</p>
                    </div>

                </div>

                <div class="side-video-list">

                    <div class="small-thimbmail" onclick="loadAndPlayVideo(1, this)" data-title="Avenir Sim, Anti">
                        <img src="image/avenirSim.webp" alt="Video 1">
                    </div>

                    <div class="vid-info">
                        <a href="">Avenir Sim Tebegue A Nti Vidéo officielle</a>
                        <p>Easy Tutorials</p>
                        <p>785 views &#183; 7 years ago</p>
                    </div>

                </div>

                <div class="side-video-list">

                    <div class="small-thimbmail" onclick="loadAndPlayVideo(2, this)">
                        <img src="image/lmtvSuccess.webp" alt="Video 1">
                    </div>

                    <div class="vid-info">
                        <a href="">LE CULTE EN DIRECT - La clé de tout succès </a>
                        <p>Success key</p>
                        <p>2,4 views &#183; 6 days ago</p>
                    </div>

                </div>

            </div>
        </div>
    </div>
    <!-- ********************************* container section ends ********************************* -->

    
</div>

    <!-- Include jQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <!-- Include your custom JavaScript file -->
    <script src="scripts/video_scripts.js"></script>   

    <!-- <script src="scripts/like-script.js"></script> -->

</body>
</html>

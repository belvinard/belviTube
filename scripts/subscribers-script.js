const subscriberCountDisplay = document.querySelector('.subscribers-numbers');
const subscribersButton = document.querySelector('.subscribers-button');

// Function to format subscriber count
function formatSubscriberCount(count) {
    if (count >= 1000) {
        return (count / 1000) + 'k';
    } else {
        return count.toString();
    }
}

async function fetchInitialSubscriberCounts() {
    try {
        const responseSubscriber = await fetch('connect/connect_subscriber_db.php?action=fetchSubscribersCount');

        // Parse the JSON response to extract the subscriber count
        const data = await responseSubscriber.json();
        const initialSubscriberCount = data.subscriber_count;

        // Update the HTML element to display the subscriber count
        // subscriberCountDisplay.textContent = `${initialSubscriberCount} Subscribers`;
        subscriberCountDisplay.textContent = `${formatSubscriberCount(initialSubscriberCount)} Subscribers`;
    } catch (error) {
        console.error('Error fetching initial counts:', error);
    }
}

async function incrementSubscriberCount(action) {
    try {
        const response = await fetch('connect/connect_subscriber_db.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                action: action
            })
        });

        // Parse the JSON response to extract the updated subscriber count
        const data = await response.json();
        const updatedSubscriberCount = data.subscriber_count;

        // Update the HTML element to display the updated subscriber count
        subscriberCountDisplay.textContent = `${formatSubscriberCount(updatedSubscriberCount)} Subscribers`;
        subscriberCountDisplay.style.color = "white";
    } catch (error) {
        console.error(`Error incrementing ${action} count:`, error);
    }
}


window.onload = async () => {
    await fetchInitialSubscriberCounts();

    subscribersButton.addEventListener('click', () => {
        incrementSubscriberCount('subscriber');
    });
};

document.querySelector('.subscribers-button').style.color = "red";
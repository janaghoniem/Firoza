document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.accept-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const requestId = button.getAttribute('data-id');
            const response = await fetch(`admin/requests/accept/${requestId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(),
            });
            if (response.ok) {
                console.log('Request accepted successfully');
                alert('Request accepted successfully');
                location.reload(); // Reload the page to see the changes
            } else {
                console.error('Error accepting request:', error);
                alert('Error accepting request');
            }
        });
    });

    document.querySelectorAll('.reject-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const requestId = button.getAttribute('data-id');
            const response = await fetch(`admin/requests/reject/${requestId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(),
            });
            if (response.ok) {
                console.log('Request rejected successfully');
                alert('Request rejected successfully');
                location.reload(); // Reload the page to see the changes
            } else {
                console.error('Error rejecting request:', error);
                alert('Error rejecting request');
            }
        });
    });
});
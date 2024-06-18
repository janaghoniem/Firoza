
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.accept-btn').forEach(button => {
        button.addEventListener('click', async () => {
          const requestId = button.getAttribute('data-id');
          await fetch(`/requests/accept/${requestId}`, {
            method: 'POST'
          });
          location.reload(); // Reload the page to see the changes
        });
      });

      document.querySelectorAll('.reject-btn').forEach(button => {
        button.addEventListener('click', async () => {
          const requestId = button.getAttribute('data-id');
          await fetch(`/requests/reject/${requestId}`, {
            method: 'POST'
          });
          location.reload(); // Reload the page to see the changes
        });
      });
    });

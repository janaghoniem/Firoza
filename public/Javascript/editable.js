document.addEventListener('DOMContentLoaded', () => {
    const editButtons = document.querySelectorAll('.edit-btn');
    const editableElements = document.querySelectorAll('.editable');

    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const button = event.target;
            const row = button.closest('tr');
            const isEditing = button.textContent === 'Save';

            row.querySelectorAll('.editable').forEach(element => {
                element.contentEditable = !isEditing;
                element.style.border = isEditing ? 'none' : '1px solid #ccc'; // Optional: Visual cue
            });

            button.textContent = isEditing ? 'Edit' : 'Save';

            if (isEditing) {
                const editedData = Array.from(row.querySelectorAll('.editable')).map(el => el.textContent.trim());
                console.log('Edited Data:', editedData);

                // Example: Send the edited data to the server
                fetch('/save-edits', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data: editedData }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            }
        });
    });
});

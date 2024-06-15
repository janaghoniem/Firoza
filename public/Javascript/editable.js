// document.addEventListener('DOMContentLoaded', () => {
//     const editButtons = document.querySelectorAll('.edit-btn');
//     const editableElements = document.querySelectorAll('.editable');

//     editButtons.forEach(button => {
//         button.addEventListener('click', (event) => {
//             const button = event.target;
//             const row = button.closest('tr');
//             const isEditing = button.textContent === 'Save';

//             row.querySelectorAll('.editable').forEach(element => {
//                 element.contentEditable = !isEditing;
//                 element.style.border = isEditing ? 'none' : '1px solid #ccc'; // Optional: Visual cue
//             });

//             button.textContent = isEditing ? 'Edit' : 'Save';

//             if (isEditing) {
//                 const editedData = Array.from(row.querySelectorAll('.editable')).map(el => el.textContent.trim());
//                 console.log('Edited Data:', editedData);

              
//                 fetch('/EditCollection', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ data: editedData }),
//                 })
//                 .then(response => response.json())
//                 .then(data => {
//                     console.log('Success:', data);
//                 })
//                 .catch((error) => {
//                     console.error('Error:', error);
//                 });
//             }
//         });
//     });
// });




document.addEventListener('DOMContentLoaded', () => {
    const editButtons = document.querySelectorAll('.edit-btn');

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
                const id = row.querySelector('.editable[data-id]').dataset.id;
                const collectionName = row.querySelector('.editable[data-field="Collection_Name"]').textContent.trim();
                const description = row.querySelector('.editable[data-field="Collection_Description"]').textContent.trim();
                const launchDate = row.querySelector('.editable[data-field="Date"]').textContent.trim();

                // Send the edited data to the server
                fetch('/EditCollection', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id,
                        collectionName,
                        description,
                        launchDate
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Success:', data);
                        alert('Collection updated successfully');
                    } else {
                        console.error('Failed to update collection');
                        alert('Failed to update collection');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('Error updating collection');
                });
            }
        });
    });
});


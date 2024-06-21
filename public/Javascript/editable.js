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
    //const editButtons = document.querySelectorAll('.edit-btn');
   
    const editForm = document.getElementById('editForm');
            const collectionId = '<%= collectionId %>'; // Pass the collection ID from the server to the client
            document.getElementById('collectionId').value = collectionId;

            editForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const formData = new FormData(editForm);
                formData.append('collectionId', collectionId);

                // Ensure the collection name contains only letters
                const collectionName = formData.get('CollectionName');
                const nameRegex = /^[A-Za-z\s]+$/;
                if (!nameRegex.test(collectionName)) {
                    alert('Collection name must contain only letters.');
                    return;
                }

                try {
                    // Validate that the collection name is unique
                    const validateResponse = await fetch(`/editCollection/validateCollectionName`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ collectionName, collectionId }),
                    });
                    const validateResult = await validateResponse.json();

                    if (!validateResult.isUnique) {
                        alert('Collection name already exists. Please choose another name.');
                        return;
                    }

                    const response = await fetch(`/admin/editCollection/${collectionId}`, {
                        method: 'POST',
                        body: formData,
                    });

                    const result = await response.json();
                    if (result.success) {
                        alert('Collection updated successfully');
                        location.reload();
                    } else {
                        alert('Failed to update collection: ' + result.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error updating collection');
                }
            });
  
const deleteButtons = document.querySelectorAll('.delete-btn');
console.log("da5al gowa el client");
    deleteButtons.forEach(button => {
        console.log(deleteButtons);
        button.addEventListener('click', (event) => {
            const button = event.target;
            const id = button.dataset.id;
            console.log(id);
            const confirmed = confirm('Are you sure you want to delete this collection?');
            if (!confirmed) {
                return;
            }

            fetch(`/admin/deleteCollection/${id}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                  
                        console.log('collection deleted successfully');
                        alert('Collection deleted successfully');
                        location.reload();
                   
                        // console.error('Failed to delete collection');
                        // alert('Failed to delete collection');
                    
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('Error deleting collection');
                });
        });
    });
});

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
    // const editButtons = document.querySelectorAll('.edit-btn');
    // const deleteButtons = document.querySelectorAll('.delete-btn');
    // console.log("JavaScript Loaded");

    // editButtons.forEach(button => {
    //     button.addEventListener('click', (event) => {
    //         console.log("Edit button clicked");
    //         const button = event.target;
    //         const row = button.closest('tr');
    //         const isEditing = button.textContent === 'Save';

    //         row.querySelectorAll('.editable').forEach(element => {
    //             element.contentEditable = !isEditing;
    //             element.style.border = isEditing ? 'none' : '1px solid #ccc';
    //         });

    //         button.textContent = isEditing ? 'Edit' : 'Save';
    //         console.log("Toggled edit mode");

    //         if (isEditing) {
    //             const id = button.dataset.id;
    //             const collectionName = row.querySelector('.editable[data-field="Collection_Name"]').textContent.trim();
    //             const description = row.querySelector('.editable[data-field="Collection_Description"]').textContent.trim();
    //             console.log(`Updating collection: ${id}, ${collectionName}, ${description}`);

    //             fetch(`/admin/editCollection/${id}`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({ collectionName, description }),
    //             })
    //             .then(response => response.json())
    //             .then(data => {
    //                 if (data.success) {
    //                     console.log('Success:', data);
    //                     alert('Collection updated successfully');
    //                 } else {
    //                     console.error('Failed to update collection');
    //                     alert('Failed to update collection');
    //                 }
    //                 button.disabled = false;
    //             })
    //             .catch((error) => {
    //                 console.error('Error:', error);
    //                 alert('Error updating ');
    //                 button.disabled = false;
    //             });
    //         }
    //     });
    // });


    const editForm = document.getElementById('editForm');

    editForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(editForm);
      const collectionId = editForm.action.split('/').pop();
  
      fetch(`/admin/editCollection/${collectionId}`, {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Collection updated successfully');
        } else {
          alert('Failed to update collection');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error updating collection');
      });
    });
  
    deleteButtons.forEach(button => {
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

$(function () {

  $('.js-check-all').on('click', function () {

    if ($(this).prop('checked')) {
      $('.control--checkbox input[type="checkbox"]').each(function () {
        $(this).prop('checked', true);
      })
    } else {
      $('.control--checkbox input[type="checkbox"]').each(function () {
        $(this).prop('checked', false);
      })
    }

  });

  $('.js-ios-switch-all').on('click', function () {

    if ($(this).prop('checked')) {
      $('.ios-switch input[type="checkbox"]').each(function () {
        $(this).prop('checked', true);
        $(this).closest('tr').addClass('active');
      })
    } else {
      $('.ios-switch input[type="checkbox"]').each(function () {
        $(this).prop('checked', false);
        $(this).closest('tr').removeClass('active');
      })
    }

  });



  $('.ios-switch input[type="checkbox"]').on('click', function () {
    if ($(this).closest('tr').hasClass('active')) {
      $(this).closest('tr').removeClass('active');
    } else {
      $(this).closest('tr').addClass('active');
    }
  });

  
  $(document).ready(function () {
    console.log("Document ready function fired."); // Check if this log is appearing
  
    $('.delete-btn').on('click', function () {
      console.log("Delete button clicked."); // Check if this log is appearing
  
      const collectionId = $(this).data('id');
      console.log("Collection ID to delete:", collectionId);
  
      // Show confirmation dialog
      const confirmed = confirm('Are you sure you want to delete this collection?');
      if (!confirmed) {
        return;
      }
  
      // Send DELETE request to the server
      $.ajax({
        url: `/admin/EditLayout/${collectionId}`,
        type: 'DELETE',
        success: function (response) {
          console.log("Delete request successful."); // Check if this log is appearing
          alert('Collection deleted successfully');
          location.reload(); // Reload the page to update the table or list
        },
        error: function (xhr, status, error) {
          console.error('Error deleting collection:', error); // Check if this log is appearing
          alert('Error: ' + xhr.responseJSON.error);
        }
      });
    });
  });
  

});



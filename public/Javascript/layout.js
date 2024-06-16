document.addEventListener('DOMContentLoaded', function() {
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
   // Event handler for delete button click
   $('.delete-btn').on('click', function() {
    const collectionId = $(this).data('id'); // Assuming data-id is set to <%= collection._id %>

    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to delete this collection?');
    if (!confirmed) {
        return;
    }

    // Send DELETE request to the server
    $.ajax({
        url: `/admin/collections/${collectionId}`,
        type: 'DELETE',
        success: function(response) {
            alert('Collection deleted successfully');
            location.reload(); // Reload the page to update the table or list
        },
        error: function(xhr, status, error) {
            alert('Error: ' + xhr.responseJSON.error);
        }
    });
});
});



});
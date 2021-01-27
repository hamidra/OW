$(function () {
  $('#pip-video-w8')[0].volume = 0.3;
  if (screen.width <= 699) {
    $('#notsupportedDevice').modal();
  }
  $('.btn-play-pip').on('click', async function () {
    playVideo($(this));
  });
  $('.window-video').on('click', async function () {
    var id = $(this).attr('id').split('pip-video-')[1];
    var button = $('#' + id + '.btn-play-pip');
    playVideo(button);
  });
  $('.btn-mute-pip').on('click', async function () {
    $('.btn-mute-pip').each(function () {
      unmuteButton($(this));
    });
    var button = $(this);
    var videoElementId = 'pip-video-' + button.attr('id');
    var videoElement = document.getElementById(videoElementId);
    if (videoElement.muted) {
      videoElement.muted = false;
      unmuteButton(button);
    } else {
      videoElement.muted = true;
      muteButton(button);
    }
  });

  $('.window-video').each(function () {
    $(this).on('pause', function () {
      var id = $(this).attr('id').split('pip-video-')[1];
      id && resetControls(id);
    });
  });

  $('.window-video').each(function () {
    $(this).on('play', function () {
      var id = $(this).attr('id').split('pip-video-')[1];
      id && showControls(id);
    });
  });

  $('.btn-stop-pip').on('click', async function () {
    var button = $(this);
    var videoElementId = 'pip-video-' + button.attr('id');
    var videoElement = document.getElementById(videoElementId);
    videoElement.pause();
  });

  function pauseAllVideos() {
    $('[id*=pip-video-]').each(function () {
      $(this)[0].pause();
      $(this)[0].currentTime = 0;
    });
  }

  function unmuteAllVideos() {
    $('[id*=pip-video-]').each(function () {
      $(this)[0].muted = false;
    });
  }

  function unmuteButton(button) {
    button.html('MUTE 🔈');
    button.removeClass('active');
  }

  function muteButton(button) {
    button.html('UNMUTE 🔇');
    button.addClass('active');
  }

  function playVideo(button) {
    if (screen.width <= 699) {
      $('#notsupportedDevice').modal();
      return;
    }
    // set all buttons to unmute
    $('.btn-mute-pip').each(function () {
      unmuteButton($(this));
      if ($(this).attr('id') !== button.attr('id')) {
        $(this).addClass('d-none');
        $(this).removeClass('d-block');
      } else {
        $(this).removeClass('d-none');
        $(this).addClass('d-block');
      }
    });
    unmuteAllVideos();
    pauseAllVideos();
    var videoElementId = 'pip-video-' + button.attr('id');
    var videoElement = document.getElementById(videoElementId);
    try {
      if (document.pictureInPictureEnabled) {
        videoElement.requestPictureInPicture();
      } else if (
        videoElement.webkitSupportsPresentationMode &&
        typeof videoElement.webkitSetPresentationMode === 'function'
      ) {
        videoElement.webkitSetPresentationMode(
          videoElement.webkitPresentationMode === 'picture-in-picture'
            ? 'inline'
            : 'picture-in-picture'
        );
      } else {
        //alert('Picture in picture is not supported!');
        $('#notsupportedModal').modal();
        return;
      }
      videoElement.play();
      // show stop botton
      $('.btn-stop-pip').each(function () {
        if ($(this).attr('id') !== button.attr('id')) {
          $(this).addClass('d-none');
          $(this).removeClass('d-block');
        } else {
          $(this).removeClass('d-none');
          $(this).addClass('d-block');
        }
      });
    } catch (error) {
      // TODO: Show error message to user.
      console.log(error);
    }
  }

  function resetControls(id) {
    unmuteButton($('#' + id + '.btn-mute-pip'));
    $('#' + id + '.btn-mute-pip').addClass('d-none');
    $('#' + id + '.btn-mute-pip').removeClass('d-block');

    $('#' + id + '.btn-stop-pip').addClass('d-none');
    $('#' + id + '.btn-stop-pip').removeClass('d-block');
  }

  function showControls(id) {
    $('#' + id + '.btn-mute-pip').removeClass('d-none');
    $('#' + id + '.btn-mute-pip').addClass('d-block');

    $('#' + id + '.btn-stop-pip').removeClass('d-none');
    $('#' + id + '.btn-stop-pip').addClass('d-block');
  }
});

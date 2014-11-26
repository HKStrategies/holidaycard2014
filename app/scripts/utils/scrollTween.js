define(['jquery','utils/windowWatch'], function ( $, WW ) {

  var tweens = $('[tween-element]');

  if ( WW.screenSize != 'xs' ) {
    $(document).on('scroll.tween', function () {
      requestAnimationFrame( onScroll )
    }).scroll();
  }

  $(document).on('screenSizeChanged', function ( e ) {

    if ( e.screenSize != 'xs' ) {
      $(document).on('scroll.tween', function () {
        requestAnimationFrame( onScroll );
      }).scroll();
    }

    else {
      $(document).off('scroll.tween');
    }
  });

  function onScroll () {
    $.each( tweens, function ( index, element ) {
      var $element = $( element );
      var start    = $element.data('start');
      var end      = $element.data('end');
      var p        = ( WW.scrollTop + WW.height - start ) / ( end - start )

      if ( p < 0 ) p = 0;
      if ( p > 1 ) p = 1;

      $element.data('tween').progress( p ).pause();
    });
  }
});
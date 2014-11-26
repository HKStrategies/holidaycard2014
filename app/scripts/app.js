define(['jquery','utils/windowWatch'],
  function( $, WW ) {

    $(document).on('click','#toggle-snow',function(e){
      if ( $(':input[name=snow]:checked').val() == 1 )
        $('#snow-container').addClass('animate');
      else
        $('#snow-container').removeClass('animate');
    });

    $('[tween-container]').each( function ( index, container ) {
      var $container = $( container );
      var offsetTop  = $container.offset().top;
      var total      = $container.height() + WW.height;

      $container.find('[tween-element]').each( function ( index, element ) {
        var $element = $( element );
        var vars     = {};

        try {
          vars.css = JSON.parse( $element.attr('tween-css') );
        } catch (e) { console.log( e ); }

        try {
          vars.ease = $element.attr('tween-easing');
        } catch (e) { console.log( e ); }

        var tween = TweenLite[ $element.attr('tween-method') || 'from' ]( element, 1, vars );

        $element.data('tween', tween );
        $element.data('start', offsetTop + total * parseFloat( $element.attr('tween-start') || 0 ) );
        $element.data('end',   offsetTop + total * parseFloat( $element.attr('tween-end') || 1 ) );
      });
    });

    return 'App is running';

  }
);
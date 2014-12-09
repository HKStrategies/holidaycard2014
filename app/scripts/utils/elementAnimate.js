define(['jquery','utils/windowWatch','utils/stripJsonComments','TweenMax'],
  function ( $, WW, stripJsonComments ) {

    $('[animate-element]').each( function ( index, element ) {
      var $element = $( element );
      var $script  = getAnimationScript( $element );
      var cfgs;

      if ( $script.size() != 1 )
        return; // exit

      try {
        cfgs = JSON.parse(stripJsonComments($script.html()));
        if ( ! $.isArray( cfgs ) )
          cfgs = [ cfgs ];
      } catch (e) {
        console.log( e );
      }

      if ( ! cfgs ) return; // exit

      var timeline = new TimelineMax();

      $.each( cfgs, function ( index, cfg ) {
        timeline[ cfg.method || 'to' ]( element, ( cfg.duration || 1 ), ( cfg.vars || {} ), cfg.delay );
      });

      if ( $element.attr('repeat') != undefined )
        timeline.repeat( -1 );

      if ( $element.attr('yoyo') != undefined )
        timeline.yoyo();

    });

    function getAnimationScript ( $element ) {
      var $script = $( $element.attr('tween-element') );

      if ( $script.size() == 0 )
        $script = $element.next('script[type="text/animation"]');

      return $script;
    }
  }
);
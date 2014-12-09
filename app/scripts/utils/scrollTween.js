define(['jquery','utils/windowWatch','utils/stripJsonComments','TweenMax'],
  function ( $, WW, stripJsonComments ) {

    $(document).on('screenSizeChanged', function ( e ) {

      tweenSetup();

      if ( e.screenSize != 'xs' ) {
        $(document)
          .off('scroll.tween')
          .on('scroll.tween', function () {
            requestAnimationFrame( onScroll );
          }).scroll()
        ;
      }

      else {
        $(document).off('scroll.tween');
      }

    }).trigger('screenSizeChanged');

    function tweenSetup () {

      $('[tween-container]').each( function ( index, container ) {
        var $container = $( container );

        // containers must be atleast the hight of the window
        if ( $container.height() < WW.height ) {
          $container.css('minHeight', WW.height );
          console.log('ScrollTween Warning: Containers must have a height equal or greater than the window\'s height.')
        }

        var offsetTop    = $container.offset().top;
        var scrollLength = $container.height() + Math.min( WW.height, offsetTop );

        // for bottom sections that land against the bottom
        var x = offsetTop + $container.height() - $('body').height();
        if ( x > WW.height * -1 )
          scrollLength -= WW.height + x;

        $container.data('offsetTop', offsetTop );
        $container.data('scrollLength', scrollLength );

        $container.find('[tween-element]').each( function ( index, element ) {
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
          var timelines = $container.data('timelines') || [];

          if ( $element.attr('repeat') != undefined )
            timeline.repeat( -1 );

          if ( $element.attr('yoyo') != undefined )
            timeline.yoyo();

          $.each( cfgs, function ( index, cfg ) {
            timeline[ cfg.method || 'to' ]( element, ( cfg.duration || 1 ), ( cfg.vars || {} ), cfg.delay );
          });

          timelines.push( timeline );
          $container.data('timelines', timelines );
        });
      });
    }

    function onScroll () {
      $('[tween-container]').each( function ( index, container ) {
        var $container = $( container );
        var timelines  = $container.data('timelines');

        if ( ! timelines ) return; // exit

        var offsetTop  = $container.data('offsetTop');
        var duration   = $container.data('scrollLength');
        var position   = WW.scrollTop + Math.min( offsetTop, WW.height ) - offsetTop;
        var progress   = position / duration;

        if ( progress < 0 ) return false; // exit;

        progress = Math.min(Math.max(progress,0),1);

        $.each( timelines, function ( index, timeline ) {
          timeline.progress( progress ).pause();
        });
      });
    }

    function getAnimationScript ( $element ) {
      var $script = $( $element.attr('tween-element') );

      if ( $script.size() == 0 )
        $script = $element.next('script[type="text/animation"]');

      return $script;
    }

  }
);
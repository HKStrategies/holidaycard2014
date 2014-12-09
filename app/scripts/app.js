define(['jquery','utils/windowWatch','TweenMax'],
  function( $, WW ) {

    // scroll to functionality
    $(document).on('click','[scroll-to]', function(e){
      e.preventDefault();
      var $target = $($(e.currentTarget).attr('scroll-to'))
      var offset = parseInt( $target.attr('scroll-to-offset'), 10 );

      $('html,body').animate({
        'scrollTop': $target.offset().top + ( isNaN( offset ) ? 0 : offset )
      }, 1500 );
    });

    // balloon carousel
    $(document).on('click','.carousel-controls button', function ( e ) {
      var $target = $( $( e.currentTarget).attr('target') );

      if ( TweenMax.isTweening( $target ) ) return; // exit

      var marginTop = parseInt( $target.css('marginTop'), 10 );
      var imgHeight = $target.find('img').height();
      var direction = $( e.currentTarget ).attr('rel');

      var maxOffset = $target.height() * -1 + imgHeight;
      var minOffset = imgHeight * -1;
      var operation;

      if ( direction == 'prev' && marginTop <= minOffset )
        operation = '+=';
      else if ( direction == 'next' && marginTop > maxOffset )
        operation = '-=';

      TweenMax.to( $target, .5, { "marginTop": operation + imgHeight });
    });

    // page navigation
    var $pageNavigation = $('#page-navigation');
    $('.page').each( function ( index, page ) {
      var $page   = $( page );
      var id      = $page.attr('id');

      var $anchor = $('<a href="#' + id + '" scroll-to="#' + id + '" class="' + id + '"></a>');

      if ( index == 0 )
        $anchor.addClass('active');

      if ( id == 'intro' )
        $anchor.attr('scroll-to-offset', -200 );

      $pageNavigation.append( $anchor );
    });

    $pageNavigation.on('click','a', function (e) {
      $pageNavigation.find('a.active').removeClass('active');
      $( e.currentTarget ).addClass('active');
    });

    // page navigation scroll
    var $currentPage = $();
    var $pages = $('section.page');
    $( document ).on('scroll', function () {

      // default to first page
      var $page = $pages.first();

      $pages.each( function ( index, page ) {
        // exit each if page is past scrollTop
        if ( WW.scrollTop < $( page ).offset().top -100 )
          return false;
        $page = $( page );
      });

      if ( $page[0] == $currentPage[0] )
        return; // exit

      $currentPage = $page;

      // update UI
      $pageNavigation.find('a.active').removeClass('active');
      $pageNavigation.find('a.' + $currentPage.attr('id') ).addClass('active');
    });

    return 'App is running';

  }
);
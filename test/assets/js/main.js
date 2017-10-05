(function(){

    var transparent = true;
    var fixedTop = false;
    var navbar_initialized = false;

    var window_height;
    var window_width;
    var content_opacity = 0;
    var content_transition = 0;
    var burger_menu;
    var map;

    window.initGoogleMaps = function(){

        var mapElem = document.getElementById('map');

        if ( mapElem ) {

            var myLatlng = new google.maps.LatLng("34.062552", "-84.2248647");

            var mapOptions = {
              zoom: 13,
              center: myLatlng,
              scrollwheel: false, //we disable scroll over the map, it is a really annoing when you scroll through page
              disableDefaultUI: true,
              styles: [{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"on"},{"gamma":"1.82"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"gamma":"1.96"},{"lightness":"-9"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"on"},{"lightness":"25"},{"gamma":"1.00"},{"saturation":"-100"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#ffaa00"},{"saturation":"-43"},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"simplified"},{"hue":"#ffaa00"},{"saturation":"-70"}]},{"featureType":"road.highway.controlled_access","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"visibility":"on"},{"saturation":"-100"},{"lightness":"30"}]},{"featureType":"road.local","elementType":"all","stylers":[{"saturation":"-100"},{"lightness":"40"},{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"gamma":"0.80"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"off"}]}]
            }

            map = new google.maps.Map( mapElem, mapOptions );

            // var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
            // icon: image

            var marker = new google.maps.Marker({
                position: { lat: 34.062552, lng: -84.2248647 },
                label:"Bridgeway Church"
                
            });

            // // To add the marker to the map, call setMap();
            marker.setMap(map);

        }

    };

    $(document).ready(function(){

        window_width = $(window).width();
        window_height = $(window).height();

        burger_menu = $('.navbar').hasClass('navbar-burger') ? true : false;

        // Init navigation toggle for small screens
        if(window_width < 1024 || burger_menu){
            gaia.initRightMenu();
        }

        if($('.content-with-opacity').length != 0){
            content_opacity = 1;
        }

    });

    //activate collapse right menu when the windows is resized
    $(window).resize(function(){
        if($(window).width() < 1024){
            gaia.initRightMenu();
        }
        if($(window).width() > 992 && !burger_menu){
            $('nav[role="navigation"]').removeClass('navbar-burger');
            gaia.misc.navbar_menu_visible = 1;
            navbar_initialized = false;
        }
    });

    $(window).on('scroll',function(){


        if(window_width > 992){
            gaia.checkScrollForParallax();
        }

        if(content_opacity == 1 ){
            gaia.checkScrollForContentTransitions();
        }

    });

    gaia = {
        misc:{
            navbar_menu_visible: 0
        },
        initRightMenu: function(){

             if(!navbar_initialized){
                $toggle = $('.navbar-toggle');
                $toggle.click(function (){

                    if(gaia.misc.navbar_menu_visible == 1) {
                        $('html').removeClass('nav-open');
                        gaia.misc.navbar_menu_visible = 0;
                        $('#bodyClick').remove();
                         setTimeout(function(){
                            $toggle.removeClass('toggled');
                         }, 550);

                    } else {
                        setTimeout(function(){
                            $toggle.addClass('toggled');
                        }, 580);

                        div = '<div id="bodyClick"></div>';
                        $(div).appendTo("body").click(function() {
                            $('html').removeClass('nav-open');
                            gaia.misc.navbar_menu_visible = 0;
                            $('#bodyClick').remove();
                             setTimeout(function(){
                                $toggle.removeClass('toggled');
                             }, 550);
                        });

                        $('html').addClass('nav-open');
                        gaia.misc.navbar_menu_visible = 1;

                    }
                });
                navbar_initialized = true;
            }

        },

        checkScrollForParallax: debounce(function() {
            	$('.parallax').each(function() {
            	    var $elem = $(this);

            	    if(isElementInViewport($elem)){
                      var parent_top = $elem.offset().top;
                      var window_bottom = $(window).scrollTop();
                      var $image = $elem.children('.image');

                	  oVal = ((window_bottom - parent_top) / 3);
                      $image.css('transform','translate3d(0px, ' + oVal + 'px, 0px)');
            	    }
                });

        }, 6),

        checkScrollForContentTransitions: debounce(function() {
             $('.content-with-opacity').each(function() {
                 var $content = $(this);

                 if(isElementInViewport($content)){
                      var window_top = $(window).scrollTop();
                	  opacityVal = 1 - (window_top / 230);

                      if(opacityVal < 0){
                          opacityVal = 0;
                          return;
                      } else {
                        $content.css('opacity',opacityVal);
                      }

            	    }
             });
        }, 6)

    }

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.

    function debounce(func, wait, immediate) {
    	var timeout;
    	return function() {
    		var context = this, args = arguments;
    		clearTimeout(timeout);
    		timeout = setTimeout(function() {
    			timeout = null;
    			if (!immediate) func.apply(context, args);
    		}, wait);
    		if (immediate && !timeout) func.apply(context, args);
    	};
    };


    function isElementInViewport(elem) {
        var $elem = $(elem);

        // Get the scroll position of the page.
        var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html');
        var viewportTop = $(scrollElem).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        // Get the position of the element on the page.
        var elemTop = Math.round( $elem.offset().top );
        var elemBottom = elemTop + $elem.height();

        return ((elemTop < viewportBottom) && (elemBottom > viewportTop));
    }

}());
$(function () {
    $.fn.sliderFS = function (options) {
        var settings = $.extend({
            width: $(window).width(),
            height: $(window).height(),
            autoAnimate: true,
            interval: 5000,
            displayMenu: true,
            menuPosition: 'over-bottom',
            menuContainer: ''
        }, options);

        var menuStyles = {
            position: 'relative',
            'z-index': '100',
            bottom: '10%',
            'text-align': 'center'
        };

        var menuItemStyles = {
            display: 'inline-block',
            margin: '5px',
            width: '20px',
            height: '20px',
            'border-radius': '50%'
        };

        var slider = $(this);
        slider.addClass('slider');
        var container = $(this).children('.container')[0];
        var slidesCount = $(container).children('.slide').length;
        $(container).children('.slide').eq(0).addClass('current');
        var containerWidth = slidesCount * settings.width;
        var currentSlide = 0;

        var sliderStyles = {
            'box-sizing': 'border-box',
            margin: 'auto',
            overflow: 'hidden',
            width: settings.width + 'px',
            height: settings.height + 'px'
        };

        var containerStyles = {
            position: 'relative',
            'box-sizing': 'border-box',
            width: containerWidth + 'px',
            height: settings.height + 'px',
            margin: '0 auto',
            left: '0',
            top: '0'
        };

        var slideStyles = {
            'box-sizing': 'border-box',
            float: 'left',
            width: settings.width,
            height: settings.height
        };

        $(this).css(sliderStyles)
                .children('.container').css(containerStyles)
                .children('.slide').css(slideStyles);
        $('body').css('margin', '0');

        activateArrowKeys();
        activateTouchEvents();

        var sliderInterval;
        sliderInterval = autoAnimate();
        var paused = false;
        if (settings.autoAnimate) {
            $(container).on('mouseenter', function () {
                paused = true;
            })
                        .on('mouseover', function () {
                            paused = true;
                        })
                        .on('mouseleave', function () {
                            paused = false;
                        });

        }

        if (settings.displayMenu) {
            displayMenu();
        }

        // FUNCTIONS
        function activateArrowKeys() {
            settings.width;

            $(window).keydown(function (e) {
                if (e.keyCode == 37) { // left
                    movePrevious();
                }
                else if (e.keyCode == 39) { // right
                    moveNext();
                }
            });
        }

        var mousedownX = null;
        var capturedSwipe = false;
        var mouseupX = null;

        function activateTouchEvents() {
            $(container).mousedown(function (e) {
                e.preventDefault();
                mousedownX = e.pageX;
                capturedSwipe = true;
            });
            $(container).mouseup(function (e) {
                e.preventDefault();
                mouseupX = e.pageX;
                if (mouseupX - mousedownX > 50)
                    movePrevious();
                else if (mouseupX - mousedownX < -50)
                    moveNext();
                capturedSwipe = false;
            });
            $(container).bind('touchstart', function (e) {
                e.preventDefault();
                mousedownX = e.pageX;
                capturedSwipe = true;
            });
            $(container).bind('touchmove', function (e) {
                e.preventDefault();
                currentX = e.pageX;
                $('.container').animate({
                    left: '+=' + (currentX - mousedownX) + 'px'
                });
            });
            $(container).bind('touchend', function (e) {
                e.preventDefault();
                mouseupX = e.pageX;
                if (mouseupX - mousedownX > 50)
                    movePrevious();
                else if (mouseupX - mousedownX < -50)
                    moveNext();
                else
                    $('.container').animate({
                        left: '=' + (currentSlide - settings.width) + 'px'
                    });

                capturedSwipe = false;
            });
        }

        function autoAnimate() {
            return setInterval(function () {
                if (!paused)
                    moveNext(this);
            }, settings.interval);
        }

        function moveNext() {
            if (currentSlide + 1 == slidesCount) {
                currentSlide = 0;
            }
            else {
                currentSlide++;
            }
            setCurrentSlide(currentSlide);
        };

        function movePrevious() {
            if (currentSlide == 0) {
                currentSlide = slidesCount - 1;
            }
            else {
                currentSlide--;
            }
            setCurrentSlide(currentSlide);
        }

        function setCurrentSlide(slideIndex) {
            currentSlide = slideIndex;
            $('.container .slide').removeClass('current').eq(slideIndex).addClass('current');
            var $menu = $('.slider .menu');
            if ($menu != undefined) {
                $menu.children('.menu-item').removeClass('current').eq(slideIndex).addClass('current');
            }

            var containerLeft = -1 * slideIndex * settings.width;
            $(container).animate({
                left: containerLeft
            });
        }

        function displayMenu() {
            var $menuContainer;
            if (settings.menuContainer != '')
                $menuContainer = $(settings.menuContainer);
            else {
                $menuContainer = createMenu();
                slider.append($menuContainer);
            }
            initializeMenu($menuContainer);
        }

        function initializeMenu(menuContainer) {
            $(menuContainer).css(menuStyles);
            $(menuContainer).on('mouseenter', function () {
                paused = true;
            })
                            .on('mouseover', function () {
                                paused = true;
                            })
                            .on('mouseleave', function () {
                                paused = false;
                            });

            var $menuItems = $(menuContainer).children('.menu-item');
            $menuItems.eq(0).addClass('current');
            for (var i = 0; i < $menuItems.length; i++) {
                $($menuItems[i]).css(menuItemStyles);
            }
            $menuItems.click(function () {
                index = $(this).index('.menu-item');
                setCurrentSlide(index);
            });
        }

        function createMenu() {
            var menu = document.createElement('div');
            menu.setAttribute('class', 'menu');

            for (var i = 0; i < slidesCount; i++) {
                var menuItem = document.createElement('div');
                menuItem.setAttribute('class', 'menu-item');
                $(menuItem).css(menuItemStyles);
                menu.appendChild(menuItem);
            }

            return menu;
        }

    };

}(jQuery));
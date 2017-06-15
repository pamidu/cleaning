/*use strict*/
(function (mamDirectives) {

    mamDirectives.directive('multistopProgress', function () {
        return {
            restrict: 'A',
            scope: {
                duedateinfo: '='
            },
            template: '<section class="cd-horizontal-timeline">' +
            '<div class="timeline">' +
            '<div class="events-wrapper">' +
            '<ol>' +
            '<div class="events">' +
            '<li ng-repeat="duestops in duedateinfo"><a href="#0" data-date="" class="selected">{{duestops.date}}</a></li>' +
            '</ol>' +
            '<span class="filling-line" aria-hidden="true"></span>' +
            '</div>' +
            '</div>' +
            '<ul class="cd-timeline-navigation">' +
            '<li><a href="#0" class="prev inactive">Prev</a></li>' +
            '<li><a href="#0" class="next">Next</a></li>' +
            '</ul>' +
            '</div>' +
            '<div class="events-content">' +
            '<ol>' +
            '<li ng-repeat="duestops in duedateinfo" class="selected" data-date="duestops.date">' +
            '<h2>{{duestops.headerinfo}}</h2>' +
            '<em>{{duestops.date}}</em>' +
            '<p>{{duestops.moreinfo}}</p>' +
            '</li>' +
            '</ol>' +
            '</div>' +
            '</section>',
            link: function (scope, attrs, elem) {
                var timelines = $('.cd-horizontal-timeline'),
                eventsMinDistance = 60;

                (timelines.length > 0) && initTimeline(timelines);

                function initTimeline(timelines) {
                    timelines.each(function () {
                        var timeline = $(this),
                        timelineComponents = {};
                        //cache timeline components
                        timelineComponents['timelineWrapper'] = timeline.find('.events-wrapper');
                        timelineComponents['eventsWrapper'] = timelineComponents['timelineWrapper'].children('.events');
                        timelineComponents['fillingLine'] = timelineComponents['eventsWrapper'].children('.filling-line');
                        timelineComponents['timelineEvents'] = timelineComponents['eventsWrapper'].find('a');
                        timelineComponents['timelineDates'] = parseDate(timelineComponents['timelineEvents']);
                        timelineComponents['eventsMinLapse'] = minLapse(timelineComponents['timelineDates']);
                        timelineComponents['timelineNavigation'] = timeline.find('.cd-timeline-navigation');
                        timelineComponents['eventsContent'] = timeline.children('.events-content');

                        //assign a left postion to the single events along the timeline
                        setDatePosition(timelineComponents, eventsMinDistance);
                        //assign a width to the timeline
                        var timelineTotWidth = setTimelineWidth(timelineComponents, eventsMinDistance);
                        //the timeline has been initialize - show it
                        timeline.addClass('loaded');

                        //detect click on the next arrow
                        timelineComponents['timelineNavigation'].on('click', '.next', function (event) {
                            event.preventDefault();
                            updateSlide(timelineComponents, timelineTotWidth, 'next');
                        });
                        //detect click on the prev arrow
                        timelineComponents['timelineNavigation'].on('click', '.prev', function (event) {
                            event.preventDefault();
                            updateSlide(timelineComponents, timelineTotWidth, 'prev');
                        });
                        //detect click on the a single event - show new event content
                        timelineComponents['eventsWrapper'].on('click', 'a', function (event) {
                            event.preventDefault();
                            timelineComponents['timelineEvents'].removeClass('selected');
                            $(this).addClass('selected');
                            updateOlderEvents($(this));
                            updateFilling($(this), timelineComponents['fillingLine'], timelineTotWidth);
                            updateVisibleContent($(this), timelineComponents['eventsContent']);
                        });

                        //on swipe, show next/prev event content
                        timelineComponents['eventsContent'].on('swipeleft', function () {
                            var mq = checkMQ();
                            (mq == 'mobile') && showNewContent(timelineComponents, timelineTotWidth, 'next');
                        });
                        timelineComponents['eventsContent'].on('swiperight', function () {
                            var mq = checkMQ();
                            (mq == 'mobile') && showNewContent(timelineComponents, timelineTotWidth, 'prev');
                        });

                        //keyboard navigation
                        $(document).keyup(function (event) {
                            if (event.which == '37' && elementInViewport(timeline.get(0))) {
                                showNewContent(timelineComponents, timelineTotWidth, 'prev');
                            } else if (event.which == '39' && elementInViewport(timeline.get(0))) {
                                showNewContent(timelineComponents, timelineTotWidth, 'next');
                            }
                        });
                    });
}

function updateSlide(timelineComponents, timelineTotWidth, string) {
                    //retrieve translateX value of timelineComponents['eventsWrapper']
                    var translateValue = getTranslateValue(timelineComponents['eventsWrapper']),
                    wrapperWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', ''));
                    //translate the timeline to the left('next')/right('prev')
                    (string == 'next') ? translateTimeline(timelineComponents, translateValue - wrapperWidth + eventsMinDistance, wrapperWidth - timelineTotWidth): translateTimeline(timelineComponents, translateValue + wrapperWidth - eventsMinDistance);
                }

                function showNewContent(timelineComponents, timelineTotWidth, string) {
                    //go from one event to the next/previous one
                    var visibleContent = timelineComponents['eventsContent'].find('.selected'),
                    newContent = (string == 'next') ? visibleContent.next() : visibleContent.prev();

                    if (newContent.length > 0) { //if there's a next/prev event - show it
                        var selectedDate = timelineComponents['eventsWrapper'].find('.selected'),
                    newEvent = (string == 'next') ? selectedDate.parent('li').next('li').children('a') : selectedDate.parent('li').prev('li').children('a');

                    updateFilling(newEvent, timelineComponents['fillingLine'], timelineTotWidth);
                    updateVisibleContent(newEvent, timelineComponents['eventsContent']);
                    newEvent.addClass('selected');
                    selectedDate.removeClass('selected');
                    updateOlderEvents(newEvent);
                    updateTimelinePosition(string, newEvent, timelineComponents);
                }
            }

            function updateTimelinePosition(string, event, timelineComponents) {
                    //translate timeline to the left/right according to the position of the selected event
                    var eventStyle = window.getComputedStyle(event.get(0), null),
                    eventLeft = Number(eventStyle.getPropertyValue("left").replace('px', '')),
                    timelineWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', '')),
                    timelineTotWidth = Number(timelineComponents['eventsWrapper'].css('width').replace('px', ''));
                    var timelineTranslate = getTranslateValue(timelineComponents['eventsWrapper']);

                    if ((string == 'next' && eventLeft > timelineWidth - timelineTranslate) || (string == 'prev' && eventLeft < -timelineTranslate)) {
                        translateTimeline(timelineComponents, -eventLeft + timelineWidth / 2, timelineWidth - timelineTotWidth);
                    }
                }

                function translateTimeline(timelineComponents, value, totWidth) {
                    var eventsWrapper = timelineComponents['eventsWrapper'].get(0);
                    value = (value > 0) ? 0 : value; //only negative translate value
                    value = (!(typeof totWidth === 'undefined') && value < totWidth) ? totWidth : value; //do not translate more than timeline width
                    setTransformValue(eventsWrapper, 'translateX', value + 'px');
                    //update navigation arrows visibility
                    (value == 0) ? timelineComponents['timelineNavigation'].find('.prev').addClass('inactive'): timelineComponents['timelineNavigation'].find('.prev').removeClass('inactive');
                    (value == totWidth) ? timelineComponents['timelineNavigation'].find('.next').addClass('inactive'): timelineComponents['timelineNavigation'].find('.next').removeClass('inactive');
                }

                function updateFilling(selectedEvent, filling, totWidth) {
                    //change .filling-line length according to the selected event
                    var eventStyle = window.getComputedStyle(selectedEvent.get(0), null),
                    eventLeft = eventStyle.getPropertyValue("left"),
                    eventWidth = eventStyle.getPropertyValue("width");
                    eventLeft = Number(eventLeft.replace('px', '')) + Number(eventWidth.replace('px', '')) / 2;
                    var scaleValue = eventLeft / totWidth;
                    setTransformValue(filling.get(0), 'scaleX', scaleValue);
                }

                function setDatePosition(timelineComponents, min) {
                    for (i = 0; i < timelineComponents['timelineDates'].length; i++) {
                        var distance = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][i]),
                        distanceNorm = Math.round(distance / timelineComponents['eventsMinLapse']) + 2;
                        timelineComponents['timelineEvents'].eq(i).css('left', distanceNorm * min + 'px');
                    }
                }

                function setTimelineWidth(timelineComponents, width) {
                    var timeSpan = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][timelineComponents['timelineDates'].length - 1]),
                    timeSpanNorm = timeSpan / timelineComponents['eventsMinLapse'],
                    timeSpanNorm = Math.round(timeSpanNorm) + 4,
                    totalWidth = timeSpanNorm * width;
                    timelineComponents['eventsWrapper'].css('width', totalWidth + 'px');
                    updateFilling(timelineComponents['eventsWrapper'].find('a.selected'), timelineComponents['fillingLine'], totalWidth);
                    updateTimelinePosition('next', timelineComponents['eventsWrapper'].find('a.selected'), timelineComponents);

                    return totalWidth;
                }

                function updateVisibleContent(event, eventsContent) {
                    var eventDate = event.data('date'),
                    visibleContent = eventsContent.find('.selected'),
                    selectedContent = eventsContent.find('[data-date="' + eventDate + '"]'),
                    selectedContentHeight = selectedContent.height();

                    if (selectedContent.index() > visibleContent.index()) {
                        var classEnetering = 'selected enter-right',
                        classLeaving = 'leave-left';
                    } else {
                        var classEnetering = 'selected enter-left',
                        classLeaving = 'leave-right';
                    }

                    selectedContent.attr('class', classEnetering);
                    visibleContent.attr('class', classLeaving).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
                        visibleContent.removeClass('leave-right leave-left');
                        selectedContent.removeClass('enter-left enter-right');
                    });
                    eventsContent.css('height', selectedContentHeight + 'px');
                }

                function updateOlderEvents(event) {
                    event.parent('li').prevAll('li').children('a').addClass('older-event').end().end().nextAll('li').children('a').removeClass('older-event');
                }

                function getTranslateValue(timeline) {
                    var timelineStyle = window.getComputedStyle(timeline.get(0), null),
                    timelineTranslate = timelineStyle.getPropertyValue("-webkit-transform") ||
                    timelineStyle.getPropertyValue("-moz-transform") ||
                    timelineStyle.getPropertyValue("-ms-transform") ||
                    timelineStyle.getPropertyValue("-o-transform") ||
                    timelineStyle.getPropertyValue("transform");

                    if (timelineTranslate.indexOf('(') >= 0) {
                        var timelineTranslate = timelineTranslate.split('(')[1];
                        timelineTranslate = timelineTranslate.split(')')[0];
                        timelineTranslate = timelineTranslate.split(',');
                        var translateValue = timelineTranslate[4];
                    } else {
                        var translateValue = 0;
                    }

                    return Number(translateValue);
                }

                function setTransformValue(element, property, value) {
                    element.style["-webkit-transform"] = property + "(" + value + ")";
                    element.style["-moz-transform"] = property + "(" + value + ")";
                    element.style["-ms-transform"] = property + "(" + value + ")";
                    element.style["-o-transform"] = property + "(" + value + ")";
                    element.style["transform"] = property + "(" + value + ")";
                }

                //based on http://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
                function parseDate(events) {
                    var dateArrays = [];
                    events.each(function () {
                        var singleDate = $(this),
                        dateComp = singleDate.data('date').split('T');
                        if (dateComp.length > 1) { //both DD/MM/YEAR and time are provided
                            var dayComp = dateComp[0].split('/'),
                            timeComp = dateComp[1].split(':');
                        } else if (dateComp[0].indexOf(':') >= 0) { //only time is provide
                            var dayComp = ["2000", "0", "0"],
                            timeComp = dateComp[0].split(':');
                        } else { //only DD/MM/YEAR
                            var dayComp = dateComp[0].split('/'),
                            timeComp = ["0", "0"];
                        }
                        var newDate = new Date(dayComp[2], dayComp[1] - 1, dayComp[0], timeComp[0], timeComp[1]);
                        dateArrays.push(newDate);
                    });
                    return dateArrays;
                }

                function daydiff(first, second) {
                    return Math.round((second - first));
                }

                function minLapse(dates) {
                    //determine the minimum distance among events
                    var dateDistances = [];
                    for (i = 1; i < dates.length; i++) {
                        var distance = daydiff(dates[i - 1], dates[i]);
                        dateDistances.push(distance);
                    }
                    return Math.min.apply(null, dateDistances);
                }

                /*
                    How to tell if a DOM element is visible in the current viewport?
                    http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
                    */
                    function elementInViewport(el) {
                        var top = el.offsetTop;
                        var left = el.offsetLeft;
                        var width = el.offsetWidth;
                        var height = el.offsetHeight;

                        while (el.offsetParent) {
                            el = el.offsetParent;
                            top += el.offsetTop;
                            left += el.offsetLeft;
                        }

                        return (
                            top < (window.pageYOffset + window.innerHeight) &&
                            left < (window.pageXOffset + window.innerWidth) &&
                            (top + height) > window.pageYOffset &&
                            (left + width) > window.pageXOffset
                            );
                    }

                    function checkMQ() {
                    //check if mobile or desktop device
                    return window.getComputedStyle(document.querySelector('.cd-horizontal-timeline'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
                }
            }
        };
    });


/*Slider directive (UI Component Directive) - start */
mamDirectives.directive('createSlider', function ($interval) {
    return {
        restrict: 'A',
        scope: {
            links: '=urls',
            current: '=',
            time: '@'
        },
        /* track by $index permite que en el array haya más de un valor duplicado*/
        template: '<ul class="slides" effect-slider>' +
        '<li ng-repeat="url in links track by $index" ng-style="{width: 100/links.length + \'%\'}">' +
        '<img ng-src="{{url}}"/>' +
        '</li>' +
        '</ul>' +
        '<div class="icons">' +
        '<span ng-repeat="icon in links track by $index" ng-class="{\'active\': $index == current}"" ng-click="showImg($index)"></span>' +
        '</div>',

        controller: function ($scope, $element, $attrs) {
            var intervalID = null;
            var restart = false;
            $scope.showImg = function (index) {
                $scope.current = index;
                $interval.cancel(intervalID);
                restart = false;
                $scope.intervalManager(Number($scope.time) * 1000, restart);
            }

            $scope.intervalManager = function (time, flag) {
                intervalID = $interval(function () {
                        // - 1 porque $scope.links.length = 3 $scope.current va de 0, 1, 2
                        if ($scope.current !== $scope.links.length - 1) {
                            if (!flag) {
                                $scope.current++;
                            } else {
                                if ($scope.current !== 0) {
                                    $scope.current--;
                                } else {
                                    flag = false;
                                    $scope.current++;
                                }
                            }
                        } else {
                            flag = true;
                            $scope.current--;
                        }
                    }, time);
            };

            $scope.intervalManager(Number($scope.time) * 1000, restart);

        },
        link: function (scope, elem, attrs) {
            elem.css('width', scope.links.length * 100 + '%');
        }
    };
});

mamDirectives.directive('effectSlider', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            scope.$watch('current', function () {
                elem.css('transform', 'translateX(-' + scope.current * (100 / scope.links.length) + '%)');
            });
        }
    }
});
/*Slider directive (UI Component Directive) - end */

/*ngModel Change Directive (UI Helper Directive) - start */
mamDirectives.directive('componentmodelChange', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function (v) {
                console.log('!!!' + v);
            })
        }
    };
});
/*ngModel Change Directive (UI Helper Directive) - end */

/*Image Blur (UI Helper Directive) - start*/

mamDirectives.directive('bgblurComponent', bgblurComponentFunc);

function bgblurComponentFunc() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="profileBgBlur" style="width:304px; height:200px;"></div>',
        scope: {
            blurimgSrc: "@",
            blurimgIntensity: '@',
            blurimageClass: '@'
        },
        link: function (scope, element, attrs) {
            attrs.$observe('blurimgSrc', function (val) {
                if (val != "data:image/png;base64," && val !== "") {
                    element.backgroundBlur({
                        imageURL: val,
                        blurAmount: parseInt(scope.blurimgIntensity),
                        imageClass: scope.blurimageClass
                    });
                } else {
                    element.backgroundBlur({
                        imageURL: './images/appIcons/contacts_appicon.png',
                        blurAmount: parseInt(scope.blurimgIntensity),
                        imageClass: scope.blurimageClass
                    });
                };
            });
        }
    }
};
/*Image Blur (UI Helper Directive) - end*/

/*Pannel Control (UI Component Directive) - start*/
mamDirectives.directive('panelcontrolComponent', function () {
    return {
        scope: {
            componentdata: '='
        },
        template: '<div class="panelControllerHolder">' +
        '<md-button ng-repeat="functionality in panelFunctionalityList" class="md-icon-button" aria-label="{{functionality.controlName}}">' +
        '<md-icon md-svg-icon="{{functionality.controlIcon}}" class="s24" alt="Search Components"></md-icon>' +
        '<md-tooltip>{{functionality.controlName}}</md-tooltip>' +
        '</md-button>' +
        '</div>',
        controller: function ($scope) {
            $scope.panelFunctionalityList = [{
                controlName: 'Search Components',
                controlIcon: 'icons/ic_search_24px.svg',
                controlFunction: 'searchPanelComponents'
            }, {
                controlName: 'Change Component View',
                controlIcon: 'icons/ic_view_list_24px.svg',
                controlFunction: 'switchComponentView'
            }, {
                controlName: 'Panel Settings',
                controlIcon: 'icons/ic_settings_24px.svg',
                controlFunction: 'accessPanelSettings'
            }];

        }
    };
});
/*Pannel Control (UI Component Directive) - end*/

/*Background Directive (UI Helper Directive) - start*/
mamDirectives.directive('backgroundComponent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            attrs.$observe('backgroundComponent', function (val) {
                    // console.log('this was triggered within the bgComponent Directive');
                    var data = JSON.parse(val);
                    for (i = 0; i < data.length; i++) {
                        if (data[i].backgroundtypeactive === true) {
                            var selectedbackgroundtype = data[i].backgroundtype;
                            switch (data[i].backgroundtype) {
                                case "solid":
                                var solidbgcolor = data[i].backgroundcolor;
                                element.css({
                                    'background-color': '' + solidbgcolor + ''
                                });
                                break;
                                case "gradient":
                                var color1 = data[i].backgroundgradientconfig.color1;
                                var color2 = data[i].backgroundgradientconfig.color2;
                                var gradientdirection = data[i].backgroundgradientconfig.orientation;
                                switch (gradientdirection) {
                                    case "horizontal":
                                    element.css({
                                        'background': '' + color1 + '',
                                        'background': 'linear-gradient(to right,' + color1 + ' 0%, ' + color2 + ' 100%)'
                                    });
                                    break;
                                    case "vertical":
                                    element.css({
                                        'background': '' + color1 + '',
                                        'background': 'linear-gradient(to bottom,' + color1 + ' 0%, ' + color2 + ' 100%)'
                                    });
                                    break;
                                    case "diagonaldown":
                                    element.css({
                                        'background': '' + color1 + '',
                                        'background': 'linear-gradient(-45deg,' + color1 + ' 0%, ' + color2 + ' 100%)'
                                    });
                                    break;
                                    case "diagonalup":
                                    element.css({
                                        'background': '' + color1 + '',
                                        'background': 'linear-gradient(45deg,' + color1 + ' 0%, ' + color2 + ' 100%)'
                                    });
                                    break;
                                    case "radial":
                                    element.css({
                                        'background': '' + color1 + '',
                                        'background': 'radial-gradient(ellipse at center,' + color1 + ' 0%, ' + color2 + ' 100%)'
                                    });
                                    break;
                                }
                                break;
                                case "image":
                                var imgurl = data[i].backgroundimageconfig.imageurl;
                                var imgblursettings = data[i].backgroundimageconfig.imageblur;
                                var imgtexture = data[i].backgroundimageconfig.textureoverlay;
                                var imgvignette = data[i].backgroundimageconfig.vignetteoverlay;

                                element.append('<img id="backgroundImage" src="' + imgurl + '" style="width:100%; height:100%;">');

                                if (imgblursettings.status = true) {
                                    angular.element('#backgroundImage').css({
                                        '-webkit-filter': 'blur(' + imgblursettings.ammount + 'px)',
                                        'filter': 'blur(' + imgblursettings.ammount + 'px)'
                                    });
                                }

                                break;
                            }
                        }
                    }
                });
}
};
});
/*Background Directive (UI Helper Directive) - end*/


/*Wave Component (UI Component Directive) - start*/
mamDirectives.directive('waveComponent', ['$compile', function ($compile) {
    return {
        template: '<canvas id="waves"></canvas>',
        link: function (scope, element) {
            var waves = new SineWaves({
                el: document.getElementById('waves'),

                speed: 4,

                width: function () {
                    return $(window).width();
                },

                height: function () {
                    return $(window).height();
                },

                ease: 'SineInOut',

                wavesWidth: '70%',

                waves: [
                {
                    timeModifier: 4,
                    lineWidth: 1,
                    amplitude: -30,
                    wavelength: 25
                },
                {
                    timeModifier: 2,
                    lineWidth: 2,
                    amplitude: -75,
                    wavelength: 50
                },
                {
                    timeModifier: 1,
                    lineWidth: 1,
                    amplitude: -150,
                    wavelength: 100
                },
                {
                    timeModifier: 0.5,
                    lineWidth: 1,
                    amplitude: -300,
                    wavelength: 200
                },
                {
                    timeModifier: 0.25,
                    lineWidth: 2,
                    amplitude: -400,
                    wavelength: 400
                }
                ],

                    // Called on window resize
                    resizeEvent: function () {
                        var gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
                        gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
                        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
                        gradient.addColorStop(1, "rgba(255, 255, 255, 0.2)");

                        var index = -1;
                        var length = this.waves.length;
                        while (++index < length) {
                            this.waves[index].strokeStyle = gradient;
                        }

                        // Clean Up
                        index = void 0;
                        length = void 0;
                        gradient = void 0;
                    }
                });
        }
    };
}]);
/*Wave Component (UI Component Directive) - end*/


/*Dynamic Pannel Slider (UI Component Directive) - start*/
mamDirectives.directive('panelsliderComponent', function () {
    return {
        scope: {
            componentdata: '='
        },
        template: '<ks-swiper-container override-parameters="{{componentdata.dockOverideParameters}}" initial-slide="{{componentdata.dockInitialPannel}}" direction="{{componentdata.dockTransitionDirection}}" loop="{{componentdata.dockPannelLoop}}" pagination-is-active="{{componentdata.dockPagination}}" slides-per-view="" space-between="300" pagination-clickable="true">' +
        '<ks-swiper-slide class="swiper-slide" ng-repeat="panel in shellDockConfig >' +
        '<div class="dockPanels">' +
        '<div class="sliderPanelContainer" ng-include="panel.pannnelDirectiveContentTemplate"></div>' +
        '<panneltitle-component title="panel.panelTitle"></panneltitle-component>' +
        '</div>' +
        '</ks-swiper-slide>' +
        '</ks-swiper-container>'
    };
});
/*Dynamic Pannel Slider (UI Component Directive) - end*/


/*Dynamic Component Generator Directive (UI Helper Directive) - start*/
mamDirectives.directive('componentGenerator', ['$compile', function ($compile) {
    return {
        scope: {
            component: '=',
            componentData: '='
        },
        link: function (scope, element) {
            console.log(scope.component);
            var generatedTemplate = '<div ' + scope.component + '-component component-data="' + componentData + '"></div>';
            element.append($compile(generatedTemplate)(scope));
        }
    };
}]);
/*Dynamic Component Generator Directive (UI Helper Directive) - end*/

/*Dynamic Control Directive - start*/
mamDirectives.directive('mbDynamicCtrl', ['$compile', '$parse', function ($compile, $parse) {
    return {
        restrict: 'A',
        terminal: true,
        priority: 10000,
        link: function (scope, elem) {
            var name = $parse(elem.attr('mb-dynamic-ctrl'))(scope);
            elem.removeAttr('mb-dynamic-ctrl');
            elem.attr('ng-controller', name);
            $compile(elem)(scope);
        }
    };
}]);
/*Dynamic Control Directive - end*/


/*Application Document Interface Header Directive - start*/

/*Application Document Interface Header Directive - end*/

/*All Application Component - start*/
mamDirectives.directive('allapplistComponent', function () {
    return {
        scope: {
            allappdetails: '='
        },
        template: '<div md-ink-ripple="#333" ng-click="favoriteAppLauncher();" style="position:relative" class="favoriteAppItemContainer" layout="row" layout-align="start start">' +
        '<div class="favoriteAppItemContainerIcon" layout="column" layout-align="center center">' +
        '<img ng-src="images/nikkang.png" err-src="images/appIcons/untitledapplication.png" width="32" height="32">' +
        '</div>' +
        '<div class="favoriteAppItemContainerDetails" layout="column" layout-align="center start">' +
        '<span>Sample Application</span>' +
        '<span><md-icon md-svg-icon="icons/ic_favorite_24px.svg" class="favoriteAppIconIndicator" alt="Favorited"></md-icon>Favorited</span>' +
        '</div>' +
        '</div>',
        controller: function ($scope) {

        }
    };
});
/*All Application Component - end*/

/*Active Application Component - start*/
mamDirectives.directive('activeapplistComponent', function () {
    return {
        scope: {
            activeappdetails: '='
        },
        template: '<div md-ink-ripple="#333" ng-click="favoriteAppLauncher();" style="position:relative" class="favoriteAppItemContainer" layout="row" layout-align="start start">' +
        '<div class="favoriteAppItemContainerIcon" layout="column" layout-align="center center">' +
        '<img ng-src="images/nikkang.png" err-src="images/appIcons/untitledapplication.png" width="32" height="32">' +
        '</div>' +
        '<div class="favoriteAppItemContainerDetails" layout="column" layout-align="center start">' +
        '<span>Sample Application</span>' +
        '<span><md-icon md-svg-icon="icons/ic_favorite_24px.svg" class="favoriteAppIconIndicator" alt="Favorited"></md-icon>Favorited</span>' +
        '</div>' +
        '</div>',
        controller: function ($scope) {

        }
    };
});
/*Active Application Component - end*/

/*Favorite Application Component - start*/
mamDirectives.directive('favoriteapplistComponent', function () {
    return {
        scope: {
            favoriteappdetails: '='
        },
        template: '<div md-ink-ripple="#333" ng-click="favoriteAppLauncher();" style="position:relative" class="favoriteAppItemContainer" layout="row" layout-align="start start">' +
        '<div class="favoriteAppItemContainerIcon" layout="column" layout-align="center center">' +
        '<img ng-src="images/nikkang.png" err-src="images/appIcons/untitledapplication.png" width="32" height="32">' +
        '</div>' +
        '<div class="favoriteAppItemContainerDetails" layout="column" layout-align="center start">' +
        '<span>Sample Application</span>' +
        '<span><md-icon md-svg-icon="icons/ic_favorite_24px.svg" class="favoriteAppIconIndicator" alt="Favorited"></md-icon>Favorited</span>' +
        '</div>' +
        '</div>',
        controller: function ($scope) {

        }
    };
});
/*Favorite Application Component - end*/

/*Tennant Switcher Component - start*/
mamDirectives.directive('tenantswitcherComponent', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            currenttennant: '=',
        },
        template: '<div class="dw-current-tennant-container" layout="row" layout-align="center center" ng-click="switchTennant()">' +
        '<md-icon md-svg-icon="icons/ic_swap_vert_circle_24px.svg" style="color:#235B91;"alt="switch tennants"></md-icon>' +
        '<span class="dw-current-tennant" style="color:#235B91;">{{currenttennant}}</span>' +
        '<md-tooltip>Switch Company</md-tooltip>' +
        '</div>',
        controller: function ($rootScope, $scope, $element, $mdDialog) {
            $scope.switchTennant = function (ev) {
                var tennantCollection = $rootScope.recivedTennantCollection;
                $mdDialog.show({
                    templateUrl: 'partials/modal-templates/partials.modal-templates.tennantswitcher.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        tennantCollection: tennantCollection
                    },
                    controller: tennantInfoController,
                    clickOutsideToClose: true
                });

                function tennantInfoController($scope, tennantCollection) {
                    $scope.newTennantCollection = tennantCollection;

                    $scope.makeSwitchTennant = function (tennantDomain) {
                        console.log(tennantDomain);
                        var switchConfirm = $mdDialog.confirm()
                        .title('Switch company confirm.')
                        .content('Are you sure you want to switch to "' + tennantDomain + '" ?')
                        .ariaLabel('Switch Company')
                        .ok('Yes go ahead !')
                        .cancel('Dont do it')
                        .targetEvent(ev);
                        $mdDialog.show(switchConfirm).then(function () {
                            window.open('http://' + tennantDomain, '_blank');
                                // location.replace('http://'+tennantDomain);
                            }, function () {

                            });
                    };
                };
            };
        }
    };
});
/*Tennant Switcher Component - end*/

/*Tennant Switch List Component - start*/
mamDirectives.directive('tennantswitchlistComponent', function () {
    return {
        scope: {
            tennantid: '=',
        },
        template: '<div md-ink-ripple="#333" style="position:relative" class="tennantItemContainer" layout="row" layout-align="start start">' +
        '<div class="tennantItemContainerIcon" layout="column" layout-align="center center">' +
        '<md-icon md-svg-icon="icons/ic_exit_to_app_24px.svg" class="switchTennantHeaderIcon" alt="switch to {{tennantid}} tennant"></md-icon>' +
        '</div>' +
        '<div class="tennantItemContainerText" layout="column" layout-align="center start">' +
        '<span>{{tennantid}}</span>' +
        '</div>' +
        '</div>'
    };
});
/*Tennant Switch List Component - end*/

/*App Shortcut Component Directive (UI Component Directive) - start*/
mamDirectives.directive('appshortcutComponent', function () {
    return {
        scope: {
            component: '=',
            componentdata: '='
        },
        template: '<div class="appShorcutContainer" ng-class="{shortcutExpanded:wasDoubleClicked}">' +
        '<md-button class="appshortcutWidget" sglclick="singleClick()" ng-dblClick="doubleClick()">' +
        '<div class="md-applicationIcon-icon-section">' +
        '<img ng-src="images/appIcons/{{componentdata.Name}}_appicon.png" err-src="images/appIcons/untitledapplication.png" width="72" height="72">' +
        '</div>' +
        '<div class="md-applicationIcon-appname-section">{{componentdata.Name}}</div>' +
        '</md-button>' +
        '<div class="md-appControls-container" layout="row" layout-align="space-around start">' +
        '<md-button class="md-icon-button" aria-label="favourite app" ng-click="favoriteApp(componentdata)">' +
        '<md-icon md-svg-icon="icons/ic_favorite_24px.svg" class="s24" alt="favorite app"></md-icon>' +
        '</md-button>' +
        '<md-button class="md-icon-button" aria-label="info about app" ng-click="findAppInfo(componentdata)">' +
        '<md-icon md-svg-icon="icons/ic_info_outline_24px.svg" class="s24" alt="app info"></md-icon>' +
        '</md-button>' +
        '</div>' +
        '</div>',
        controller: function ($rootScope, $scope, $element, $state, $location, $mdDialog, $mdToast) {
            $scope.wasDoubleClicked = false;
                //console.log('this is the controller for - '+$scope.componentdata.applicationID);
                $scope.data = $scope.componentdata;

                $scope.singleClick = function () {
                    //var locationParams = {childAppID:$scope.componentdata.ApplicationID, childAppName:$scope.componentdata.Name, childAppIcon:$scope.componentdata.iconUrl};
                    //var encodedParams = $base64.encode(JSON.stringify(locationParams));
                    var locationUri = "launcher/customapp/" + $scope.componentdata.ApplicationID + "/" + $scope.componentdata.Name;
                    //console.log(locationUri);
                    $location.path(locationUri);
                    $rootScope.opendAppIconUrl = $scope.componentdata.iconUrl;
                    $scope.wasDoubleClicked = false;
                };

                $scope.doubleClick = function () {
                    $scope.wasDoubleClicked = !$scope.wasDoubleClicked;
                };

                $scope.favoriteApp = function () {
                    $rootScope.frameworkFavoriteApplication.push($scope.componentdata);
                    $scope.wasDoubleClicked = !$scope.wasDoubleClicked;
                    $mdToast.show(
                        $mdToast.simple()
                        .content('Added ' + $scope.componentdata.applicationTitle + ' application to your favorites')
                        .hideDelay(3000)
                        );
                    console.log($rootScope.frameworkFavoriteApplication);
                };

                $scope.findAppInfo = function (ev) {
                    $scope.wasDoubleClicked = false;
                    var selectedApp = $scope.componentdata;
                    $mdDialog.show({
                        controller: appInfoController,
                        templateUrl: 'partials/modal-templates/partials.modal-templates.appinfo.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        locals: {
                            selectedAppInfo: selectedApp
                        },
                        clickOutsideToClose: true
                    });
                };

                function appInfoController($scope, selectedAppInfo) {
                    $scope.selectedAppInfo = selectedAppInfo;
                }

                // $scope.launchApplication = function(appName){
                //   $state.go('launcher.marketplace');
                // }
            }
        };
    });
/*App Shortcut Component Directive (UI Component Directive) - end*/

/*Force Single Click Directive (UI Helper Directive) - start*/
mamDirectives.directive('sglclick', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            var fn = $parse(attr['sglclick']);
            var delay = 200,
            clicks = 0,
            timer = null;
            element.on('click', function (event) {
                    clicks++; //count clicks
                    if (clicks === 1) {
                        timer = setTimeout(function () {
                            scope.$apply(function () {
                                fn(scope, {
                                    $event: event
                                });
                            });
                            clicks = 0; //after action performed, reset counter
                        }, delay);
                    } else {
                        clearTimeout(timer); //prevent single-click action
                        clicks = 0; //after action performed, reset counter
                    }
                });
        }
    };
}]);
/*Force Single Click Directive (UI Helper Directive) - end*/

/*Pannel Title Directive (UI Component Directive) - start*/
mamDirectives.directive('panneltitleComponent', function () {
    var linkFunction = function (scope, elem, attrs) {

    };

    return {
        restrict: 'E',
        scope: {
            title: '='
        },
        template: '<div class="panelTitleHolder"><h1>{{title}}<h1></div>',
        link: linkFunction
    };
});
/*Pannel Title Directive (UI Component Directive) - end*/

/*Slide Animation Directive (UI Animation Directive) - start*/
mamDirectives.animation('.slide-animation', function () {
    return {
        beforeAddClass: function (element, className, done) {
            var scope = element.scope();

            if (className == 'ng-hide') {
                var finishPoint = element.parent().width();
                if (scope.direction !== 'right') {
                    finishPoint = -finishPoint;
                }
                TweenMax.to(element, 0.3, {
                    left: finishPoint,
                    onComplete: done
                });
            } else {
                done();
            }
        },
        removeClass: function (element, className, done) {
            var scope = element.scope();

            if (className == 'ng-hide') {
                element.removeClass('ng-hide');

                var startPoint = element.parent().width();
                if (scope.direction === 'right') {
                    startPoint = -startPoint;
                }

                TweenMax.fromTo(element, 0.3, {
                    left: startPoint
                }, {
                    left: 0,
                    onComplete: done
                });
            } else {
                done();
            }
        }
    };
});
/*Slide Animation Directive (UI Animation Directive) - end*/

/*Image SRC Error Directive (UI Helper Directive) - start*/
mamDirectives.directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });

            attrs.$observe('ngSrc', function (value) {
                if (!value && attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
});
/*Image SRC Error Directive (UI Helper Directive) - end*/

/*Shell Branding Directive (UI Component Directive) - start*/
mamDirectives.directive('shellBranding', function () {
    var linkFunction = function (scope, elem, attrs) {

    };

    return {
        restrict: 'E',
        replace: 'true',
        template: '<img  width="121" height="32" style="cursor:pointer;"/>',
        scope: {},
        link: linkFunction
    };
});
/*Shell Branding Directive (UI Component Directive) - end*/


mamDirectives.directive('sectionTitle', function () {
    return {
        restrict: 'E',
        template: "<div id='newdiv' layout='row' style='width: 255px; margin-top:8px; margin-left:8px;' flex layout-sm='row'><div flex='25'>    <img src={{catogeryLetter}} style='margin-top:22px;border-radius:20px'/>    </div> <div flex style='margin-top:27px;'>  <label style='font-weight:700'>{{title}}</label> </div></div>",
        scope: {
            title: '@',
            catogeryLetter: '='
        },
        link: function (scope, element) {

            if (scope.title == "" || scope.title == null) {

                element.find('#newdiv').attr('hide-sm', '');
                        //console.log("one of the pic is empty");
                    } else {
                        scope.catogeryLetter = "images/material alperbert/avatar_tile_" + scope.title.charAt(0).toLowerCase() + "_28.png";

                        element.find('#newdiv').attr('new', '');
                    }




                } //end of link
            };
        });

window.directiveResources = {};

mamDirectives.directive('ngCroppie', ['$compile', ngCroppieFunc]);

function ngCroppieFunc($compile) {
    return {
        restrict: 'AE',
        scope: {
            src: '=',
            viewport: '=',
            boundry: '=',
            type: '@',
            zoom: '@',
            mousezoom: '@',
            update: '=',
            ngModel: '='
        },
        link: function (scope, elem, attr) {

                // defaults
                if (scope.viewport == undefined) {
                    scope.viewport = {
                        w: null,
                        h: null
                    }
                }

                if (scope.boundry == undefined) {
                    scope.boundry = {
                        w: null,
                        h: null
                    }
                }

                // catches
                scope.viewport.w = (scope.viewport.w != undefined) ? scope.viewport.w : 300;
                scope.viewport.h = (scope.viewport.h != undefined) ? scope.viewport.h : 300;
                scope.boundry.w = (scope.boundry.w != undefined) ? scope.boundry.w : 400;
                scope.boundry.h = (scope.boundry.h != undefined) ? scope.boundry.h : 400;

                // viewport cannot be larger than the boundaries
                if (scope.viewport.w > scope.boundry.w) {
                    scope.viewport.w = scope.boundry.w
                }
                if (scope.viewport.h > scope.boundry.h) {
                    scope.viewport.h = scope.boundry.h
                }

                // convert string to Boolean
                var zoom = (scope.zoom === "true"),
                mouseZoom = (scope.mousezoom === "true");

                // define options
                var options = {
                    viewport: {
                        width: scope.viewport.w,
                        height: scope.viewport.h,
                        type: scope.type || 'square'
                    },
                    boundary: {
                        width: scope.boundry.w,
                        height: scope.boundry.h
                    },
                    showZoom: zoom,
                    mouseWheelZoom: mouseZoom,
                }

                if (scope.update != undefined) {
                    options.update = scope.update
                }

                // create new croppie and settime for updates
                var c = new Croppie(elem[0], options);
                var intervalID = window.setInterval(function () {
                    c.result('canvas').then(function (img) {
                        scope.$apply(function () {
                            scope.ngModel = img
                        })
                    })
                }, 250);

                scope.$on("$destroy",
                    function (event) {
                        clearInterval(intervalID);
                    }
                    );

                // respond to changes in src
                scope.$watch('src', function (newValue, oldValue) {
                    if (scope.src != undefined) {
                        c.bind(scope.src);
                        c.result('canvas').then(function (img) {
                            scope.$apply(function () {
                                scope.ngModel = img
                            })
                        })
                    }
                })


            }

        };
    };

    mamDirectives.service('notifications',['$mdToast','$mdDialog', function($mdToast,$mdDialog){

        this.toast = function(content,status, delay) {

            window.directiveResources.toastRef = $mdToast;
            
            if(!delay)
                delay = 2000;
            $mdToast.show({
                template: '<md-toast class="md-toast-'+status+'"><span flex>'+content+' </span> <md-button  style="margin-left: 20px !important;" onclick="(function(e){ window.directiveResources.toastRef.hide() })(event)">Close</md-button></md-toast>',
                hideDelay: delay,
                position: 'bottom right'
            });
        };
        
        this.alertDialog = function(title, content){
            $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.querySelector('input[name="editForm"]')))
              .clickOutsideToClose(true)
              .title(title)
              .textContent(content)
              .ariaLabel('Alert Dialog Demo')
              .ok('Got it!')
              );
        }
        
        this.startLoading = function(displayText) {
            $mdDialog.show({
              template: 
              '<md-dialog ng-cloak style="max-width:400px;">'+
              '   <md-dialog-content style="padding:20px;">'+
              '       <div layout="row" layout-align="start center">'+
              '           <md-progress-circular class="md-accent" md-mode="indeterminate" md-diameter="40" style=" padding-right: 45px"></md-progress-circular>'+
              '           <span style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;">'+displayText+'</span>'+
              '       </div>'+
              '   </md-dialog-content>'+
              '</md-dialog>',
              parent: angular.element(document.body),
              clickOutsideToClose:false
          })
        }
        this.finishLoading = function(){
            $mdDialog.hide();
        }
    }]);

})(angular.module('mambatiDirectives', []));

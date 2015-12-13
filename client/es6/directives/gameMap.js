'use strict';

angular.module('clickApp.directives')
  .directive('clickGameMap', [
    '$window',
    'gameMap',
    function($window,
             gameMapService) {
      function _eventModifiers(e) {
        var modifiers = [];
        
        if (e.shiftKey) {
          modifiers.push('shift');
        }
        
        if (e.altKey) {
          modifiers.push('alt');
        }
        
        if (e.ctrlKey) {
          modifiers.push('ctrl');
        }
        
        if (e.metaKey) {
          modifiers.push('meta');
        }
        
        return modifiers.sort();
      }
      return {
        restrict: 'A',
        link: function(scope, element/*, attrs*/) {

          var viewport = document.querySelector('#viewport');
          var map = element[0];

          var mouseEvents = (function() {
            var drag = {
              active: false,
              start: null,
              target: null,
              now: null,
            };
            function mouseDownMap(event) {
              log('mouseDownMap', event);
              event.preventDefault();
              if(event.which !== 1) return;

              map.addEventListener('mousemove', dragMap);
              var start = gameMapService.eventToMapCoordinates(map, event);
              gameMapService.findEventTarget(scope.game, event)
                .then(function onFindEventTarget(target) {
                  drag = {
                    active: false,
                    start: start,
                    target: target,
                    now: null,
                  };
                });
            }
            function dragMap(event) {
              log('dragMap', event);
              event.preventDefault();
              if(event.which !== 1) return;

              var emit = drag.active ? 'drag' : 'dragStart';
              drag.active = true;
              drag.now = gameMapService.eventToMapCoordinates(map, event);

              scope.$emit(emit+drag.target.type,
                          { target: drag.target.target,
                            start: drag.start,
                            now: drag.now
                          },
                          event);
            }
            function mouseLeaveMap(event) {
              log('mouseLeaveMap', event);
              event.preventDefault();

              map.removeEventListener('mousemove', dragMap);
              if(drag.active) {
                drag.active = false;
                scope.$emit('dragEnd'+drag.target.type,
                            { target: drag.target.target,
                              start: drag.start,
                              now: drag.now
                            },
                            event);
              }
            }
            function clickMap(event) {
              log('clickMap', event);
              event.preventDefault();
              if(event.which !== 1) return;

              map.removeEventListener('mousemove', dragMap);

              var now = gameMapService.eventToMapCoordinates(map, event);
              if(drag.active) {
                drag.active = false;
                scope.$emit('dragEnd'+drag.target.type,
                            { target: drag.target.target,
                              start: drag.start,
                              now: now
                            },
                            event);
              }
              else {
                gameMapService.findEventTarget(scope.game, event)
                  .then(function onFindEventTarget(target) {
                    var event_name = R.pipe(
                      R.append('click'+target.type),
                      R.join('+')
                    )(_eventModifiers(event));
                    event['click#'] = {
                      target: target.target,
                      x: now.x,
                      y: now.y
                    };
                    scope.gameEvent('closeSelectionDetail');
                    Mousetrap.trigger(event_name,
                                      undefined,
                                      event);
                  });
              }
            }
            function rightClickMap(event) {
              log('rightClickMap', event);
              event.preventDefault();

              var now = gameMapService.eventToMapCoordinates(map, event);
              gameMapService.findEventTarget(scope.game, event)
                .then(function onFindEventTarget(target) {
                  var event_name = R.pipe(
                    R.append('rightClick'+target.type),
                    R.join('+')
                  )(_eventModifiers(event));
                  event['click#'] = {
                    target: target.target,
                    x: now.x,
                    y: now.y
                  };
                  scope.gameEvent('closeSelectionDetail');
                  Mousetrap.trigger(event_name,
                                    undefined,
                                    event);
                });
            }
            function moveMap(event) {
              log('moveMap', event);
              event.preventDefault();

              var now = gameMapService.eventToMapCoordinates(map, event);
              scope.$emit('moveMap', now, event);
            }
            return {
              down: mouseDownMap,
              drag: dragMap,
              leave: mouseLeaveMap,
              click: clickMap,
              rightClick: rightClickMap,
              move: moveMap,
            };
          })();

          var moveEvents = (function() {
            var move_enabled = false;
            function onEnableMove() {
              if(move_enabled) return;
              map.addEventListener('mousemove', mouseEvents.move);
              move_enabled = true;
            }
            function onDisableMove() {
              if(!move_enabled) return;
              map.removeEventListener('mousemove', mouseEvents.move);
              move_enabled = false;
            }
            return {
              enable: onEnableMove,
              disable: onDisableMove,
            };
          })();

          var flipMap = (function() {
            var deploiement_labels;
            scope.ui_state.flip_map = false;
            map.classList.remove('flipped');
            return function flipMap() {
              deploiement_labels = R.defaultTo(document.querySelector('#deploiement-labels'),
                                               deploiement_labels);
              scope.ui_state.flip_map = !map.classList.contains('flipped');
              map.classList.toggle('flipped');
              if(scope.ui_state.flip_map) {
                deploiement_labels.setAttribute('transform','rotate(180,240,240)');
              }
              else {
                deploiement_labels.setAttribute('transform','');
              }
              scope.gameEvent('mapFlipped');
            };
          })();

          var zoomEvents = (function() {
            function zoomReset() {
              var rect = viewport.getBoundingClientRect();
              var hw = Math.min(rect.width, rect.height);
              setMapDimensions(hw-15);
            }
            function zoomIn() {
              var vp = findViewportCenter();
              var cx_cy = vp[0];
              var vw_vh = vp[1];
    
              var rect = map.getBoundingClientRect();
              var cx = (vw_vh[0] > rect.width) ? rect.width / 2 : cx_cy[0];
              var cy = (vw_vh[1] > rect.height) ? rect.height / 2 : cx_cy[1];

              setMapDimensions(rect.width*2);
              setViewportCenter(cx*2, cy*2, vw_vh[0], vw_vh[1]);
            }
            function zoomOut() {
              var vp = findViewportCenter();
              var cx_cy = vp[0];
              var vw_vh = vp[1];
              var hw = Math.min(vw_vh[0], vw_vh[1]);
            
              var rect = map.getBoundingClientRect();

              setMapDimensions(Math.max(hw-15, rect.width/2));
              setViewportCenter(cx_cy[0]/2, cx_cy[1]/2, vw_vh[0], vw_vh[1]);
            }
            return {
              in: zoomIn,
              out: zoomOut,
              reset: zoomReset,
            };
          })();

          var scrollEvents = (function() {
            var scroll_indent = 30;
            function scrollLeft() {
              var left = viewport.scrollLeft;
              $window.requestAnimationFrame(function _scrollLeft() {
                viewport.scrollLeft = left - scroll_indent;
              });
            }
            function scrollRight() {
              var left = viewport.scrollLeft;
              $window.requestAnimationFrame(function _scrollRight() {
                viewport.scrollLeft = left + scroll_indent;
              });
            }
            function scrollUp() {
              var top = viewport.scrollTop;
              $window.requestAnimationFrame(function _scrollUp() {
                viewport.scrollTop = top - scroll_indent;
              });
            }
            function scrollDown() {
              var top = viewport.scrollTop;
              $window.requestAnimationFrame(function _scrollDown() {
                viewport.scrollTop = top + scroll_indent;
              });
            }
            return {
              left: scrollLeft,
              right: scrollRight,
              up: scrollUp,
              down: scrollDown,
            };
          })();

          function setMapDimensions(dim) {
            $window.requestAnimationFrame(function _setMapDimensions() {
              map.style.width = dim+'px';
              map.style.height = dim+'px';
            });
          }          

          function findViewportCenter() {
            var rect = viewport.getBoundingClientRect();
            var vw = rect.width;
            var vh = rect.height;

            var cx = viewport.scrollLeft + vw/2;
            var cy = viewport.scrollTop + vh/2;

            return [[cx, cy], [vw, vh]];
          }

          function setViewportCenter(cx, cy, vw, vh) {
            $window.requestAnimationFrame(function _setViewportCenter() {
              viewport.scrollLeft = cx - vw/2;
              viewport.scrollTop = cy - vh/2;
            });
          }

          map.addEventListener('mouseup', mouseEvents.click);
          map.addEventListener('mousedown', mouseEvents.down);
          map.addEventListener('mouseleave', mouseEvents.leave);
          map.addEventListener('dragstart', function dragStartDisable(event){
            event.preventDefault();
          });
          map.addEventListener('contextmenu', mouseEvents.rightClick);
          
          scope.onGameEvent('flipMap', flipMap, scope);
          scope.onGameEvent('enableMoveMap', moveEvents.enable, scope);
          scope.onGameEvent('disableMoveMap', moveEvents.disable, scope);
          scope.onGameEvent('viewZoomIn', zoomEvents.in, scope);
          scope.onGameEvent('viewZoomOut', zoomEvents.out, scope);
          scope.onGameEvent('viewZoomReset', zoomEvents.reset, scope);
          scope.onGameEvent('viewScrollLeft', scrollEvents.left, scope);
          scope.onGameEvent('viewScrollRight', scrollEvents.right, scope);
          scope.onGameEvent('viewScrollUp', scrollEvents.up, scope);
          scope.onGameEvent('viewScrollDown', scrollEvents.down, scope);

          $window.requestAnimationFrame(function initMap() {
            zoomEvents.reset();
          });
        }
      };
    }
  ]);
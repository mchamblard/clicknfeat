'use strict';

angular.module('clickApp.directives')
  .factory('aoeTemplateElement', [
    '$window',
    'template',
    'gameTemplateSelection',
    'gameMap',
    'labelElement',
    function($window,
             templateService,
             gameTemplateSelectionService,
             gameMapService,
             labelElementService) {
      var aoeTemplateElementService = {
        create: function aoeTemplateElementServiceCreate(svgNS, parent, aoe) {
          var circle = document.createElementNS(svgNS, 'circle');
          circle.classList.add('template');
          circle.classList.add('aoe');
          circle.setAttribute('data-stamp', aoe.state.stamp);
          parent.appendChild(circle);

          var line = document.createElementNS(svgNS, 'line');
          line.classList.add('template-aoe-direction');
          line.style['marker-end'] = 'url(#aoe-direction-end)';
          parent.appendChild(line);

          var label = labelElementService.create(svgNS, parent);

          return { aoe: circle,
                   dir: line,
                   label: label,
                 };
        },
        update: function aoeTemplateElementUpdate(map, scope, template, aoe) {
          var selected = gameTemplateSelectionService.inLocal(template.state.stamp,
                                                              scope.game.template_selection);
          var stroke_color = ( selected ? '#0F0' : '#C60' );
          var dir_visibility = ( selected ? 'visible' : 'hidden' );

          var map_flipped = gameMapService.isFlipped(map);
          var zoom_factor = gameMapService.zoomFactor(map);
          var label_flip_center = template.state;
          var label_text_center = { x: template.state.x,
                                    y: template.state.y + template.state.s + 5
                                  };
          var label_text = templateService.fullLabel(template);
          $window.requestAnimationFrame(function _aoeTemplateElementUpdate() {
            updateAoe(stroke_color, template, aoe.aoe);
            updateDir(dir_visibility, template, aoe.dir);
            labelElementService.update(map_flipped,
                                       zoom_factor,
                                       label_flip_center,
                                       label_text_center,
                                       label_text,
                                       aoe.label);
          });
        },
      };
      function updateAoe(stroke_color, template, aoe) {
        aoe.setAttribute('cx', template.state.x+'');
        aoe.setAttribute('cy', template.state.y+'');
        aoe.setAttribute('r', template.state.s+'');
        aoe.style.stroke = stroke_color;
      }
      function updateDir(visibility, template, dir) {
        dir.setAttribute('x1', template.state.x+'');
        dir.setAttribute('y1', template.state.y+'');
        dir.setAttribute('x2', template.state.x+'');
        dir.setAttribute('y2', (template.state.y-template.state.s)+'');
        dir.setAttribute('transform', ('rotate('+
                                       template.state.r+','+
                                       template.state.x+','+
                                       template.state.y+
                                       ')'
                                      ));
        dir.style.visibility = visibility;
      }
      return aoeTemplateElementService;
    }
  ]);
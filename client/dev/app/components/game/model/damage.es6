angular.module('clickApp.directives')
  .factory('clickGameModelDamage', [
    'model',
    function(modelService) {
      return {
        create: function clickGameModelDamageCreate(svgNS, info, parent) {
          let damage_bar_red;
          let damage_bar_green;
          if(!(info.damage.type === 'warrior' &&
               info.damage.n === 1)) {
            damage_bar_red = document.createElementNS(svgNS, 'line');
            damage_bar_red.classList.add('model-damage-bar');
            damage_bar_red.setAttribute('x1', (info.img[0].width/2-info.base_radius)+'');
            damage_bar_red.setAttribute('y1', (info.img[0].height/2+info.base_radius+2)+'');
            damage_bar_red.setAttribute('x2', (info.img[0].width/2+info.base_radius)+'');
            damage_bar_red.setAttribute('y2', (info.img[0].height/2+info.base_radius+2)+'');
            damage_bar_red.style.stroke = '#F00';
            parent.appendChild(damage_bar_red);

            damage_bar_green = document.createElementNS(svgNS, 'line');
            damage_bar_green.classList.add('model-damage-bar');
            damage_bar_green.setAttribute('x1', (info.img[0].width/2-info.base_radius)+'');
            damage_bar_green.setAttribute('y1', (info.img[0].height/2+info.base_radius+2)+'');
            damage_bar_green.setAttribute('x2', (info.img[0].width/2+info.base_radius)+'');
            damage_bar_green.setAttribute('y2', (info.img[0].height/2+info.base_radius+2)+'');
            damage_bar_green.style.stroke = '#0F0';
            parent.appendChild(damage_bar_green);
          }

          let field_bar_red;
          let field_bar_green;
          if(R.exists(info.damage.field)) {
            field_bar_red = document.createElementNS(svgNS, 'line');
            field_bar_red.classList.add('model-damage-bar');
            field_bar_red.setAttribute('x1', (info.img[0].width/2-info.base_radius)+'');
            field_bar_red.setAttribute('y1', (info.img[0].height/2+info.base_radius+2)+'');
            field_bar_red.setAttribute('x2', (info.img[0].width/2+info.base_radius)+'');
            field_bar_red.setAttribute('y2', (info.img[0].height/2+info.base_radius+2)+'');
            field_bar_red.style.stroke = '#066';
            parent.appendChild(field_bar_red);

            field_bar_green = document.createElementNS(svgNS, 'line');
            field_bar_green.classList.add('model-damage-bar');
            field_bar_green.setAttribute('x1', (info.img[0].width/2-info.base_radius)+'');
            field_bar_green.setAttribute('y1', (info.img[0].height/2+info.base_radius+2)+'');
            field_bar_green.setAttribute('x2', (info.img[0].width/2+info.base_radius)+'');
            field_bar_green.setAttribute('y2', (info.img[0].height/2+info.base_radius+2)+'');
            field_bar_green.style.stroke = '#0FF';
            parent.appendChild(field_bar_green);
          }

          return [ damage_bar_red, damage_bar_green,
                   field_bar_red, field_bar_green
                 ];
        },
        update: function clickGameModelDamageUpdate(info, model, img, element) {
          let [ damage_bar_red, damage_bar_green,
                field_bar_red, field_bar_green
              ] = element;

          if(R.isNil(damage_bar_red)) return;

          if(info.damage.type === 'none' ||
             modelService.isWreckDisplayed(model)) {
            damage_bar_red.style.visibility = 'hidden';
            damage_bar_green.style.visibility = 'hidden';

            if(R.isNil(field_bar_red)) return;

            field_bar_red.style.visibility = 'hidden';
            field_bar_green.style.visibility = 'hidden';
            return;
          }

          let min_x = img.width / 2 + info.base_radius;
          let max_x = img.width / 2 - info.base_radius;
          let y = img.height / 2 + info.base_radius + 1;

          let percent_damage = model.state.dmg.t / info.damage.total;
          let damage_x = (max_x-min_x) * (1-percent_damage) + min_x;

          damage_bar_red.setAttribute('x1', max_x + '');
          damage_bar_red.setAttribute('y1', y + '');
          damage_bar_red.setAttribute('x2', min_x + '');
          damage_bar_red.setAttribute('y2', y + '');
          damage_bar_red.style.visibility = 'visible';

          damage_bar_green.setAttribute('x1', damage_x + '');
          damage_bar_green.setAttribute('y1', y + '');
          damage_bar_green.setAttribute('x2', min_x + '');
          damage_bar_green.setAttribute('y2', y + '');
          damage_bar_green.style.visibility = 'visible';

          if(R.isNil(field_bar_red)) return;

          let percent_field = model.state.dmg.f / info.damage.field;
          let field_x = (max_x-min_x) * (1-percent_field) + min_x;

          field_bar_red.setAttribute('x1', max_x + '');
          field_bar_red.setAttribute('y1', (y+1) + '');
          field_bar_red.setAttribute('x2', min_x + '');
          field_bar_red.setAttribute('y2', (y+1) + '');
          field_bar_red.style.visibility = 'visible';

          field_bar_green.setAttribute('x1', field_x + '');
          field_bar_green.setAttribute('y1', (y+1) + '');
          field_bar_green.setAttribute('x2', min_x + '');
          field_bar_green.setAttribute('y2', (y+1) + '');
          field_bar_green.style.visibility = 'visible';
        }
      };
    }
  ]);
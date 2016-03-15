(function() {
  angular.module('clickApp.directives')
    .factory('clickGameModelArea', gameModelAreaModelFactory);

  gameModelAreaModelFactory.$inject = [
    'model',
  ];
  function gameModelAreaModelFactory(modelService) {
    return {
      create: gameModelAreaCreate,
      update: gameModelAreaUpdate
    };

    function gameModelAreaCreate(svgNS, parent) {
      const ctrl_area = document.createElementNS(svgNS, 'circle');
      ctrl_area.classList.add('model-ctrl-area');
      ctrl_area.setAttribute('cx', '0');
      ctrl_area.setAttribute('cy', '0');
      ctrl_area.setAttribute('r', '0');
      ctrl_area.style.visibility = 'hidden';
      parent.appendChild(ctrl_area);

      const area = document.createElementNS(svgNS, 'circle');
      area.classList.add('model-area');
      area.setAttribute('cx', '0');
      area.setAttribute('cy', '0');
      area.setAttribute('r', '0');
      area.style.visibility = 'hidden';
      parent.appendChild(area);

      return [ area, ctrl_area ];
    }
    function gameModelAreaUpdate(factions, info, model, img, element) {
      const [area, ctrl_area] = element;

      ctrl_area.setAttribute('cx', (img.width/2)+'');
      ctrl_area.setAttribute('cy', (img.height/2)+'');
      modelService
        .isCtrlAreaDisplayedP(factions, model)
        .then((is_displayed) => {
          if(is_displayed) {
            let radius = ((info.focus || info.fury)*20 + info.base_radius);
            ctrl_area.setAttribute('r', radius+'');
            ctrl_area.style.visibility = 'visible';
          }
          else {
            ctrl_area.style.visibility = 'hidden';
          }
        });

      area.setAttribute('cx', (img.width/2)+'');
      area.setAttribute('cy', (img.height/2)+'');
      if(modelService.isAreaDisplayed(model)) {
        area.setAttribute('r', (model.state.are * 10 + info.base_radius)+'');
        area.style.visibility = 'visible';
      }
      else {
        area.style.visibility = 'hidden';
      }
    }
  }
})();

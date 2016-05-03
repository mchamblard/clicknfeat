(function() {
  angular.module('clickApp.directives')
    .directive('clickGameCreateModel', gameCreateModelDirectiveFactory);

  gameCreateModelDirectiveFactory.$inject = [
    '$rootScope',
    'gameMap',
    'model',
  ];
  function gameCreateModelDirectiveFactory($rootScope,
                                           gameMapService,
                                           modelModel) {
    return {
      restrict: 'A',
      link: link
    };

    function link(scope) {
      console.log('clickCreateModel');

      updateCreateModel(scope);
      $rootScope.onStateChangeEvent('Create.base.change', onUpdateCreateModel, scope);

      function onUpdateCreateModel() {
        updateCreateModel(scope);
        scope.$digest();
      }
    }

    function updateCreateModel(scope) {
      const state = $rootScope.state;
      const create = state.create;
      if(R.isNil(create.base)) return;
      const model = scope.model;

      const map = document.getElementById('map');
      const is_flipped = gameMapService.isFlipped(map);
      const coeff = is_flipped ? -1 : 1;

      scope.pos = modelModel.render({is_flipped}, state.factions, R.thread(model)(
        R.assoc('x', state.create.base.x + coeff * model.x),
        R.assoc('y', state.create.base.y + coeff * model.y)
      ));
      console.warn('createModel.update', scope.pos);
    }
  }
})();

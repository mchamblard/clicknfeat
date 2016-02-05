'use strict';

(function () {
  angular.module('clickApp.directives').directive('clickGameLoading', gameLoadingDirectiveFactory);

  gameLoadingDirectiveFactory.$inject = [];
  function gameLoadingDirectiveFactory() {
    return {
      restrict: 'A',
      link: link
    };
  }
  function link(scope, element) {
    console.log('gameLoading');
    scope.onStateChangeEvent('Game.loading', function () {
      element[0].style.display = 'block';
    }, scope);
    scope.onStateChangeEvent('Game.loaded', function () {
      element[0].style.display = 'none';
    }, scope);
  }
})();
//# sourceMappingURL=gameLoading.js.map

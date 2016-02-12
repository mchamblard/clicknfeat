'use strict';

(function () {
  angular.module('clickApp.directives').directive('clickLogReplayList', logReplayListDirectiveFactory);

  logReplayListDirectiveFactory.$inject = [];
  function logReplayListDirectiveFactory() {
    return {
      restrict: 'A',
      link: link
    };

    function link(scope, element) {
      var scroll_container = element[0];
      var list = scroll_container.getAttribute('click-log-replay-list');
      console.log('logReplayList', list);

      scope.$watch(list, function () {
        self.requestAnimationFrame(function () {
          scroll_container.scrollTop = 1000000;
        });
      });
    }
  }
})();
//# sourceMappingURL=gameLogList.js.map

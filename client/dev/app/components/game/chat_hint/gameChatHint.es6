(function() {
  angular.module('clickApp.directives')
    .directive('clickChatHint', chatHintDirectiveFactory);

  chatHintDirectiveFactory.$inject = [
    '$rootScope',
    '$state',
    'appGame',
    'appUser',
  ];
  function chatHintDirectiveFactory($rootScope,
                                    $state,
                                    appGameService,
                                    appUserService) {
    const services = {
      game: appGameService,
      user: appUserService
    };
    return {
      restrict: 'A',
      scope: { type: '@clickChatHint',
               state: '@hintState' },
      link: link
    };

    function link(scope, element) {
      const tab = element[0];
      $rootScope.listenSignal(onChat, services[scope.type].chat.new_chat, scope);
      $rootScope.$on('$stateChangeSuccess', onStateChange);

      function onChat() {
        const hint = !$state.is(scope.state);
        if(hint) {
          tab.classList.add('go-to-hint');
        }
        else {
          tab.classList.remove('go-to-hint');
        }
      }
      function onStateChange(_event_, toState) {
        if(toState.name === scope.state) {
          tab.classList.remove('go-to-hint');
        }
      }
    }
  }
})();

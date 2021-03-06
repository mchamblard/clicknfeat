(function() {
  angular.module('clickApp.directives')
    .directive('clickGamePage', clickGamePageDirectiveFactory);

  clickGamePageDirectiveFactory.$inject = [
    'appGame',
  ];
  function clickGamePageDirectiveFactory(appGameService) {
    return {
      restrict: 'A',
      link: link
    };

    function link(scope, element) {
      element = element[0];
      const menuToggle = buildMenuToggle(element);

      element
        .querySelector('#menu-toggle')
        .addEventListener('click', menuToggle);
      scope.listenSignal(menuToggle, appGameService.view.toggle_menu, scope);

      const gameview = element.querySelector('#gameview');
      const rect = gameview.getBoundingClientRect();
      gameview.style.width = (rect.height)+'px';
    }

    function buildMenuToggle(element) {
      let gameview_width_mem;
      return () => {
        const gameview = element.querySelector('#gameview');
        const menu = element.querySelector('#menu');
        const tool_osd = element.querySelector('#tool-osd');
        const chat_osd = element.querySelector('#chat-osd');

        const menu_hidden = menu.classList.contains('hidden');
        if(!menu_hidden) {
          const rect = gameview.getBoundingClientRect();
          gameview_width_mem = rect.width;
          gameview.style.width = self.window.innerWidth+'px';
        }
        else {
          gameview.style.width = gameview_width_mem+'px';
        }
        gameview.classList.toggle('resizable');
        menu.classList.toggle('hidden');
        tool_osd.classList.toggle('show');
        chat_osd.classList.toggle('show');
      };
    }
  }
})();

(function() {
  angular.module('clickApp.services')
    .factory('gameModels', gameModelsModelFactory);

  gameModelsModelFactory.$inject = [
    'gameElements',
    'model',
  ];
  function gameModelsModelFactory(gameElementsModel,
                                  modelModel) {
    const base = gameElementsModel('model', modelModel);
    const gameModelsModel = Object.create(base);
    R.deepExtend(gameModelsModel, {
      findStampsBetweenPoints: modelsFindStampBetweenPoints,
      modeForStamp: modelsModeForStamp
    });

    R.curryService(gameModelsModel);
    return gameModelsModel;

    function modelsFindStampBetweenPoints(top_left, bottom_right, models) {
      return R.thread(models)(
        gameModelsModel.all,
        R.filter(modelModel.isBetweenPoints$(top_left, bottom_right)),
        R.map(R.path(['state','stamp']))
      );
    }
    function modelsModeForStamp(stamp, models) {
      return R.thread(models)(
        gameModelsModel.findStamp$(stamp),
        R.ifElse(
          R.exists,
          modelModel.modeFor,
          () => 'Model'
        )
      );
    }
  }
})();

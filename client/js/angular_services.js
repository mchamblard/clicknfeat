angular.module('clickApp.services')
  .factory('localStorage', [
    function() {
      return self.localStorage;
    }
  ])
  .factory('pubSub', [
    pubSubServiceFactory
  ])
  .factory('jsonStringifier', [
    jsonStringifierServiceFactory
  ])
  .factory('jsonParser', [
    jsonParserServiceFactory
  ])
  .factory('fileExport', [
    'jsonStringifier',
    fileExportServiceFactory
  ])
  .factory('fileImport', [
    'jsonParser',
    fileImportServiceFactory
  ])
  .factory('user', [
    'localStorage',
    userServiceFactory
  ])
  .factory('game', [
    'jsonStringifier',
    'commands',
    'gameRuler',
    'gameTemplates',
    'gameTemplateSelection',
    'gameModels',
    'gameModelSelection',
    gameServiceFactory
  ])
  .factory('games', [
    'localStorage',
    'jsonParser',
    'jsonStringifier',
    gamesServiceFactory
  ])
  .factory('settings', [
    'localStorage',
    'jsonParser',
    'jsonStringifier',
    settingsServiceFactory
  ])
  .factory('point', [
    pointServiceFactory
  ])
  .factory('modes', [
    modesServiceFactory
  ])
  .factory('commonMode', [
    'modes',
    'settings',
    'game',
    'gameTemplateSelection',
    commonModeServiceFactory
  ])
  .factory('defaultMode', [
    'modes',
    'settings',
    'commonMode',
    'game',
    'template',
    'gameTemplateSelection',
    'gameModels',
    'gameModelSelection',
    defaultModeServiceFactory
  ])
  .factory('rulerMode', [
    'modes',
    'settings',
    'commonMode',
    'game',
    'gameRuler',
    'model',
    'gameModels',
    'gameModelSelection',
    'prompt',
    rulerModeServiceFactory
  ])
  .factory('createModelMode', [
    'modes',
    'commonMode',
    'game',
    createModelModeServiceFactory
  ])
  .factory('modelsMode', [
    'modes',
    'settings',
    'defaultMode',
    'model',
    'game',
    'gameModels',
    'gameModelSelection',
    'prompt',
    modelsModeServiceFactory
  ])
  .factory('modelMode', [
    'modes',
    'settings',
    'modelsMode',
    'model',
    'game',
    'gameModels',
    'gameModelSelection',
    modelModeServiceFactory
  ])
  .factory('createTemplateMode', [
    'modes',
    'commonMode',
    'game',
    createTemplateModeServiceFactory
  ])
  .factory('templateLockedMode', [
    'modes',
    'settings',
    'defaultMode',
    'game',
    'gameTemplates',
    'gameTemplateSelection',
    templateLockedModeServiceFactory
  ])
  .factory('aoeTemplateLockedMode', [
    'modes',
    'settings',
    'templateLockedMode',
    'game',
    'gameTemplates',
    'gameTemplateSelection',
    'gameRuler',
    'prompt',
    aoeTemplateModeServiceFactory(true)
  ])
  .factory('sprayTemplateLockedMode', [
    'modes',
    'settings',
    'templateLockedMode',
    'game',
    'gameTemplateSelection',
    sprayTemplateModeServiceFactory
  ])
  .factory('wallTemplateLockedMode', [
    'modes',
    'settings',
    'templateLockedMode',
    'game',
    'gameTemplateSelection',
    wallTemplateModeServiceFactory
  ])
  .factory('templateMode', [
    'modes',
    'settings',
    'defaultMode',
    'templateLockedMode',
    'template',
    'game',
    'gameTemplates',
    'gameTemplateSelection',
    templateModeServiceFactory
  ])
  .factory('aoeTemplateMode', [
    'modes',
    'settings',
    'templateMode',
    'game',
    'gameTemplates',
    'gameTemplateSelection',
    'gameRuler',
    'prompt',
    aoeTemplateModeServiceFactory(false)
  ])
  .factory('sprayTemplateMode', [
    'modes',
    'settings',
    'templateMode',
    'game',
    'gameTemplateSelection',
    sprayTemplateModeServiceFactory
  ])
  .factory('wallTemplateMode', [
    'modes',
    'settings',
    'templateMode',
    'game',
    'gameTemplateSelection',
    wallTemplateModeServiceFactory
  ])
  .factory('allModes', [
    'defaultMode',
    'rulerMode',
    'createModelMode',
    'modelsMode',
    'modelMode',
    'createTemplateMode',
    'aoeTemplateLockedMode',
    'sprayTemplateLockedMode',
    'wallTemplateLockedMode',
    'templateMode',
    'aoeTemplateMode',
    'sprayTemplateMode',
    'wallTemplateMode',
    function() { return {}; }
  ])
  .factory('http', [
    httpServiceFactory
  ])
  .factory('gameBoard', [
    'http',
    gameBoardServiceFactory
  ])
  .factory('gameFactions', [
    'http',
    gameFactionsServiceFactory
  ])
  .factory('gameMap', [
    'gameModels',
    'gameTemplates',
    gameMapServiceFactory
  ])
  .factory('gameScenario', [
    'http',
    gameScenarioServiceFactory
  ])
  .factory('gameRuler', [
    'point',
    'model',
    'gameModels',
    gameRulerServiceFactory
  ])
  .factory('gameTemplates', [
    'template',
    gameTemplatesServiceFactory
  ])
  .factory('gameTemplateSelection', [
    'modes',
    'gameTemplates',
    gameTemplateSelectionServiceFactory
  ])
  .factory('gameModels', [
    'model',
    gameModelsServiceFactory
  ])
  .factory('gameModelSelection', [
    'modes',
    'gameModels',
    gameModelSelectionServiceFactory
  ])
  .factory('commands', [
    commandsServiceFactory
  ])
  .factory('createModelCommand', [
    'commands',
    'model',
    'gameModels',
    'gameModelSelection',
    createModelCommandServiceFactory
  ])
  .factory('deleteModelCommand', [
    'commands',
    'model',
    'gameModels',
    'gameModelSelection',
    deleteModelCommandServiceFactory
  ])
  .factory('setModelSelectionCommand', [
    'commands',
    'gameModelSelection',
    setModelSelectionCommandServiceFactory
  ])
  .factory('onModelsCommand', [
    'commands',
    'model',
    'gameModels',
    'gameModelSelection',
    onModelsCommandServiceFactory
  ])
  .factory('createTemplateCommand', [
    'commands',
    'template',
    'gameTemplates',
    'gameTemplateSelection',
    createTemplateCommandServiceFactory
  ])
  .factory('deleteTemplatesCommand', [
    'commands',
    'template',
    'gameTemplates',
    'gameTemplateSelection',
    deleteTemplatesCommandServiceFactory
  ])
  .factory('lockTemplatesCommand', [
    'commands',
    'gameTemplates',
    'gameTemplateSelection',
    lockTemplatesCommandServiceFactory
  ])
  .factory('onTemplatesCommand', [
    'commands',
    'template',
    'gameTemplates',
    'gameTemplateSelection',
    onTemplatesCommandServiceFactory
  ])
  .factory('rollDiceCommand', [
    'commands',
    rollDiceCommandServiceFactory
  ])
  .factory('rollDeviationCommand', [
    'commands',
    rollDeviationCommandServiceFactory
  ])
  .factory('setBoardCommand', [
    'commands',
    setBoardCommandServiceFactory
  ])
  .factory('setRulerCommand', [
    'commands',
    'gameRuler',
    setRulerCommandServiceFactory
  ])
  .factory('setScenarioCommand', [
    'commands',
    setScenarioCommandServiceFactory
  ])
  .factory('allCommands', [
    'createModelCommand',
    'deleteModelCommand',
    'setModelSelectionCommand',
    'onModelsCommand',
    'createTemplateCommand',
    'deleteTemplatesCommand',
    'lockTemplatesCommand',
    'onTemplatesCommand',
    'rollDiceCommand',
    'rollDeviationCommand',
    'setBoardCommand',
    'setRulerCommand',
    'setScenarioCommand',
    function() { return {}; }
  ])
  .factory('model', [
    'settings',
    'point',
    'gameFactions',
    modelServiceFactory
  ])
  .factory('template', [
    'settings',
    'point',
    templateServiceFactory
  ])
  .factory('aoeTemplate', [
    'template',
    'point',
    aoeTemplateServiceFactory
  ])
  .factory('sprayTemplate', [
    'template',
    sprayTemplateServiceFactory
  ])
  .factory('wallTemplate', [
    'template',
    wallTemplateServiceFactory
  ])
  .factory('allTemplates', [
    'aoeTemplate',
    'sprayTemplate',
    'wallTemplate',
    function() { return {}; }
  ]);

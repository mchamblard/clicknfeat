'use strict';

self.gameTemplatesServiceFactory = function gameTemplatesServiceFactory(templateService) {
  var gameTemplatesService = {
    create: function() {
      return {
        active: [],
        locked: []
      };
    },
    findStamp: function templatesFindStamp(stamp, templates) {
      return (R.find(R.pathEq(['state','stamp'], stamp), templates.active) ||
              R.find(R.pathEq(['state','stamp'], stamp), templates.locked));
    },
    onStamp: function templatesFindStamp(stamp, method /*, ...args..., templates*/) {
      var args = Array.prototype.slice.call(arguments);
      var templates = R.last(args);
      var template = gameTemplatesService.findStamp(stamp, templates);
      // console.log(arguments, templates, template);
      args = R.append(template, R.slice(1, -1, args));
      return templateService.call.apply(null, args);
    },
    add: function templatesAdd(template, templates) {
      return R.assoc('active', R.pipe(
        R.reject(R.pathEq(['state','stamp'], template.state.stamp)),
        R.append(template)
      )(templates.active), templates);
    },
    removeStamp: function templatesRemove(stamp, templates) {
      return R.pipe(
        R.assoc('active', R.reject(R.pathEq(['state','stamp'], stamp), templates.active)),
        R.assoc('locked', R.reject(R.pathEq(['state','stamp'], stamp), templates.locked))
      )(templates);
    },
    isActive: function templatesIsLocked(stamp, templates) {
      return R.find(R.pathEq(['state','stamp'], stamp), templates.active);
    },
    isLocked: function templatesIsLocked(stamp, templates) {
      return R.find(R.pathEq(['state','stamp'], stamp), templates.locked);
    },
    lockStamps: function templatesLockStamps(stamps, templates) {
      var temps = R.map(function(stamp) {
        return gameTemplatesService.findStamp(stamp, templates);
      }, stamps);
      return R.pipe(
        R.assoc('active', R.reject(function(template) {
          return R.find(R.eq(template.state.stamp), stamps);
        }, templates.active)),
        R.assoc('locked', R.reject(function(template) {
          return R.find(R.eq(template.state.stamp), stamps);
        }, templates.locked)),
        function (templates) {
          return R.assoc('locked', R.concat(templates.locked, temps), templates);
        }
      )(templates);
    },
    unlockStamps: function templatesUnlockStamps(stamps, templates) {
      var temps = R.map(function(stamp) {
        return gameTemplatesService.findStamp(stamp, templates);
      }, stamps);
      return R.pipe(
        R.assoc('active', R.reject(function(template) {
          return R.find(R.eq(template.state.stamp), stamps);
        }, templates.active)),
        R.assoc('locked', R.reject(function(template) {
          return R.find(R.eq(template.state.stamp), stamps);
        }, templates.locked)),
        function (templates) {
          return R.assoc('active', R.concat(templates.active, temps), templates);
        }
      )(templates);
    },
    modeForStamp: function templateSelectionModeForStamp(stamp, templates) {
      var mode = (gameTemplatesService.isLocked(stamp, templates) ?
                  'TemplateLocked' : 'Template');
      var type = R.defaultTo('aoe',
                             R.path(['state','type'],
                                    gameTemplatesService.findStamp(stamp, templates)
                                   )
                            );
      return type+mode;
    },
  };
  R.curryService(gameTemplatesService);
  return gameTemplatesService;
};

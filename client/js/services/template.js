'use strict';

self.aoeTemplateServiceFactory = function aoeTemplateServiceFactory(templateService,
                                                                    pointService) {
  var aoeTemplateService = Object.create(templateService);
  aoeTemplateService.create = function aoeTemplateCreate(temp) {    
    temp.state = R.assoc('s', 15, temp.state);
    return temp;
  };
  aoeTemplateService.setSize = function aoeTemplateSetSize(size, temp) {
    if(R.isNil(R.find(R.eq(size), [3,4,5]))) return;
    temp.state = R.assoc('s', size * 5, temp.state);
  };
  aoeTemplateService.deviate = function aoeTemplateDeviate(dir, len, temp) {
    dir = temp.state.r + 60 * (dir-1);
    var max_len = R.defaultTo(len, R.path(['state','m'], temp));
    len = Math.min(len, max_len);
    temp.state = pointService.translateInDirection(len * 10, dir,
                                                   temp.state);
    temp.state = R.assoc('r', dir, temp.state);
    templateService.checkState(temp.state);
  };
  aoeTemplateService.maxDeviation = function aoeTemplateMaxDeviation(temp) {
    return R.defaultTo(0, R.path(['state','m'], temp));
  };
  aoeTemplateService.setMaxDeviation = function aoeTemplateSetMaxDeviation(max, temp) {
    temp.state = R.assoc('m', max, temp.state);
  };
  aoeTemplateService.setToRuler = function aoeTemplateSetToRuler(pos, temp) {
    temp.state = R.pipe(
      R.assoc('x', pos.x),
      R.assoc('y', pos.y),
      R.assoc('r', pos.r),
      R.assoc('m', pos.m),
      templateService.checkState
    )(temp.state);
  };
  templateService.registerTemplate('aoe', aoeTemplateService);
  return aoeTemplateService;
};

self.wallTemplateServiceFactory = function wallTemplateServiceFactory(templateService) {
  var wallTemplateService = Object.create(templateService);
  wallTemplateService.create = function wallTemplateCreate(temp) {    
    return temp;
  };
  templateService.registerTemplate('wall', wallTemplateService);
  return wallTemplateService;
};

self.sprayTemplateServiceFactory = function sprayTemplateServiceFactory(templateService) {
  var sprayTemplateService = Object.create(templateService);
  sprayTemplateService.create = function sprayTemplateCreate(temp) {    
    temp.state = R.assoc('s', 6, temp.state);
    return temp;
  };
  sprayTemplateService.setSize = function sprayTemplateSetSize(size, temp) {
    if(R.isNil(R.find(R.eq(size), [6,8,10]))) return;
    temp.state = R.assoc('s', size, temp.state);
  };
  templateService.registerTemplate('spray', sprayTemplateService);
  return sprayTemplateService;
};

self.templateServiceFactory = function templateServiceFactory(settingsService,
                                                              pointService) {
  var TEMP_REGS = {};
  var DEFAULT_MOVES = {
    Move: 10,
    MoveSmall: 1,
    Rotate: 60,
    RotateSmall: 6,
    Shift: 10,
    ShiftSmall: 1,
  };
  var MOVES = R.clone(DEFAULT_MOVES);
  settingsService.register('Moves',
                           'Template',
                           DEFAULT_MOVES,
                           function(moves) {
                             R.extend(MOVES, moves);
                           });
  var templateService = {
    registerTemplate: function templateRegister(type, service) {
      TEMP_REGS[type] = service;
    },
    create: function templateCreate(temp) {
      if(R.isNil(TEMP_REGS[temp.type])) {
        console.log('create unknown template type '+temp.type);
        return;
      }
      var template = {
        state: {
          type: temp.type,
          x: 0,
          y: 0,
          r: 0,
          l: [],
          stamp: R.guid()
        }
      };
      template = TEMP_REGS[temp.type].create(template);
      template.state = R.deepExtend(template.state, temp);
      return template;
    },
    state: function templateState(template) {
      return R.prop('state', template);
    },
    saveState: function templateSaveState(template) {
      return R.clone(R.prop('state', template));
    },
    setState: function templateSetState(state, template) {
      template.state = R.clone(state);
    },
    respondTo: function templateAnswerTo(method, template) {
      return ( R.exists(TEMP_REGS[template.state.type]) &&
               R.exists(TEMP_REGS[template.state.type][method])
             );
    },
    call: function templateCall(method /* ...args..., template */) {
      var args = R.tail(Array.prototype.slice.call(arguments));
      var temp = R.last(args);
      console.log(method, args);
      if(!templateService.respondTo(method, temp)) {
        console.log('unknown call '+method+' on template type '+temp.state.type);
        return;
      }
      return TEMP_REGS[temp.state.type][method].apply(null, args);
    },
    checkState: function templateCheckState(state) {
      state.x = Math.max(0, Math.min(480, state.x));
      state.y = Math.max(0, Math.min(480, state.y));
      return state;
    },
    setPosition: function templateSet(pos, template) {
      template.state = R.pipe(
        R.assoc('x', pos.x),
        R.assoc('y', pos.y),
        templateService.checkState
      )(template.state);
    },
    moveFront: function templateMoveFront(small, template) {
      var dist = MOVES[small ? 'MoveSmall' : 'Move'];
      template.state = templateService
        .checkState(pointService.moveFront(dist, template.state));
    },
    moveBack: function templateMoveBack(small, template) {
      var dist = MOVES[small ? 'MoveSmall' : 'Move'];
      template.state = templateService
        .checkState(pointService.moveBack(dist, template.state));
    },
    rotateLeft: function templateRotateLeft(small, template) {
      var angle = MOVES[small ? 'RotateSmall' : 'Rotate'];
      template.state = templateService
        .checkState(pointService.rotateLeft(angle, template.state));
    },
    rotateRight: function templateRotateRight(small, template) {
      var angle = MOVES[small ? 'RotateSmall' : 'Rotate'];
      template.state = templateService
        .checkState(pointService.rotateRight(angle, template.state));
    },
    shiftLeft: function templateShiftLeft(small, template) {
      var dist = MOVES[small ? 'ShiftSmall' : 'Shift'];
      template.state = templateService
        .checkState(pointService.shiftLeft(dist, template.state));
    },
    shiftRight: function templateShiftRight(small, template) {
      var dist = MOVES[small ? 'ShiftSmall' : 'Shift'];
      template.state = templateService
        .checkState(pointService.shiftRight(dist, template.state));
    },
    shiftUp: function templateShiftUp(small, template) {
      var dist = MOVES[small ? 'ShiftSmall' : 'Shift'];
      template.state = templateService
        .checkState(pointService.shiftUp(dist, template.state));
    },
    shiftDown: function templateShiftDown(small, template) {
      var dist = MOVES[small ? 'ShiftSmall' : 'Shift'];
      template.state = templateService
        .checkState(pointService.shiftDown(dist, template.state));
    },
    eventName: function templateEventName(template) {
      return R.path(['state','stamp'], template);
    },
    addLabel: function templateAddLabel(label, template) {
      template.state.l = R.uniq(R.append(label, template.state.l));
    },
    removeLabel: function templateRemoveLabel(label, template) {
      template.state.l = R.reject(R.eq(label), template.state.l);
    },
    fullLabel: function templateFullLabel(template) {
      return template.state.l.join(' ');
    },
  };
  R.curryService(templateService);
  return templateService;
};

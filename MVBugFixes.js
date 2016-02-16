/*:
 * @plugindesc Bug fixes for RPG Maker MV - version 1.1
 * @author  Originally Hudell, Zalerinian, Ramiro, Dekita
 *
 * @help
 * Check out mvplugins.com for new plugins for Rpg Maker MV
 * http://mvplugins.com
 *=============================================================================*/

//Fixes the issue of parallax images never refreshing. 
(function(){
  var oldTillingSprite_onBitmapLoad = TilingSprite.prototype._onBitmapLoad;
  TilingSprite.prototype._onBitmapLoad = function() {
    oldTillingSprite_onBitmapLoad.call(this);
    this.texture.baseTexture.dirty();
  };
})();

//Fixes the problem where the game would crash if the user saved while a common event was running the "show balloon icon" command

(function(){
  var needsToChangeVersion = false;

  DataManager.saveGameWithoutRescue = function(savefileId) {
    needsToChangeVersion = false;
    var contents = this.makeSaveContents();
    var json = JsonEx.stringify(contents);

    if (needsToChangeVersion) {
      contents.map._events = [];
      contents.system._versionId = 0;
      json = JsonEx.stringify(contents);
    }

    if (json.length >= 200000) {
      console.warn('Save data too big!');
    }
    StorageManager.save(savefileId, json);
    this._lastAccessedId = savefileId;
    var globalInfo = this.loadGlobalInfo() || [];
    globalInfo[savefileId] = this.makeSavefileInfo();
    this.saveGlobalInfo(globalInfo);
    return true;
  };

  JsonEx._encode = function(value, depth) {
    depth = depth || 0;
    if (++depth >= this.maxDepth) {
      throw new Error('Object too deep');
    }
    var type = Object.prototype.toString.call(value);
    if (type === '[object Object]' || type === '[object Array]') {
      var constructorName = this._getConstructorName(value);
      if (constructorName !== 'Object' && constructorName !== 'Array') {
        value['@'] = constructorName;
      }
      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          if (constructorName == 'Game_Event' && value[key] instanceof Game_Interpreter) {
            needsToChangeVersion = true;
            delete value[key]
          } else {
            value[key] = this._encode(value[key], depth + 1);
          }
        }
      }
    }
    depth--;
    return value;
  };
})();

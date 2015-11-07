/*:
 * @plugindesc Bug fixes for RPG Maker MV - version 1.0
 * @author  Originally Hudell, Zalerinian, Ramiro, Dekita
 *
 * @help
 * Check out mvplugins.com for new plugins for Rpg Maker MV
 * http://mvplugins.com
 *=============================================================================*/

//Fixes the issue of parallax images never refreshing. 
var oldTillingSprite_onBitmapLoad = TilingSprite.prototype._onBitmapLoad;
TilingSprite.prototype._onBitmapLoad = function() {
  oldTillingSprite_onBitmapLoad.call(this);
  this.texture.baseTexture.dirty();
};

/**
 * @fileoverview 
 * @author 常胤<changyin@taobao.com>
 * @module datalazyload
 **/
KISSY.add(function (S, Node, Lang) {
    var $ = Node.all,
        EventTarget = S.Event.Target;
    /**
     *
     * @class Datalazyload
     * @constructor
     */
    function Datalazyload(config) {

    }

    S.augment(Datalazyload, EventTarget, /** @lends Datalazyload.prototype*/{

    });

    return Datalazyload;

}, {requires:['node', 'lang']});




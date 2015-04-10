define(["jquery", "app/formbackup"], function ($, FormBackup) {
    $.fn.formBackup = function (options) {
        var settings = $.extend({
            beforeRestore: null,
            afterRestore: null
        }, options);

        return this.each (function () {
            new FormBackup(this, settings);
        });

        return this;
    };

});

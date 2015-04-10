/*!
 * formbackup.js
 *
 * Author: Levi Jackson http://www.levijackson.net
 *
 * Licensed under MIT
 * http://www.opensource.org/licenses/mit-license.php
 *
 *
 * Version : 0.1
 *
 *
 * Backup form values in the event you need to repopulate the form
 */

define([], function () {
    function FormBackup (form, options) {
        var self = this;

        this.form = form;
        this.window = (options && options.window) || window;
        this.document = (options && options.document) || document;
        this.storage = (options && options.storage) || localStorage;
        this.backupName = form.getAttribute("id") || "backupForm";
        this.beforeRestore = options && options.beforeRestore;
        this.afterRestore = options && options.afterRestore;
        this.beforeSave = options && options.beforeSave;
        this.afterSave = options && options.afterSave;
        this.values = {};

        this.save = function () {
            var process = true;

            if (this.beforeSave && typeof(this.beforeSave) == "function") {
                // must return true if you want it to continue onward
                if (!this.beforeSave()) {
                    process = false;
                }
            }

            if (process) {
                this.getInputValues();
                this.getSelectValues();    
                this.getTextareaValues(); 

                this.storage.setItem(self.backupName, JSON.stringify(this.values));

                if (this.afterSave && typeof(this.afterSave) == "function") {
                    return this.afterSave();
                }
            }
        },
        this.getInputValues = function (values) {
            var inputs = self.form.getElementsByTagName("input");

            for (var i = 0; i < inputs.length; i++) {
                if (
                    (inputs[i].type == "text" && inputs[i].value != "" && inputs[i].name != "") ||
                    (inputs[i].type == "radio" && inputs[i].checked) ||
                    (inputs[i].type == "checkbox" && inputs[i].checked)
                ) {
                    this.values[inputs[i].name] = inputs[i].value;
                }
            }
        },
        this.getSelectValues = function (values) {
            var selects = self.form.getElementsByTagName("select");

            for (var i = 0; i < selects.length; i++) {
                if (selects[i].type == "select-one" && selects[i].selectedIndex > 0 && selects[i].options[selects[i].selectedIndex].value != "") {
                    this.values[selects[i].name] = selects[i].value;
                } else if (selects[i].type == "select-multiple") {
                    var selectOptions = selects[i].options;
                    for (var j = 0; j < selectOptions.length; j++) {
                        if (selectOptions[j].selected) {
                            if (!this.values[selects[i].name]) {
                                this.values[selects[i].name] = [];
                            }
                            this.values[selects[i].name].push(selectOptions[j].value);
                        }
                    }
                }
            }
        },
        this.getTextareaValues = function (values) {
            var textareas = self.form.getElementsByTagName("textarea");

            for (var i = 0; i < textareas.length; i++) {
                if (textareas[i].value != "") {
                    this.values[textareas[i].name] = textareas[i].value;
                }
            }
        },
        this.restore = function () {
            if (this.beforeRestore && typeof(this.beforeRestore) == "function") {
                // must return true if you want it to continue onward
                if (!this.beforeRestore()) {
                    return false;
                }
            }

            var backupValues = this.storage.getItem(this.backupName);
            if (!backupValues) {
                return false;
            }

            this.values = JSON.parse(backupValues);
            if (this.values.length <= 0) {
                return false;
            }

            for (var name in this.values) {
                var elements = self.document.getElementsByName(name);

                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].type == "radio" && elements[i].value == this.values[name]) {
                        elements[i].checked = true;
                    } else if (elements[i].type == "checkbox" && elements[i].value == this.values[name]) {
                        elements[i].checked = true;
                    } else if (elements[i].type == "select-one") {
                        var selectOptions = elements[i].options;
                        for (var j = 0; j < selectOptions.length; j++) {
                            if (selectOptions[j].value == this.values[name]) {
                                elements[i].selectedIndex = j;
                                break;
                            }
                        }
                    } else if (elements[i].type == "select-multiple") {
                        var selectOptions = elements[i].options;
                        for (var j = 0; j < this.values[name].length; j++) {
                            for (var n = 0; n < selectOptions.length; n++) {
                                if (selectOptions[n].value == this.values[name][j]) {
                                    elements[i].options[n].selected = true;
                                    break;
                                }
                            }
                        }
                    } else if (elements[i].type == "text" || elements[i].type == "textarea") {
                        elements[i].value = this.values[name];
                    }
                }

                if (this.afterRestore && typeof(this.afterRestore) == "function") {
                    this.afterRestore();
                }
            }
        }

        this.restore();

        this.window.onbeforeunload = function () {
            return self.save();
        };
    };

    return FormBackup;
});

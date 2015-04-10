define([
    "intern!object",
    "intern/chai!assert",
    "mocks/mockWindow",
    "mocks/mockDocument",
    "mocks/mockStorage",
    "mocks/mockForm",
    "../app/formbackup"
], function (registerSuite, assert, mockWindow, mockDocument, mockStorage, mockForm, FormBackup) {
    registerSuite({
        beforeEach: function () {
            mockStorage.data = {};
            mockForm.elementsData = {};
        },
        "test initialize defaults": function () {
            var backup = new FormBackup(mockForm, {"window": mockWindow, "document": mockDocument, "storage": mockStorage});
            assert.equal("mockForm", backup.backupName, "Form name is not there");
        },
        "test initialize before restore positive": function () {
            var backup = new FormBackup(mockForm, {
                beforeRestore: function () {
                    return true;
                },
                "window": mockWindow,
                "document": mockDocument,
                "storage": mockStorage
            });
            assert.equal(true, backup.beforeRestore(), "Before restore failed");
        },
        "test initialize before restore negative": function () {
            var backup = new FormBackup(mockForm, {
                beforeRestore: function () {
                    return false;
                },
                "window": mockWindow,
                "document": mockDocument,
                "storage": mockStorage
            });
            assert.equal(false, backup.beforeRestore(), "Before restore failed");
        },
        "test initialize after restore": function () {
            var backup = new FormBackup(mockForm, {
                afterRestore: function () {
                    return "bar";
                },
                "window": mockWindow,
                "document": mockDocument,
                "storage": mockStorage
            });
            assert.equal("bar", backup.afterRestore(), "After restore failed");
        },
        "test save input": function () {
            mockForm.elementsData = {
                "input": [
                    {name: "field1", type: "text", value: "foo"},
                    {name: "field2", type: "text", value: "bar"},
                    {name: "field3", type: "radio", value: "baz", checked: false},
                    {name: "field4", type: "radio", value: "faz", checked: true},
                    {name: "field5", type: "checkbox", value: "zab", checked: true},
                    {name: "field6", type: "checkbox", value: "oof", checked: false},
                    {name: "field7[]", type: "checkbox", value: "abc", checked: true},
                    {name: "field7[]", type: "checkbox", value: "def", checked: false}
                ]
            };

            var backup = new FormBackup(mockForm, {"window": mockWindow, "document": mockDocument, "storage": mockStorage});
            backup.save();
            
            var expectedInputs = {
                "field1": "foo",
                "field2": "bar",
                "field4": "faz",
                "field5": "zab",
                "field7[]": "abc"
            };

            assert.deepEqual(expectedInputs, backup.values, "Parsed inputs failed");
        },
        "test save select": function () {
            mockForm.elementsData = {
                "select": [
                    {name: "field1", type: "select-one", selectedIndex: 0, value: "foo", options: ["foo"]},
                    {name: "field2", type: "select-one", selectedIndex: 1, value: "baz", options: ["bar", "baz"]},
                    {name: "field3[]", type: "select-multiple", options:[{value: "bar", selected: false}, {value: "foo", selected: true}, {value: "baz", selected: true}]},
                    {name: "field4[]", type: "select-multiple", options:[{value: "bar", selected: false}, {value: "foo", selected: false}, {value: "baz", selected: false}]}
                ]
            };

            var backup = new FormBackup(mockForm, {"window": mockWindow, "document": mockDocument, "storage": mockStorage});
            backup.save();
            
            var expectedSelects = {
                "field2": "baz",
                "field3[]": ["foo", "baz"]
            };

            assert.deepEqual(expectedSelects, backup.values, "Parsed selects failed");
        },
        "test save textareas": function () {
            mockForm.elementsData = {
                "textarea": [
                    {name: "field1", type: "textarea", value: "foo"},
                    {name: "field2", type: "textarea", value: "bar"}                
                ]
            };

            var backup = new FormBackup(mockForm, {"window": mockWindow, "document": mockDocument, "storage": mockStorage});
            backup.save();
            
            var expectedSelects = {
                "field1": "foo",
                "field2": "bar"
            };

            assert.deepEqual(expectedSelects, backup.values, "Parsed textareas failed");
        },
        "test save backup": function () {
            mockForm.elementsData = {
                "input": [
                    {name: "field1", type: "text", value: "foo"},
                    {name: "field2", type: "text", value: "bar"},
                    {name: "field3", type: "radio", value: "baz", checked: false},
                    {name: "field4", type: "radio", value: "faz", checked: true},
                    {name: "field5", type: "checkbox", value: "zab", checked: true},
                    {name: "field6", type: "checkbox", value: "oof", checked: false},
                    {name: "field7[]", type: "checkbox", value: "abc", checked: true},
                    {name: "field7[]", type: "checkbox", value: "def", checked: false}
                ],
                "select": [
                    {name: "field8", type: "select-one", selectedIndex: 0, value: "foo", options: ["foo"]},
                    {name: "field9", type: "select-one", selectedIndex: 1, value: "baz", options: ["bar", "baz"]},
                    {name: "field10[]", type: "select-multiple", options:[{value: "bar", selected: false}, {value: "foo", selected: true}, {value: "baz", selected: true}]},
                    {name: "field11[]", type: "select-multiple", options:[{value: "bar", selected: false}, {value: "foo", selected: false}, {value: "baz", selected: false}]}
                ]
            };

            var backup = new FormBackup(mockForm, {"window": mockWindow, "document": mockDocument, "storage": mockStorage});
            backup.save();
            
            var expected = {
                "field1": "foo",
                "field2": "bar",
                "field4": "faz",
                "field5": "zab",
                "field7[]": "abc",
                "field9": "baz",
                "field10[]": ["foo", "baz"]
            };

            assert.deepEqual(expected, backup.values, "Parsed selects failed");

            var backupData = backup.storage.getItem("mockForm");
            assert.deepEqual(JSON.stringify(expected), backupData, "Stored data does not match");
        },
        "test after save callback": function () {
            var backup = new FormBackup(mockForm, {
                "window": mockWindow,
                "document": mockDocument,
                "storage": mockStorage,
                afterSave: function () {
                    return "foo bar";
                }
            });
            assert.equal("foo bar", backup.save());
        },
        "test before save callback positive": function () {
            mockForm.elementsData = {
                "input": [
                    {name: "field1", type: "text", value: "foo"},
                    {name: "field2", type: "text", value: "bar"},
                    {name: "field3", type: "radio", value: "baz", checked: false},
                    {name: "field4", type: "radio", value: "faz", checked: true},
                    {name: "field5", type: "checkbox", value: "zab", checked: true},
                    {name: "field6", type: "checkbox", value: "oof", checked: false},
                    {name: "field7[]", type: "checkbox", value: "abc", checked: true},
                    {name: "field7[]", type: "checkbox", value: "def", checked: false}
                ]
            };

            var backup = new FormBackup(mockForm, {
                "window": mockWindow,
                "document": mockDocument,
                "storage": mockStorage,
                beforeSave: function () {
                    return true;
                }
            });
            
            var expectedInputs = {
                "field1": "foo",
                "field2": "bar",
                "field4": "faz",
                "field5": "zab",
                "field7[]": "abc"
            };

            assert.equal(undefined, backup.save());
            assert.deepEqual(expectedInputs, backup.values, "Parsed inputs failed");
        },
        "test before save callback negative": function () {
            mockForm.elementsData = {
                "input": [
                    {name: "field1", type: "text", value: "foo"},
                    {name: "field2", type: "text", value: "bar"},
                    {name: "field3", type: "radio", value: "baz", checked: false},
                    {name: "field4", type: "radio", value: "faz", checked: true},
                    {name: "field5", type: "checkbox", value: "zab", checked: true},
                    {name: "field6", type: "checkbox", value: "oof", checked: false},
                    {name: "field7[]", type: "checkbox", value: "abc", checked: true},
                    {name: "field7[]", type: "checkbox", value: "def", checked: false}
                ]
            };

            var backup = new FormBackup(mockForm, {
                "window": mockWindow,
                "document": mockDocument,
                "storage": mockStorage,
                beforeSave: function () {
                    return false;
                }
            });

            assert.equal(undefined, backup.save());
            assert.deepEqual({}, backup.values, "Parsed inputs failed");
        }
        /*,
        "test restore textarea": function () {
            // Need to populate the mockForm.elementsData array so it can "find" elements.
            // Then confirm that the properties are accurate for the element type
            mockStorage.data = {
                "mockForm": [
                    JSON.stringify({
                        "name": "field1",
                        "type": "textarea",
                        "value": "foo"
                    })
                ]
            };
            mockForm.elementsData = {
                "field1": [{name: "field1", type: "textarea"}]
            };

            var backup = new FormBackup(mockForm, {"window": mockWindow, "document": mockDocument, "storage": mockStorage});

            console.log(mockForm.elementsData);
        }
        */
    });
});
define([], function () {
    var mockForm = {
        elementsData: {},
        getAttribute: function (key) {
            return 'mockForm';
        },
        getElementsByTagName: function (key) {
            return this.elementsData[key] || [];
        },
        getElementsByName: function (key) {
            return this.elementsData[key] || [];
        }
    };

    return mockForm;
});
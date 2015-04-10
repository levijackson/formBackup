define([], function () {
    var mockDocument = {
        elementsData: {},
        getElementsByName: function (key) {
            return this.elementsData[key] || [];
        }
    };

    return mockDocument;
});
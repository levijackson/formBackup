define([], function () {
    var mockStorage = {
        data: {},
        setItem: function (key, value) {
            this.data[key] = value;
        },
        getItem: function (key) {
            return this.data[key];
        }
    };

    return mockStorage;
});
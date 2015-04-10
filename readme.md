formBackup Version 0.1
=============

formBackup uses localStorage to backup the values from your form in the event the user leaves the page accidentally. 

Usage
-------
###With jQuery:
```javascript
require.config({
    paths: {
        'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min'
    }
});

require(["jquery", "app/jquery.formbackup"], function ($) {
    $('#formSelector').formBackup();
});
```

###Without jQuery
```javascript
require(["app/formbackup"], function (FormBackup) {
    var backupForm = document.getElementById("FormSelector");
    var backup =  new FormBackup(backupForm);
});
```

Options
-------
| Name      | Default |
| --------- |:-------:|
| window      | window |
| document      | document |
| storage      | storage |
| beforeRestore      | null |
| afterRestore      | null |


##Examples

###Using a different storage medium
If you want to use a different storage medium you can create a wrapper object around it that implements the same interface localStorage users.
```
var storageObject = {
    data: {},
    setItem: function (key, value) {
        this.data[key] = value;
    },
    getItem: function (key) {
        return this.data[key];
    } 
};

require(["jquery", "app/jquery.formbackup"], function ($) {
    $('#formSelector').formBackup({
        "storage": new storageObject()
    });
});
```

### Cancel form saving
```
require(["jquery", "app/jquery.formbackup"], function ($) {
    $('#formBackup').formBackup({
        beforeSave: function () {
            return false;
        }
    });
});
```

###Prompt user to confirm before leaving the page
```
require(["jquery", "app/jquery.formbackup"], function ($) {
    $('#formBackup').formBackup({
        afterSave: function () {
            return "Are you sure you want to leave?";
        }
    });
});
```

###Prompt user before restoring
```
require(["jquery", "app/jquery.formbackup"], function ($) {
    $('#formBackup').formBackup({
        beforeRestore: function () {
            return confirm("Restore form values?");
        }
    });
});
```

###Notify user after restore finishes
```
require(["jquery", "app/jquery.formbackup"], function ($) {
    $('#formBackup').formBackup({
        afterRestore: function () {
            alert("The form values have been restored!");
        }
    });
});
```

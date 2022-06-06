module.exports = function (browser) {
    let extension = {};
    extension.id = browser.md5(__filename);
    extension.name = 'Akwam Site Manager';
    extension.description = 'Scrap Movies & Series';
    extension.paid = false;
    extension.version = '1.0.0';
    extension.canDelete = true;
    extension.init = () => {};
    extension.enable = () => {
        browser.addPreload({
            id: extension.id,
            path: browser.path.join(__dirname, 'preload.js'),
        });

        browser.api.onGET({
            name: '/extentions/akwam/manager',
            path: browser.path.join(__dirname, 'index.html'),
            parser: 'html css js',
        });

        browser.api.onGET('/extentions/akwam/api/info', (req, res) => {
            res.json({
                dir: __dirname,
            });
        });

        // browser.createChildProcess({
        //   windowType: 'popup',
        //   url: 'http://127.0.0.1:60080/extentions/akwam',
        // });
    };

    extension.disable = () => {
        browser.removePreload(extension.id);
    };

    extension.remove = () => {
        extension.disable();
    };
    return extension;
};

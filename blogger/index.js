module.exports = function (browser) {
    let extension = {};
    extension.id = browser.md5(__filename);
    extension.name = 'Blogger Manager';
    extension.description = 'Add Posts';
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
            name: '/extentions/blogger/manager',
            path: browser.path.join(__dirname, 'index.html'),
            parser: 'html css js',
        });

        browser.api.onGET('/extentions/blogger/api/info', (req, res) => {
            res.json({
                dir: __dirname,
            });
        });
    };

    extension.disable = () => {
        browser.removePreload(extension.id);

        browser.api.routing.list.forEach((route, i) => {
            if (route.name === '/extentions/blogger/manager' || route.name === '/extentions/blogger/api/info') {
                browser.api.routing.list.splice(i, 1);
            }
        });
    };

    extension.remove = () => {
        extension.disable();
    };
    return extension;
};

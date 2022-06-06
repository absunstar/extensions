module.exports = function (browser) {
    let extension = {};
    extension.id = browser.md5(__filename);
    extension.name = 'Adsl Egypt Manager';
    extension.description = 'Check Avaliablity Phones Numbers in Tele-comunecation Providers';
    extension.version = '1.0.0';
    extension.init = () => {};
    extension.enable = () => {
        browser.addPreload({
            id: extension.id,
            path: browser.path.join(__dirname, 'preload.js'),
        });

        browser.api.importApp(__dirname + '/phones');
    };

    extension.disable = () => {
        browser.removePreload(extension.id);
        browser.api.off('*phones*');
    };

    extension.remove = () => {
        extension.disable();
    };
    return extension;
};

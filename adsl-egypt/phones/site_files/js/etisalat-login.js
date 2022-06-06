SOCIALBROWSER.onLoad(() => {
    if (SOCIALBROWSER.phone123) {
        SOCIALBROWSER.phone = SOCIALBROWSER.showObject(SOCIALBROWSER.phone123);
    }
    if (SOCIALBROWSER.adslSetting123) {
        SOCIALBROWSER.adslSetting = SOCIALBROWSER.showObject(SOCIALBROWSER.adslSetting123);
    }

    if (document.location.href == SOCIALBROWSER.adslSetting.etisalat.loginURL && SOCIALBROWSER.adslSetting.etisalat.autoLogin) {
        SOCIALBROWSER.write(SOCIALBROWSER.adslSetting.etisalat.username, SOCIALBROWSER.adslSetting.etisalat.usernameSelector).then(() => {
            SOCIALBROWSER.write(SOCIALBROWSER.adslSetting.etisalat.password, SOCIALBROWSER.adslSetting.etisalat.passwordSelector).then(() => {
                SOCIALBROWSER.click(SOCIALBROWSER.adslSetting.etisalat.loginButtonSelector);
            });
        });
    }

    SOCIALBROWSER.share({
        type: 'etisalat-login',
        login: true,
    });
});

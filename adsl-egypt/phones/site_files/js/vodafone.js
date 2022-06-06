SOCIALBROWSER.onLoad(() => {
    SOCIALBROWSER.step2 = false;
    if (SOCIALBROWSER.phone123) {
        SOCIALBROWSER.phone = SOCIALBROWSER.showObject(SOCIALBROWSER.phone123);
    }
    if (SOCIALBROWSER.adslSetting123) {
        SOCIALBROWSER.adslSetting = SOCIALBROWSER.showObject(SOCIALBROWSER.adslSetting123);
    }

    if (SOCIALBROWSER.adslSetting && document.location.href == SOCIALBROWSER.adslSetting.vodafone.loginURL) {
        if (SOCIALBROWSER.adslSetting.vodafone.autoLogin) {
            SOCIALBROWSER.write(SOCIALBROWSER.adslSetting.vodafone.username, SOCIALBROWSER.adslSetting.vodafone.usernameSelector).then(() => {
                SOCIALBROWSER.write(SOCIALBROWSER.adslSetting.vodafone.password, SOCIALBROWSER.adslSetting.vodafone.passwordSelector).then(() => {
                    SOCIALBROWSER.write(SOCIALBROWSER.adslSetting.vodafone.pin, SOCIALBROWSER.adslSetting.vodafone.pinSelector).then(() => {
                        SOCIALBROWSER.click(SOCIALBROWSER.adslSetting.vodafone.loginButtonSelector);
                    });
                });
            });
        }
    }

    SOCIALBROWSER.checkLoginInterval = setInterval(() => {
        if (!SOCIALBROWSER.adslSetting) {
            return;
        }
        if (document.location.href == 'https://extranet.vodafone.com.eg/dealer/#/services') {
            document.location.href = SOCIALBROWSER.adslSetting.vodafone.logedURL;
        } else if (document.location.href == SOCIALBROWSER.adslSetting.vodafone.logedURL) {
            clearInterval(SOCIALBROWSER.checkLoginInterval);

            if (SOCIALBROWSER.phone) {
                SOCIALBROWSER.select(SOCIALBROWSER.adslSetting.vodafone.GovCodeSelector, SOCIALBROWSER.phone.govCode);
                SOCIALBROWSER.write(SOCIALBROWSER.phone.number, SOCIALBROWSER.adslSetting.vodafone.PhoneSelector).then(() => {
                    SOCIALBROWSER.click(SOCIALBROWSER.adslSetting.vodafone.NextButtonSelector);
                    SOCIALBROWSER.checkPhoneInterval = setInterval(() => {
                        if (!SOCIALBROWSER.step2 && (dom = SOCIALBROWSER.select(SOCIALBROWSER.adslSetting.vodafone.FirstFailSelector))) {
                            clearInterval(SOCIALBROWSER.checkPhoneInterval);
                            SOCIALBROWSER.phone.vodafone = {
                                status: 'False (1)',
                                error: dom.innerText,
                                date: Date.now(),
                            };
                            SOCIALBROWSER.share({
                                type: 'vodafone-login',
                                win_id: SOCIALBROWSER.currentWindow.id,
                                login: true,
                            });
                            SOCIALBROWSER.share({ type: 'check-vodafone-done', phone: SOCIALBROWSER.phone });
                            SOCIALBROWSER.currentWindow.close();
                        } else if (!SOCIALBROWSER.step2 && (dom = SOCIALBROWSER.select(SOCIALBROWSER.adslSetting.vodafone.NextButton2Selector))) {
                            SOCIALBROWSER.step2 = true;
                            dom.click();
                            SOCIALBROWSER.phone.vodafone = {
                                status: 'Waiting (2)',
                                error: dom.innerText,
                                date: Date.now(),
                            };
                            SOCIALBROWSER.share({ type: 'check-vodafone-done', phone: SOCIALBROWSER.phone });
                        } else {
                            if (!SOCIALBROWSER.step2) {
                                SOCIALBROWSER.share('Unknowing ...');
                            }
                        }
                    }, 1000);
                });
            } else {
                SOCIALBROWSER.share({
                    type: 'vodafone-login',
                    win_id: SOCIALBROWSER.currentWindow.id,
                    login: true,
                });
                SOCIALBROWSER.currentWindow.close();
            }
        }
    }, 1000 * 2);
});

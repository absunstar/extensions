function __document__ready__() {
    alert(' code_injected From Akwam Scraping  after loading  ...');
}
if (document.readyState !== 'loading') {
    __document__ready__();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        __document__ready__();
    });
}

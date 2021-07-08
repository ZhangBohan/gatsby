/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

exports.getUrlParams = () => {
    const data = {};
    console.log('window.location', window.location);
    window.location.search.substring(1).split('&').map(item => {
        const kv = item.split('=');
        data[kv[0]] = kv[1];
    })
    return data;
}
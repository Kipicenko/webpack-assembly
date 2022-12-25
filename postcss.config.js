module.exports = {
    plugins: [
        require('postcss-sort-media-queries')({
            sort: 'desktop-first'
        }),
    ]
}
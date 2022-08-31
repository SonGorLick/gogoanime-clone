const scapper = require('./anikatsu.js')
const express = require('express')
const { env } = require('process')
const cors = require('cors')

const app = express()
app.use(cors())

app.get('/', (req, res) => {
    res.send('API Currently Used By <a href="https://anikatsu.ga">AniKatsu</a>')
})

app.get('/getPopular/:page', async (req, res) => {
    const result = await scapper.popular(req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/vidcdn/:id', async (req, res) => {
    const result = await scapper.vidcdn(req.params.id)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/getNewSeason/:page', async (req, res) => {
    const result = await scapper.newSeason(req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/search/:query/:page', async (req, res) => {

    const result = await scapper.search(req.params.query, req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/getGenre/:genre/:page', async (req, res) => {

    const result = await scapper.scrapeGenre(req.params.genre, req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/getAnimeList/:aph/:page', async (req, res) => {

    const result = await scapper.animeList(req.params.aph, req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/getAnime/:query', async (req, res) => {

    const result = await scapper.anime(req.params.query)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/getRecentlyAdded/:page', async (req, res) => {

    const result = await scapper.recentlyAdded(req.params.query)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/getOngoingSeries', async (req, res) => {

    const result = await scapper.ongoingSeries(req.params.query)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/getEpisode/:query', async (req, res) => {

    const result = await scapper.watchAnime(req.params.query)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/getRecent/:type/:page', async (req, res) => {

    const result = await scapper.newReleases(req.params.type, req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/getSubCategory/:subCategory/:page', async (req, res) => {

    const result = await scapper.subCategories(req.params.subCategory, req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/getMovies/:page', async (req, res) => {

    const result = await scapper.animeMovie(req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/getOngoing/:page', async (req, res) => {

    const result = await scapper.ongoingAnime(req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/getCompleted/:page', async (req, res) => {

    const result = await scapper.completedAnime(req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/getAllAnime/:page', async (req, res) => {

    const result = await scapper.loadAllAnime(req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})


// Pagination 
// Search 
app.get('/searchPage/:query/:page', async (req, res) => {

    const result = await scapper.searchPagination(req.params.query, req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/popularPage/:page', async (req, res) => {

    const result = await scapper.popularPagination(req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})
app.get('/completedPage/:page', async (req, res) => {

    const result = await scapper.completedPagination(req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})
app.get('/ongoingPage/:page', async (req, res) => {

    const result = await scapper.ongoingPagination(req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/moviePage/:page', async (req, res) => {

    const result = await scapper.moviePagination(req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/subCategoryPage/:subCategory/:page', async (req, res) => {

    const result = await scapper.subCategoryPagination(req.params.subCategory, req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/getRecentPage/:type/:page', async (req, res) => {

    const result = await scapper.latestPage(req.params.type, req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/newSeaPage/:page', async (req, res) => {

    const result = await scapper.newSeaPage(req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})
app.get('/getGenrePage/:genre/:page', async (req, res) => {

    const result = await scapper.genrePage(req.params.genre, req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

app.get('/getAnimeListPage/:aph/:page', async (req, res) => {

    const result = await scapper.animelistPage(req.params.aph, req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})
app.get('/allAnimeListPage/:page', async (req, res) => {

    const result = await scapper.allAnimelistPage(req.params.page)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4))
})

port = env.PORT || 5000
app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})

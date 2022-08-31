const cheerio = require('cheerio');
const axios = require('axios');

const ajax_url = 'https://ajax.gogo-load.com/';
const { generateEncryptAjaxParameters, decryptEncryptAjaxResponse } = require('./goload.js');

const GOGOANIMETV = 'https://gogoanimetv.ga'
const USER_AGENT = require('./utils.js');
const BASE_URL = 'https://gogoanime.ee';
const BASE_URL2 = 'https://gogoanime.gg/';
const list_episodes_url = `${ajax_url}ajax/load-list-episode`;

const Referer = 'https://gogoplay.io/';
const goload_stream_url = 'https://goload.pro/streaming.php';
const DownloadReferer = 'https://goload.pro/';
const recent_release_url = `${ajax_url}ajax/page-recent-release.html`;

async function vidcdn(id) {
    try {
        let sources = [];
        let sources_bk = [];
        let epPage, server, $, serverUrl;

        if (id.includes('episode')) {
            epPage = await axios.get(BASE_URL2 + id);
            $ = cheerio.load(epPage.data);

            server = $('#load_anime > div > div > iframe').attr('src');
            serverUrl = new URL('https:' + server);
        } else serverUrl = new URL(`${goload_stream_url}?id=${id}`);

        const goGoServerPage = await axios.get(serverUrl.href, {
            headers: { 'User-Agent': USER_AGENT },
        });
        const $$ = cheerio.load(goGoServerPage.data);

        const params = await generateEncryptAjaxParameters(
            $$,
            serverUrl.searchParams.get('id')
        );

        const fetchRes = await axios.get(
            `
            ${serverUrl.protocol}//${serverUrl.hostname}/encrypt-ajax.php?${params}`, {
            headers: {
                'User-Agent': USER_AGENT,
                'X-Requested-With': 'XMLHttpRequest',
            },
        }
        );

        const res = decryptEncryptAjaxResponse(fetchRes.data);

        if (!res.source) return { error: 'No sources found!! Try different source.' };

        res.source.forEach((source) => sources.push(source));
        res.source_bk.forEach((source) => sources_bk.push(source));

        return (sources_bk);
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}
// Get Anime Details
async function anime(_anime_name) {

    try {
        let epList = []
        let genres = []

        res = await axios.get(`${BASE_URL}/category/${_anime_name}`)
        const body = await res.data;
        const $ = cheerio.load(body)

        imageUrl = $('div.anime_info_body_bg  img').attr('src').toString()
        anime_name = $('div.anime_info_body_bg  h1').text()
        type = $('div.main_body  div:nth-child(2) > div.anime_info_body_bg > p:nth-child(4)').text().replace('Type: ', '').trim()
        synopsis = $('div.main_body  div:nth-child(2) > div.anime_info_body_bg > p:nth-child(5)').text().replace('Plot Summary: ', '')
        releaseDate = $('div.main_body  div:nth-child(2) > div.anime_info_body_bg > p:nth-child(7)').text().replace('Released: ', '')
        animeStatus = $('div.main_body  div:nth-child(2) > div.anime_info_body_bg > p:nth-child(8)').text().replace('Status: ', '').trim()
        episode_info_html = $('div.anime_info_episodes_next').html()
        episode_page = $('ul#episode_page').html()
        otherName = $('div.main_body  div:nth-child(2) > div.anime_info_body_bg > p:nth-child(9)').text().replace('Other name: ', '')
        $('div.anime_info_body_bg > p:nth-child(6) > a').each((i, elem) => {
            genres.push($(elem).attr('title').trim());
        });

        const ep_start = $('#episode_page > li').first().find('a').attr('ep_start');
        const ep_end = $('#episode_page > li').last().find('a').attr('ep_end');
        const movie_id = $('#movie_id').attr('value');
        const alias = $('#alias_anime').attr('value');

        const html = await axios.get(
            `${list_episodes_url}?ep_start=${ep_start}&ep_end=${ep_end}&id=${movie_id}&default_ep=${0}&alias=${alias}`
        );
        const $$ = cheerio.load(html.data);

        $$('#episode_related > li').each((i, el) => {
            epList.push({
                episodeId: $(el).find('a').attr('href').split('/')[1],
                episodeNum: $(el).find(`div.name`).text().replace('EP ', ''),
            });
        });

        anime_result = {
            'name': anime_name.toString(),
            'type': type.toString(),
            'synopsis': synopsis.toString(),
            'imageUrl': imageUrl.toString(),
            'genres': genres,
            'released': releaseDate.toString(),
            'status': animeStatus.toString(),
            'othername': otherName.toString(),
            'episode_id': epList.reverse(),
            'episode_info_html': episode_info_html.trim(),
            'episode_page': episode_page.toString().trim(),
        }
        return await (anime_result)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

// GET EPISODE DETAILS
async function watchAnime(episode_id) {

    try {
        res = await axios.get(`${BASE_URL}/${episode_id}`)
        const body = await res.data;
        $ = cheerio.load(body)

        anime_category = $('div.anime-info a').attr('href').replace('/category/', '')
        episode_page = $('ul#episode_page').html()
        movie_id = $('#movie_id').attr('value');
        alias = $('#alias_anime').attr('value');
        episode_link = $('div.play-video > iframe').attr('src')
        gogoserver = $('li.vidcdn > a').attr('data-video')
        streamsb = $('li.streamsb > a').attr('data-video')
        xstreamcdn = $('li.xstreamcdn > a').attr('data-video')
        anime_name_with_ep = $('div.title_name h2').text()
        ep_num = $('div.anime_video_body > input.default_ep').attr('value')
        download = $('li.dowloads a').attr('href')
        nextEpText = $('div.anime_video_body_episodes_r a').text()
        nextEpLink = $('div.anime_video_body_episodes_r > a').attr('href')
        prevEpText = $('div.anime_video_body_episodes_l a').text()
        prevEpLink = $('div.anime_video_body_episodes_l > a').attr('href')
        


        result = {
            'video': episode_link,
            'gogoserver': gogoserver,
            'streamsb': streamsb,
            'xstreamcdn': xstreamcdn,
            'animeNameWithEP': anime_name_with_ep.toString(),
            'ep_num': ep_num,
            'ep_download': download,
            'anime_info': anime_category,
            'movie_id': movie_id,
            'alias': alias,
            'episode_page': episode_page,
            'nextEpText': nextEpText,
            'nextEpLink': nextEpLink,
            'prevEpLink': prevEpLink,
            'prevEpText': prevEpText,
        }

        return await (result)
    } catch (err) {
        console.log(err);
        return { error: err };
    }

}


// GET RECENT RELEASES
async function newReleases(page, type) {
    try {
        const list = []
        const mainPage = await axios.get(`
        ${recent_release_url}?page=${page}&type=${type}
        `);
        const $ = cheerio.load(mainPage.data);

        $('div.last_episodes.loaddub > ul > li').each((i, el) => {
            list.push({
                animeId: $(el).find('p.name > a').attr('href').split('/')[1].split('-episode-')[0],
                episodeId: $(el).find('p.name > a').attr('href').split('/')[1],
                name: $(el).find('p.name > a').attr('title'),
                episodeNum: $(el).find('p.episode').text().replace('Episode ', '').trim(),
                subOrDub: $(el).find('div > a > div').attr('class').replace('type ic-', ''),
                imgUrl: $(el).find('div > a > img').attr('src'),
                episodeUrl: BASE_URL + '/' + $(el).find('p.name > a').attr('href'),
            });
        });
        return list;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

// GET RECENTLY ADDED ANIMES
async function recentlyAdded(page) {
    try {
        var anime_list = []

        res = await axios.get(`${BASE_URL}/?page=${page}`)
        const body = await res.data;
        const $ = cheerio.load(body)

        $('div.added_series_body.final ul.listing li').each((index, element) => {
            $elements = $(element)
            animeId = $elements.find('a').attr('href'),
                animeName = $elements.find('a').text()
            anime_name = {
                'animeId': animeId,
                'animeName': animeName
            }
            anime_list.push(anime_name)

        })

        return (anime_list)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

// GET ONGOING SERIES
async function ongoingSeries(page) {
    try {
        var anime_list = []

        res = await axios.get(`${BASE_URL}/`)
        const body = await res.data;
        const $ = cheerio.load(body)

        $('nav.menu_series.cron ul li').each((index, element) => {
            $elements = $(element)
            animeId = $elements.find('a').attr('href'),
                animeName = $elements.find('a').text()
            anime_name = {
                'animeId': animeId,
                'animeName': animeName
            }
            anime_list.push(anime_name)

        })
        return (anime_list)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

// GET SEARCH DETAILS
async function search(query, page) {
    try {
        var search_list = []
        res = await axios.get(`${BASE_URL}//search.html?keyword=${query}&page=${page}`)
        const body = await res.data;
        const $ = cheerio.load(body)

        $('div.main_body div.last_episodes ul.items li').each((index, element) => {
            $elements = $(element)
            name = $elements.find('p').find('a')
            img = $elements.find('div').find('a').find('img').attr('src')
            link = $elements.find('div').find('a').attr('href')
            status = $elements.find('p.released').html().trim()
            anime_name = {
                'name': name.html(),
                'img_url': img.toString(),
                'anime_id': link.slice(10,),
                'status': status
            }
            search_list.push(anime_name)
        })
        return (search_list);
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

// Get Ongoing Animes
async function ongoingAnime(page) {
    try {
        var anime_list = []


        res = await axios.get(`${BASE_URL}/ongoing-anime.html?page=${page}`)
        const body = await res.data;
        const $ = cheerio.load(body)

        $('div.main_body div.last_episodes ul.items li').each((index, element) => {
            $elements = $(element)
            name = $elements.find('p').find('a')
            img = $elements.find('div').find('a').find('img').attr('src')
            link = $elements.find('div').find('a').attr('href').replace('category/', '')
            status = $elements.find('p.released').html().trim()
            anime_name = {
                'animeTitle': name.html(),
                'imgUrl': img,
                'animeId': link.slice(1,),
                'status': status
            }
            anime_list.push(anime_name)

        })

        return (anime_list)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}


// Get Completed Anime
async function completedAnime(page) {
    try {
        var anime_list = []


        res = await axios.get(`${BASE_URL}/completed-anime.html?page=${page}`)
        const body = await res.data;
        const $ = cheerio.load(body)

        $('div.main_body div.last_episodes ul.items li').each((index, element) => {
            $elements = $(element)
            name = $elements.find('p').find('a')
            img = $elements.find('div').find('a').find('img').attr('src')
            link = $elements.find('div').find('a').attr('href').replace('category/', '')
            status = $elements.find('p.released').html().trim()
            anime_name = {
                'animeTitle': name.html(),
                'imgUrl': img,
                'animeId': link.slice(1,),
                'status': status
            }
            anime_list.push(anime_name)

        })

        return (anime_list)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

// Scrape Genre
async function scrapeGenre(genre, page) {
    try {
        var list = []
        const res = await axios.get(`${BASE_URL}/genre/${genre}?page=${page}`);
        const body = await res.data;
        const $ = cheerio.load(body)

        $('div.last_episodes > ul > li').each((i, elem) => {
            list.push({
                animeId: $(elem).find('p.name > a').attr('href').split('/')[2],
                animeTitle: $(elem).find('p.name > a').attr('title'),
                animeImg: $(elem).find('div > a > img').attr('src'),
                releasedDate: $(elem).find('p.released').html().trim(),
                animeUrl: GOGOANIMETV + $(elem).find('p.name > a').attr('href'),
            });
        });
        return list;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}


// Get New Season
async function newSeason(page) {
    try {
        var anime_list = []


        res = await axios.get(`${BASE_URL}/new-season.html?page=${page}`)
        const body = await res.data;
        const $ = cheerio.load(body)

        $('div.main_body div.last_episodes ul.items li').each((index, element) => {
            $elements = $(element)
            name = $elements.find('p').find('a')
            img = $elements.find('div').find('a').find('img').attr('src')
            link = $elements.find('div').find('a').attr('href')
            status = $elements.find('p.released').html().trim()
            anime_name = {
                'animeTitle': name.html(),
                'imgUrl': img,
                'animeId': link.slice(10,),
                'status': status
            }
            anime_list.push(anime_name)

        })

        return (anime_list)
    }
    catch (err) {
        console.log(err);
        return { error: err };
    }

}

// Get Anime Movies
async function animeMovie(page) {
    try {
        var anime_list = []
        res = await axios.get(`${BASE_URL}/anime-movies.html?aph=&page=${page}`)
        const body = await res.data;
        const $ = cheerio.load(body)

        $('div.main_body div.last_episodes ul.items li').each((index, element) => {
            $elements = $(element)
            name = $elements.find('p').find('a')
            img = $elements.find('div').find('a').find('img').attr('src')
            link = $elements.find('div').find('a').attr('href')
            status = $elements.find('p.released').html().trim()
            anime_name = {
                'animeTitle': name.html(),
                'imgUrl': img,
                'animeId': link.slice(10,),
                'status': status
            }
            anime_list.push(anime_name)

        })

        return (anime_list)
    }
    catch (err) {
        console.log(err);
        return { error: err };
    }
}


// Get Popular Animes
async function popular(page) {
    try {
        var anime_list = []


        res = await axios.get(`${BASE_URL}/popular.html?page=${page}`)
        const body = await res.data;
        const $ = cheerio.load(body)

        $('div.main_body div.last_episodes ul.items li').each((index, element) => {
            $elements = $(element)
            name = $elements.find('p').find('a')
            img = $elements.find('div').find('a').find('img').attr('src')
            link = $elements.find('div').find('a').attr('href')
            status = $elements.find('p.released').html().trim()
            anime_name = {
                'animeTitle': name.html(),
                'imgUrl': img,
                'animeId': link.slice(10,),
                'status': status
            }
            anime_list.push(anime_name)

        })

        return (anime_list)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

// Get Sub-Categories
async function subCategories(subCategory, page) {
    try {
        var anime_list = []


        res = await axios.get(`${BASE_URL}/sub-category/${subCategory}?page=${page}`)
        const body = await res.data;
        const $ = cheerio.load(body)
        console.log(`${BASE_URL}/sub-category/${subCategory}?page=${page}`)

        $('div.main_body div.last_episodes ul.items li').each((index, element) => {
            $elements = $(element)
            name = $elements.find('p').find('a')
            img = $elements.find('div').find('a').find('img').attr('src')
            link = $elements.find('div').find('a').attr('href')
            status = $elements.find('p.released').html().trim()
            anime_name = {
                'animeTitle': name.html(),
                'imgUrl': img,
                'animeId': link.slice(10,),
                'status': status
            }
            anime_list.push(anime_name)

        })

        return (anime_list)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

// Get All Anime (Anime List) 
async function loadAllAnime(page) {
    try {
        var anime_list = []

        res = await axios.get(`${BASE_URL}/anime-list.html?page=${page}`)
        const body = await res.data;
        const $ = cheerio.load(body)

        $('div.anime_list_body ul.listing li ').each((index, element) => {
            $elements = $(element)
            name = $elements.find('a').html().replace(/"/g, "")
            link = $elements.find('a').attr('href')
            liTitle = $elements.attr('title')
            anime_name = {
                'animeTitle': name,
                'animeId': link.slice(10,),
                'liTitle': liTitle
            }
            anime_list.push(anime_name)

        })

        return (anime_list)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

// A-Z ANIME LIST
async function animeList(aph, page) {
    try {
        var anime_list = []

        res = await axios.get(`${BASE_URL}/anime-list-${aph}?page=${page}`)
        const body = await res.data;
        const $ = cheerio.load(body)

        $('div.anime_list_body ul.listing li ').each((index, element) => {
            $elements = $(element)
            name = $elements.find('a')
            link = $elements.find('a').attr('href')
            liTitle = $elements.attr('title')
            anime_name = {
                'animeTitle': name.html(),
                'animeId': link.slice(10,),
                'liTitle': liTitle
            }
            anime_list.push(anime_name)

        })

        return (anime_list)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

// Pagination Array 

// 1) Search Pagination
async function searchPagination(query, page) {
    try {
        res = await axios.get(`${BASE_URL}/search.html?keyword=${query}&page=${page}`)
        const body = await res.data;
        $ = cheerio.load(body)

        pagination = $('ul.pagination-list').html()
        result = {
            'pagination': pagination.replace("selected", "active"),
        }

        return await (result)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

async function popularPagination(page) {
    try {
        res = await axios.get(`${BASE_URL}/popular.html?page=${page}`)
        const body = await res.data;
        $ = cheerio.load(body)

        pagination = $('ul.pagination-list').html()
        result = {
            'pagination': pagination.replace("selected", "active"),
        }

        return await (result)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

async function completedPagination(page) {
    try {
        res = await axios.get(`${BASE_URL}/completed-anime.html?page=${page}`)
        const body = await res.data;
        $ = cheerio.load(body)

        pagination = $('ul.pagination-list').html()
        result = {
            'pagination': pagination.replace("selected", "active"),
        }

        return await (result)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

async function ongoingPagination(page) {
    try {
        res = await axios.get(`${BASE_URL}/ongoing-anime.html?page=${page}`)
        const body = await res.data;
        $ = cheerio.load(body)

        pagination = $('ul.pagination-list').html()
        result = {
            'pagination': pagination.replace("selected", "active"),
        }

        return await (result)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

async function moviePagination(page) {
    try {
        res = await axios.get(`${BASE_URL}/anime-movies.html?aph=&page=${page}`)
        const body = await res.data;
        $ = cheerio.load(body)

        pagination = $('ul.pagination-list').html()
        result = {
            'pagination': pagination.replace("selected", "active"),
        }

        return await (result)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

async function subCategoryPagination(subCategory, page) {
    try {
        res = await axios.get(`${BASE_URL}/sub-category/${subCategory}?page=${page}`)
        const body = await res.data;
        $ = cheerio.load(body)

        pagination = $('ul.pagination-list').html()
        result = {
            'pagination': pagination.replace("selected", "active"),
        }

        return await (result)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

async function latestPage(page, type) {
    try {
        res = await axios.get(`${recent_release_url}?page=${page}&type=${type}`)
        const body = await res.data;
        $ = cheerio.load(body)

        pagination = $('ul.pagination-list').html()
        result = {
            'pagination': pagination.replace("selected", "active"),
        }

        return await (result)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

async function newSeaPage(page) {
    try {
        res = await axios.get(`${BASE_URL}/new-season.html?page=${page}`)
        const body = await res.data;
        $ = cheerio.load(body)

        pagination = $('ul.pagination-list').html()
        result = {
            'pagination': pagination.replace("selected", "active"),
        }

        return await (result)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

async function genrePage(genre, page) {
    try {
        res = await axios.get(`${BASE_URL}/genre/${genre}?page=${page}`)
        const body = await res.data;
        $ = cheerio.load(body)

        pagination = $('ul.pagination-list').html()
        result = {
            'pagination': pagination.replace("selected", "active"),
        }

        return await (result)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

async function animelistPage(aph, page) {
    try {
        res = await axios.get(`${BASE_URL}/anime-list-${aph}?page=${page}`)
        const body = await res.data;
        $ = cheerio.load(body)

        pagination = $('ul.pagination-list').html()
        result = {
            'pagination': pagination.replace("selected", "active"),
        }

        return await (result)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

async function allAnimelistPage(page) {
    try {
        res = await axios.get(`${BASE_URL}/anime-list.html?page=${page}`)
        const body = await res.data;
        $ = cheerio.load(body)

        pagination = $('ul.pagination-list').html()
        result = {
            'pagination': pagination.replace("selected", "active"),
        }

        return await (result)
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

module.exports = {
    popular,
    newSeason,
    search,
    anime,
    watchAnime,
    newReleases,
    animeMovie,
    completedAnime,
    ongoingAnime,
    recentlyAdded,
    ongoingSeries,
    scrapeGenre,
    loadAllAnime,
    animeList,
    searchPagination,
    vidcdn,
    popularPagination,
    completedPagination,
    ongoingPagination,
    moviePagination,
    subCategories,
    subCategoryPagination,
    latestPage,
    newSeaPage,
    genrePage,
    animelistPage,
    allAnimelistPage
}


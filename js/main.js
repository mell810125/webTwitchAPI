$(function () {
    let language = '';
    let startIndex = 0;
    function sendRequest(lang, num) {
        $.ajax({
            type: 'GET',
            url: 'https://api.twitch.tv/helix/streams',
            dataType: 'json',
            headers: {
                'Client-ID': 'vt04b78n63lth4sf838wwc9kls1nhv'
            },
            data: {
                'first': 100,
                'language': lang
            },
            error: function (res) { alert('error!') },
            success: function (res) {
                $(".loading").slideUp('fast');
                function poccess(url) {
                    return url.replace('{width}x{height}', '350x198')
                };
                for (let i = num; i < num + 20; i++) {
                    let channelName = res.data[i].thumbnail_url.match(/[a-z]+(?=\-\{)/gi);
                    let viewers = res.data[i].viewer_count;
                    if (res.data[i]) {
                        $("article").append(`
                    <section>
                        <img title=${channelName} class="video stream${i}" data-channel="${channelName}" src=${poccess(res.data[i].thumbnail_url)}>
                        <p class="title">${res.data[i].title || '*This channel has no title*'}</p>
                        <p class="viewers">觀看人數: ${viewers}</p>
                    </section>
                    `)
                    }
                };
                $(".load-more").click(() => {
                    startIndex += 20;
                    sendRequest(language, startIndex)
                    if (startIndex === 100) {
                        $(".load-more").css("display", "none");
                    }
                })
                $(".video").click((event) => {
                    let channel = $(event.currentTarget).attr('data-channel');
                    $(".show-box").css("display", "flex")
                    $("iframe").attr("src", `https://player.twitch.tv/?channel=${channel}`)
                });
                $(".close").click(() => {
                    $(".show-box").css("display", "none")
                    $("iframe").attr("src", "")
                });
                $(".btn1").click(() => {
                    $("iframe").attr({
                        width: 1280,
                        height: 768
                    })
                });
                $(".btn2").click(() => {
                    $("iframe").attr({
                        width: 1600,
                        height: 900
                    })
                });
            },
        });
    }
    sendRequest(language, startIndex);
    $(".all").click(() => {
        $(".loading").show('fast');
        $("article").empty();
        language = '';
        startIndex = 0;
        sendRequest(language, startIndex);
        $(".load-more").css("display", "block");
        $('a').removeClass('active')
        $(`.all`).addClass('active')
    })
    let langs = ['zh-tw', 'en', 'ja', 'ko', 'ru', 'de', 'fr']
    langs.forEach(x => {
        $(`.${x}`).click(() => {
            $(".loading").slideDown('fast');
            $("article").empty();
            language = x;
            startIndex = 0;
            sendRequest(language, startIndex);
            $('a').removeClass('active')
            $(`.${x}`).addClass('active')
        })
    })
});





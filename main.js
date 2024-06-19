let tokentouser = {};
let tokenlist = document.getElementById("token");
let guildlist = document.getElementById("server");
let channellist = document.getElementById("channel")

function removeOptions(selectElement) {
    if (selectElement != null) {
        selectElement.options.length = 0;
    }
}
 

function tokenalivecheck(){
    let tokens = document.getElementById("token-chkalive-textarea").value.split("\n");
    removeOptions(tokenlist);
    removeOptions(guildlist);
    removeOptions(channellist);
    tokens.forEach(token => {
        addlog(`トークン "${token}" が有効かを確認します。`);
        
        fetch(
            "https://discord.com/api/v10/users/@me",
            {
                method: "GET",
                headers: {
                    "Authorization": token,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                },
            }
        ).then((response) => {
            if (response.status == 200) {
                addlog(`${token}: トークンが有効ですおめでとう`);
                response.json().then((json) => {
                    tokentouser[token] = json;

                    let option = document.createElement("option");
                    option.text = `${json["username"]}#${json["discriminator"]} (${json["id"]})`;
                    option.value = token;
                    tokenlist.appendChild(option);
                })
            }else{
                tokentouser[token] = {};
                addlog(`${token}: トークンが無効でした: ${response.status}`);
            }
        });
    });
}

function getservers(){
    let token = tokenlist.value;
    if (token == "" || token == null) {
        addlog("トークンを選択してください");
        return;
    }
    removeOptions(guildlist);
    removeOptions(channellist);

    fetch(
        "https://discord.com/api/v10/users/@me/guilds",
        {
            method: "GET",
            headers: {
                "Authorization": token,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            },
        }
    ).then((response) => {
        if (response.status == 200) {
            response.json().then((json) => {
                json.forEach((guild) => {
                    addlog(`${guild["name"]} を取得しました`);
                    let option = document.createElement("option");
                    option.text = `${guild["name"]} (${guild["id"]})`;
                    option.value = guild["id"];
                    guildlist.appendChild(option);
                })
            })
        }else{
            addlog(`ギルド一覧の取得に失敗しました: ${response.status}`);
        }
    });
}

function getchannels(){
    let token = tokenlist.value;
    if (token == "" || token == null) {
        addlog("トークンを選択してください");
        return;
    }
    let guild = guildlist.value;
    if (guild == "" || guild == null) {
        addlog("サーバーを選択してください");
        return;
    }
    removeOptions(channellist);

    fetch(
        `https://discord.com/api/v10/guilds/${guild}/channels`,
        {
            method: "GET",
            headers: {
                "Authorization": token,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            },
        }
    ).then((response) => {
        if (response.status == 200) {
            response.json().then((json) => {
                json.forEach((channel) => {
                    addlog(`${channel["name"]} を取得しました`);
                    let option = document.createElement("option");
                    option.text = `${channel["name"]} (${channel["id"]})`;
                    option.value = `${channel["id"]}`;
                    channellist.appendChild(option);
                })
            })
        }else{
            addlog(`チャンネル一覧の取得に失敗しました: ${response.status}`);
        }
    });
}

function sendmessage() {
    let token = tokenlist.value;
    if (token == "" || token == null) {
        addlog("トークンを選択してください");
        return;
    }
    let channel = channellist.value;
    if (channel == "" || channel == null) {
        addlog("チャンネルを選択してください");
        return;
    }

    let content = document.getElementById("send_content").value;
    let israndomchars = document.getElementById("israndomchars").checked;
    if (israndomchars) {
        content = `${content}${Math.random().toString(32).substring(2)}`;
    }

    let body = {
        "content": content
    };

    fetch(
        `https://discord.com/api/v10/channels/${channel}/messages`,
        {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            },
            body: JSON.stringify(body)
        }
    ).then((response) => {
        if (response.ok) {
            response.json().then((json) => {
                addlog(`送信済み: ${json["id"]} (${json["timestamp"]})`);
            });
        } else {
            addlog(`メッセージの送信に失敗しました: ${response.status}`);
        }
    }).catch((error) => {
        addlog(`メッセージの送信時にエラーが発生しました: ${error}`);
    });
}

function addlog(text) {
    console.log(text)
    let textarea = document.getElementById("log");
    textarea.value = `${text}\n${textarea.value}`;
}
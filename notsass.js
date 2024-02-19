                        /*___
                        ,--.'|_ 
      ,---,    ,---.    |  | :,'
  ,-+-. /  |  '   ,'\   :  : ' :  .--.--.                 .--.--.    .--.--.
 ,--.'|'   | /   /   |.;__,'  /  /  /    '    ,--.--.    /  /    '  /  /    '
|   |  ,"' |.   ; ,. :|  |   |  |  :  /`./   /       \  |  :  /`./ |  :  /`./
|   | /  | |'   | |: ::__,'| :  |  :  ;_    .--.  .-. | |  :  ;_   |  :  ;_ 
|   | |  | |'   | .; :  '  : |__ \  \    `.  \__\/: . .  \  \    `. \  \    `.
|   | |  |/ |   :    |  |  | '.'| `----.   \ ," .--.; |   `----.   \ `----.   \
|   | |--'   \   \  /   ;  :    ;/  /`--'  //  /  ,.  |  /  /`--'  //  /`--'  /
|   |/        `----'    |  ,   /'--'.     /;  :   .'   \'--'.     /'--'.     /
'---'                    ---`-'   `--'---' |  ,     .-./  `--'---'   `--'---' v1.3
                                            `--`---'*/

// after using scss for a bit, i found myself trying to type nested css selectors
// when i wasn't even using sass at all. this didn't work... i thought about
// including sass on the frontend, but it's big ! and i wasn't about to start
// webpacking or compiling or whatever for my dumb-simple little web things.
// SO ! i decided to make a sass-like compiler that would JUST compile a little
// scss to css with only support for nested selectors. and here it is !
// it needs more work... but it works ! just <style type="notsass"></style> then
// <script src="https://notsass.com"></script> to get going ! enjoy !
//
// notsincerly,
// notsass@matthew.rayfield.world



function compile(input) {
    let data = {};
    let temp = '';
    let selectors = [];
    let rule = '';
    let mode = 0;

    function addRule() {
        if (!selectors.length || !rule) return;
        const parented = [];
        selectors.forEach(selector => {
            if (selector[0] == '&') {
                parented[parented.length-1] += selector.substring(1);
            }
            else parented.push(selector);
        });
        const key = parented.join(' ');
        if (!data[key]) data[key] = [];
        data[key].push(rule);
    }

    let inComment = false;
    for (let i = 0; i < input.length; i ++) {
        let c = input[i];
        if (inComment) {
            if (c == '/') {
                if (input[i-1] == '*') {
                    inComment = false;
                }
            }
            continue;
        }
        else {
            if (c == '/') {
                if (input[i+1] == '*') {
                    inComment = true;
                    continue;
                }
            }
            else if (c == '{') {
                addRule();
                selectors.push(temp.trim());
                temp = '';
                rule = '';
                mode = 1;
                continue;
            }
            else if (c == ';') {
                rule += temp.trim();
                addRule();
                temp = '';
                rule = '';
                continue;
            }
            else if (c == '}') {
                rule += temp.trim();
                addRule();
                selectors.pop();
                temp = '';
                rule = '';
                continue;
            }
        }

        temp += c;
    }

    let compiled = '';
    for (let key in data) {
        compiled += `${key}{${data[key].join(';')}}`;
    }
    return compiled;
}

const styleTags = Array.from(document.querySelectorAll('style'));

styleTags.forEach(e => {
    if (e.type == 'notsass') {
        e.removeAttribute('type');
        e.innerHTML = compile(e.innerHTML);
    }
});

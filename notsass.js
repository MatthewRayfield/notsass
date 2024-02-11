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

    for (let i = 0; i < input.length; i ++) {
        let c = input[i];
        if (c == '{') {
            addRule();
            selectors.push(temp.trim());
            temp = '';
            rule = '';
            mode = 1;
        }
        else if (c == ';') {
            rule += temp.trim();
            addRule();
            temp = '';
            rule = '';
        }
        else if (c == '}') {
            rule += temp.trim();
            addRule();
            selectors.pop();
            temp = '';
            rule = '';
        }
        else {
            temp += c;
        }
    }

    console.log(JSON.stringify(data, null, 4));

    let compiled = '';
    for (let key in data) {
        compiled += `${key}{${data[key].join(';')}}`;
    }
    return compiled;
}

const styleTags = Array.from(document.querySelectorAll('style'));

styleTags.forEach(e => {
    if (e.type == 'notsass') {
        const code = e.innerHTML;
        const outElement = document.createElement('style');
        const compiled = compile(code);
        console.log(compiled);
        outElement.innerHTML = compiled;
        document.head.appendChild(outElement);
    }
});

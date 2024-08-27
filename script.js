const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
});

const user = 'cezelot';
const host = 'cezelot.me';

const directories = {
    about: [
        '<white>Name:</white>\t\t\tIsmaël Benjara',
        '<white>Email:</white>\t\t\t<a href="ib@cezelot.me">ib@cezelot.me</a>',
        '<white>Public key:</white>\t\t<a href="./pubkey.txt" target="_blank" \
            rel="noopener noreferrer">D0C9 E5B2 B133 EF2A 1A6B</a>',
        '',
        'I write code.'
    ],
    projects: [
        [
            ['eve',
             'https://sr.ht/~cezelot/eve',
             'simple text editor'
            ]
        ].map(([name, url, description = '']) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer"\
                >${name}</a> &mdash; <white>${description}</white>`;
        })
    ].flat(),
    links: [
        [
           ['sourcehut',
            'https://sr.ht/~cezelot',
            'GitHub',
            'https://github.com/cezelot'
           ]
        ].map(([name, url, name2, url2 = '']) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer"\
                >${name}</a>\t<a href="${url2}" target="_blank" \
                rel="noopener noreferrer">${name2}</a>`;
        }),
        [
           ['itch.io',
            'https://cezelot.itch.io',
            'Pastebin',
            'https://pastebin.com/u/count_0'
           ]
        ].map(([name, url, name2, url2 = '']) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer"\
                >${name}</a>\t\t<a href="${url2}" target="_blank" \
                rel="noopener noreferrer">${name2}</a>`;
        }),
        [
           ['LinkedIn',
            'https://www.linkedin.com/in/ismael-benjara',
            'X',
            'https://x.com/count_ezelot'
           ]
        ].map(([name, url, name2, url2 = '']) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer"\
                >${name}</a>\t<a href="${url2}" target="_blank" \
                rel="noopener noreferrer">${name2}</a>`;
        })
    ].flat(),
    uses: [
        '<white>Languages</white>',

        [
            'Bash',
            'C',
            'Python',
            'GDScript',
            'HTML',
            'CSS',
            'JavaScript'
        ].map(lang => `* <green>${lang}</green>`),
        '',
        '<white>Tools</white>',
        [
            'GNU/Linux',
            'Git',
            'Vim',
            'Godot',
            'Docker'
        ].map(lib => `* <blue>${lib}</blue>`)
    ].flat()
};

const dirs = Object.keys(directories);
const root = '~';
let cwd = root;

function prompt() {
    return `<blue>${cwd}</blue> > `;
}

function print_dirs() {
     term.echo(dirs.map(dir => {
         return `<blue class="directory">${dir}</blue>`;
     }).join('\n'));
}

const url = 'https://v2.jokeapi.dev/joke/Programming';

const commands = {
    ls(dir = null) {
        if (dir) {
            if (dir.match(/^~\/?$/)) {
                // ls ~ or ls ~/
                print_dirs();
            } else if (dir.startsWith('~/')) {
                const path = dir.substring(2);
                const dirs = path.split('/');
                if (dirs.length > 1) {
                    this.error('Invalid directory');
                } else {
                    const dir = dirs[0];
                    this.echo(directories[dir].join('\n'));
                }
            } else if (cwd === root) {
                if (dir in directories) {
                    this.echo(directories[dir].join('\n'));
                } else {
                    this.error('Invalid directory');
                }
            } else if (dir === '..') {
                print_dirs();
            } else {
                this.error('Invalid directory');
            }
        } else if (cwd === root) {
            print_dirs();
        } else {
            const dir = cwd.substring(2);
            this.echo(directories[dir].join('\n'));
        }
    },
    cd(dir = null) {
        if (dir === null || (dir === '..' && cwd !== root)) {
            cwd = root;
        } else if (dir.startsWith('~/') && dirs.includes(dir.substring(2))) {
            cwd = dir;
        } else if (dirs.includes(dir)) {
            cwd = root + '/' + dir;
        } else {
            this.error('Wrong directory');
        }
    },
    whoami() {
        term.echo(`${user}`);
    },
    hostname() {
        term.echo(`${host}`);
    },
    help() {
        term.echo(`List of available commands: ${help}`);
    },
    echo(...args) {
        if (args.length > 0) {
            term.echo(args.join(' '));
        }
    },
    async joke() {
        const res = await fetch(url);
        const data = await res.json();
        (async () => {
            if (data.type == 'twopart') {
                // set clear the prompt to don't have any
                // flashing between animations
                const prompt = this.get_prompt();
                this.set_prompt('');
                await this.echo(`Q: ${data.setup}`, {
                    delay: 50,
                    typing: true
                });
                await this.echo(`A: ${data.delivery}`, {
                    delay: 50,
                    typing: true
                });
                // restore the prompt
                this.set_prompt(prompt);
            } else if (data.type === 'single') {
                await this.echo(data.joke, {
                    delay: 50,
                    typing: true
                });
            }
        })();
    }
};

const command_list = ['clear'].concat(Object.keys(commands));
const formatted_list = command_list.map(cmd => `<white class="command">${cmd}</white>`);
const help = formatter.format(formatted_list);

const re = new RegExp(`^\s*(${command_list.join('|')})(\s?.*)`);

$.terminal.new_formatter([re, function(_, command, args) {
    return `<cyan class="command">${command}</cyan><white>${args}</white>`;
}]);

$.terminal.xml_formatter.tags.green = (attrs) => {
   // return `[[;#44D544;]`;
    return `[[;#55FF55;]`;
};
$.terminal.xml_formatter.tags.blue = (attrs) => {
    return `[[;#5555FF;]`;
};
$.terminal.xml_formatter.tags.cyan = (attrs) => {
    return `[[;#00AAAA;]`;
};
$.terminal.xml_formatter.tags.aquamarine = (attrs) => {
    return `[[;#55FFFF;]`;
};
/*
$.terminal.xml_formatter.tags.red = (attrs) => {
    return `[[;#AA0000;;${attrs.class}]`;
};
$.terminal.xml_formatter.tags.yellow = (attrs) => {
    return `[[;#FFFF55;;${attrs.class}]`;
};
$.terminal.xml_formatter.tags.magenta = (attrs) => {
    return `[[;#AA00AA;]`;
};
$.terminal.xml_formatter.tags.light-red = (attrs) => {
    return `[[;#FF5555;;${attrs.class}]`;
};
$.terminal.xml_formatter.tags.light-green = (attrs) => {
    return `[[;#55FF55;]`;
};
$.terminal.xml_formatter.tags.light-blue = (attrs) => {
    return `[[;#5555FF;]`;
};
$.terminal.xml_formatter.tags.light-magenta = (attrs) => {
    return `[[;#FF55FF;;${attrs.class}]`;
};
$.terminal.xml_formatter.tags.light-cyan = (attrs) => {
    return `[[;#55FFFF;]`;
};
$.terminal.xml_formatter.tags.light-grey = (attrs) => {
    return `[[;#AAAAAA;]`;
};
$.terminal.xml_formatter.tags.dark-grey = (attrs) => {
    return `[[;#555555;;${attrs.class}]`;
};
$.terminal.xml_formatter.tags.dark-yellow = (attrs) => {
    return `[[;#AA5500;]`;
};
*/

const font = 'Slant';

figlet.defaults({ fontPath: './assets/fonts' });
figlet.preloadFonts([font], ready);

const term = $('body').terminal(commands, {
    greetings: false,
    checkArity: false,
    completion(string) {
        // in every function we can use `this` to reference term object
        const cmd = this.get_command();
        // we process the command to extract the command name
        // at the rest of the command (the arguments as one string)
        const { name, rest } = $.terminal.parse_command(cmd);
        if (['cd', 'ls'].includes(name)) {
            if (rest.startsWith('~/')) {
                return dirs.map(dir => `~/${dir}`);
            }
            if (cwd === root) {
                return dirs;
            }
        }
        return Object.keys(commands);
    },
    exit: false,
    prompt
});

term.pause();

function ready() {
    const seed = rand(256);
    term.echo(() => rainbow(render('cezelot'), seed))
        .echo('<white>Welcome friend!</white>\n').resume();
}

function rand(max) {
    return Math.floor(Math.random() * (max + 1));
}

function rainbow(string, seed) {
    return lolcat.rainbow(function(char, color) {
        char = $.terminal.escape_brackets(char);
        return `[[;${hex(color)};]${char}]`;
    }, string, seed).join('\n');
}

function hex(color) {
    return '#' + [color.red, color.green, color.blue].map(n => {
        return n.toString(16).padStart(2, '0');
    }).join('');
}

function render(text) {
    const cols = term.cols();
    return figlet.textSync(text, {
        font: font,
        width: cols,
        whitespaceBreak: true
    });
}

function trim(str) {
    return str.replace(/[\n\s]+$/, '');
}

term.on('click', '.command', function() {
    const command = $(this).text();
    term.exec(command);
});

term.on('click', '.directory', function() {
    const dir = $(this).text();
    term.exec(`cd ~/${dir}`);
});

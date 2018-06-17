const choo = require('choo')
const html = require('choo/html')
const emoji = require('node-emoji')
const css = require('sheetify')

const app = choo()




const styles = css`
  h1 {
    color: blue;
  }
`;

const apple = 'apple';
const poop = 'poop';
const pig = 'pig2';

// steam_locomotive
app.model({
    state: {
        apples: [],
        pigs: ['pig2', 'pig2', 'pig2', 'pig2'],
        pigstys: [{ queue: [], size: 5}, { queue: [], size: 7}],
        selectedPigsty: 0
    },
    reducers: {
        refill: (_, state) => ({
        state,
        apples: Array.from({length: 10}, () => apple),
        }),
        feedPig: (_, state) => {
            if (state.apples.length === 0) {
                return state;
            }

            let pigs = state.pigs;
            const pigsty = state.pigstys[state.selectedPigsty];

            if(pigsty.queue.length === 0 && pigs.length === 0) {
                return state;
            }

            if(pigsty.queue.length === 0) {
                pigs.pop();
                pigsty.queue.push(pig);
            }
            pigsty.queue.push(poop);

            return {
                state,
                pigs,
                apples: [...state.apples.slice(1)]
            };
        },
        cleanPigsty: (el, state) => {
            const pigsty = state.pigstys[state.selectedPigsty];
            pigsty.queue = [];
            return state;
        }
    }
});

const mainView = (state, prev, send) => html`
  <main class=${styles}>
    <h1>Piggy Poo Barn</h1>
    <hr>
    <button onclick=${() =>
    send('feedPig')} class="btn btn-danger">Feed Pig</button>
    <button onclick=${() => 
    send('refill')} class="btn btn-danger">Refill</button>
    <button onclick=${() =>
    send('cleanPigsty')} class="btn btn-danger">Remove the POO</button>
    <div>
        ${state.apples.map((v) => emoji.get(v))}
    </div>
    <div>
        <h2>Pigsty 1</h2>
        ${state.pigstys[state.selectedPigsty].queue.map((v) => emoji.get(v))}
    </div>
    <div>
        <h2>Pigsty 2</h2>
    </div>
  </main>
`;

app.router((route) => [route('/', mainView)]);

const tree = app.start();
document.body.appendChild(tree);
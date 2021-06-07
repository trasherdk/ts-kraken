<img src=".ci_badges/npm-version-badge.svg" /> <img src=".ci_badges/npm-dependencies-badge.svg" /> <img src=".ci_badges/npm-devdependencies-badge.svg" />

# ts-kraken

<img src=".github/ts_kraken_logo.png" width="640px" />

> A versatile unofficial _repl-cli/node-lib_ to operate against the **[Kraken](https://kraken.com) Crypto Exchange** [REST](https://docs.kraken.com/rest/) and [WebSocket](https://docs.kraken.com/websockets/) APIs
---

## Launch the REPL with `npx`:

````
npx ts-kraken
````


## Setup in a standalone directory and have fun with the REPL:

````
git clone https://github.com/yeikiu/ts-kraken && cd ts-kraken && npm i
````

````
npm run kraken-repl
````

<img src=".github/ts_kraken_demo.gif" />

---


## Demo Public REPL requests

### List filtered fields from all available trading pairs
````
.get AssetPairs . as $base|keys|map($base[.])|map({pair:.wsname,decimals:.pair_decimals,min:.ordermin}) -table
````

### Track pair price as simple string output
````
.pubSub ticker pair[]=XBT/USD .[1].c[0]
````

### Track pair(s) trades
````
.pubSub trade pair[]=XBT/USD&pair[]=USDT/USD
````

### Track pair(s) spread
````
.pubSub spread pair[]=XBT/USD&pair[]=USDT/USD
````

### Track pair(s) book
````
.pubSub book depth=10&pair[]=ETH/EUR .[3] as $pair|{pair:$pair,book:.[1].a[0]}
````

### Track filtered ticker-fields for pair(s) price(s)
````
.pubSub ticker pair[]=XBT/USD&pair[]=ADA/XBT&pair[]=USDT/USD . as $base|{pair:.[3],price:$base[1].c[0]}
````

### Track pair(s) 5-mins ohlc flags
````
.pubSub ohlc interval=5&pair[]=XBT/USD&pair[]=USDT/USD .[1] as $ohlc|{pair:.[3],o:$ohlc[2],h:$ohlc[3],l:$ohlc[4],c:$ohlc[5]}
````
---


## Demo Private REPL requests (requires API key/secret)

> _**Tip:**_ Use the `.showKeys` command to display current keys in use.

> To load your keys, you can either use the `.setKeys` command or create a `.env` file like the following under project root directory to reuse persistent keys:

````
KRAKEN_API_KEY=yourApiKey
KRAKEN_API_SECRET=yourApiSecret
````

### Account Balances
````
.post Balance -table
````

### Trade Balances
````
.post TradeBalance -table
````

### Status of Recent BTC Deposits
````
.post DepositStatus asset=XBT -table
````

### Print Open-Orders table
````
.post OpenOrders .open as $open|.open|keys|map($open[.].descr) -table
````

### Print Closed-Orders table
````
.post ClosedOrders .closed as $closed|.closed|keys|map($closed[.].descr) -table
````
---


## Setup as a library in your TypeScript project:

````
npm i https://github.com/yeikiu/ts-kraken
````

- Load your keys as env variables. You can use a .env file like:
````
KRAKEN_API_KEY=yourApiKey
KRAKEN_API_SECRET=yourApiSecret
````

- If you prefer to use multiple keypairs in runtime, the `privateRESTRequest` method takes a convenient 2nd argument `InjectedApiKeys`

- Then you can cherry-pick-import the bits you'll need in any of your _*.ts_ files like:

````
import { publicRESTRequest, privateRESTRequest, publicWSClient, privateWSClient, subscriptionHandler /* etc... */ } from 'ts-kraken'
````

Check all the exported methods and types under [the index file](https://github.com/yeikiu/ts-kraken/blob/master/src/index.ts)
---


## Resources

* [Kraken REST API docs](https://docs.kraken.com/rest/)
* [Kraken WebSockets API docs](https://docs.kraken.com/websockets/)
* [jq Manual](https://stedolan.github.io/jq/manual)
---


## Upcoming features

- Option to record all requests and incoming streams to json files
- Wrapper-REPL-Command prompting user for request params (with pre-flight validations) for each endpoint/subscription

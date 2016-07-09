# Helmut, the waiter slack bot

## Installation

* Start by first installing nodejs
* Clone the repo
* run `npm install`

You are ready to start the server with by running `npm start`

## Usage

You will have a private conversation with _helmut_. The commands you can tell him are:
* `order` - takes you through the process of creating an order for your colleagues
* `reply` - respond to a received order
* `show` - shows all actives orders
* `collect` - collects the replies to an order you made
* `close` - collects the replies to an order and closes it. Notifies the participants that you are going to take the food.
* `notify` - notifies the invited participants that their food has arrived. You have returned!
* `help` - displays the help

## Authors

* [mariotim](https://github.com/mariotim)
* [mrWinston](https://github.com/mrWinston)
* [David-Wobrock](https://github.com/David-Wobrock)

Made during a [3YOURMIND GmbH](https://www.3yourmind.com) Hackathon

## TODO

* Migrate to TypeScript :D
* Better flows for making the integration easier to use
* Easier to use (less possible to make errors, use reactions)
* Create a Slack integration
* Write tests

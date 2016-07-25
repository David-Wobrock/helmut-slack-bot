# Helmut, the waiter slack bot

![Alt helmut](helmut.png "helmut")

## Installation

* Start by first installing nodejs
* Clone the repo
* run `npm install`

You are ready to start the server with by running `npm start`

## Usage

You will have a private conversation with _helmut_. The commands you can tell him are:
* `order` - takes you through the process of creating an order for your colleagues
* `reply` - respond to a received order
* `close` - collects the replies to an order and closes it. Notifies the participants that you are going to take the food.

## Authors

* [David-Wobrock](https://github.com/David-Wobrock)
* [mariotim](https://github.com/mariotim)
* [mrWinston](https://github.com/mrWinston)

Made during a [3YOURMIND GmbH](https://www.3yourmind.com) Hackathon

## TODO

* Write tests (and use a framework maybe, or create own little framework)

* `arrived` - the order has arrived to the office
* `show` - shows all actives/current/closed/... orders
* `collect` - collects the replies to an order you made
* `remind` - Send a little reminder to everyone (or some selected people) that they could answer to the order
* `notify` - notifies the invited participants that their food has arrived. You have returned!
* `help` - displays the help

* A way to say that someone doesn't want anything from the order

* Create a Slack integration


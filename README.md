# Bridge Keeper

This is a demonstration of how to build a (relatively) simple Alexa Skill.

## How to Run This

Easy! Clone it from GitHub, install dependencies, and run it! Of course, you'll probably want to deploy this to an actual server somewhere (things should be set up for a [Heroku](http://heroku.com) deployment), and then you'll need to create an [Alexa Skill on Amazon](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/getting-started-guide), configure it, etc.

```
~$ npm install
~$ node .
```

There are no tests for this right now, so use at your own risk!

### How to Use it Once Deployed

Once you have this skill up and running with Amazon it's pretty basic. Launch the skill, then it will walk you through the three questions from the ["Bridge of Death"](https://www.youtube.com/watch?v=IMxWLuOFyZM) scene in Monty Python's Quest for the Holy Grail movie.

```
Alexa, ask the bridgekeeper if I can pass.
> Who would cross the Bridge of Death must answer me these questions three, ere the other side he see. What is your name?
Sir Lancelot of Camelot
> What is your quest?
I seek the holy grail
> What is your favorite color?
Blue.
> Right. Off you go.
```

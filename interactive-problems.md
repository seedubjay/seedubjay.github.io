---
layout: post
title: Hot & Cold
scripts: ['core', 'interactive-problems']
styles: ['interactive-problems']
---

I am thinking of a number between 1 and _N_. You will make guesses, and I'll give one of the following replies:
- **_HELLO_** if it is your first guess
- **_HOTTER_** if this guess is closer to my number than your previous guess
- **_COLDER_** if this guess is further away from my number than your previous guess
- **_SAME_** if this guess is the same distance away from my number as your previous guess

where the 'distance' between _a_ and _b_ is defined as _abs(a-b)_.

If you correctly guess my number, I'll instead answer **_FOUND_** and you win the game. However, after **100 guesses** I'll get bored and stop replying, which means you fail the game.

Your goal is to find my number in as few guesses as possible.

Try out some rounds with _N=100_ in the browser here:

<figure>
<div class="hotter-guess">
    <div class="hotter-input">
        <div id="hotter-value">
            <input type="number"  name="hotter-value" min="1" max="100">
        </div>
        <div>
            <button id="hotter-submit" class="btn btn-sm btn-success" type="submit" onclick="hotter_guess()">Guess</button>
        </div>
        <div>
            <button id="hotter-reset" class="btn btn-sm btn-outline-secondary" type="submit" onclick="hotter_reset()">Reset</button>
        </div>
    </div>
    <div id="hotter-output"></div>
    <div id="hotter-error"></div>
</div>
</figure>

### The challenge
Now _N=1,000,000,000_ so you'll need something more heavy-duty.

Here is some stub code to get you started: [Python3](/assets/py/hotter.py)

Good luck!

### Scoreboard

<!-- <figure> -->
<table id="hotter-scoreboard">
    <thead>
    <tr>
        <th>name</th>
        <th># queries</th>
    </tr>
    </thead>
    <tbody>
    </tbody>
</table>

_Note: A player's score is the maximum of their last 5 attempts to avoid lucky guesses. If any of these attempts were failed or left incomplete, the score will be omitted. (Feel free to run 5 games simultaneously to speed this process up.)_
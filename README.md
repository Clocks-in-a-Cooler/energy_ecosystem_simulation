## What is this?

A simulator to see what happens if we manipulate energy input.

Loosely based on [this simulation](https://eloquentjavascript.net/2nd_edition/07_elife.html) by Marijn Haverbeke.

## What are the rules?

The ecosystem is a 40 by 40 grid. There are two types of creatures, herbivores and plants. On each turn, each creature can do the following actions:

- herbivores (in this order)

    - if there is a plant in any of the adjacent (not including diagonal) spaces, eat it and gain 20% of the plant’s energy (rounded down) or 1 energy, whichever is higher
    
    - if there is an empty adjacent space and if the herbivore has at least 16 energy, produce a new herbivore. The new herbivore will have 25% percent of the energy of its parent, rounded down, while the parent keeps 50% of its energy, rounded down. For simplification, the herbivore simply clones itself.
    
    - if the herbivore runs out of energy (energy == 0), then the herbivore dies and is removed from the simulation
    
    - otherwise, if there is are empty adjacent spaces, not including diagonals, move to one at random and use 1 energy
    
- plants (in this order)

    - if there is an empty adjacent space and if the plant has at least 6 energy, produce a new plant. The new plant will have 1 energy, while the parent keeps 75% of its energy, rounded down.
    
    ◦-otherwise, there is a chance of gaining 1 energy
    
Each simulated ecosystem starts with 900 plants, in random positions, and 10 herbivores, in random positions. Each plant starts with 2 energy, while each herbivore starts with 8 energy.

Each simulated ecosystem is run until one of these two things happen:

- the ecosystem is dead. This is when one of the two species goes extinct.
    
- the ecosystem becomes overcrowded. This is when there are more than 1500 plants.

## What are all those symbols when I click `view`?

Clicking on the `view` button displays an ASCII representation of the ecosystem.

`.` represents an empty space.

`#` represents a plant

`@` represents a herbivore

## Licensing

Consider this public domain. No liability or warranty.
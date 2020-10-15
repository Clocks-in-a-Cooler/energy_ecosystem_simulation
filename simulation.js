class Simulation {
    constructor(size, plant_count, herbivore_count, chance, output) {
        // you're down the rabbit hole, Neo.
        // the Matrix is a simulated reality.
        // it is the most advanced Javascript program ever created.
        this.size        = size;
        this.steps       = 0;
        this.output      = output;
        this.gain_chance = chance;
        this.entities    = [];
        
        for (var c = 0; c < plant_count; c++) {
            var pos = (new Vector(Math.random() * this.size.x, Math.random() * this.size.y)).apply(Math.floor);
            if (this.is_occupied(pos)) {
                c--; continue;
            }
            this.entities.push(new Plant(pos, this));
        }
        
        for (var d = 0; d < herbivore_count; d++) {
            var pos = (new Vector(Math.random() * this.size.x, Math.random() * this.size.y)).apply(Math.floor);
            if (this.is_occupied(pos)) {
                d--; continue;
            }
            this.entities.push(new Herbivore(pos, this));
        }
    }
    
    update() {
        /*
            on each step:
            -[x] check if there are at least one of each species
                -[x] if there is, update the simulation
                -[x] otherwise, stop the simulation by calling this.output(this.steps)
        */
        
        if (
            this.entities.some(e => e instanceof Plant) &&
            this.entities.some(e => e instanceof Herbivore)
        ) {
            this.steps++;
            this.entities = this.entities.filter(e => e.alive);
            this.entities.forEach(e => {
                e.update();
            });
        } else {
            this.output(this.steps);
        }
    }
    
    is_occupied(pos) {
        return this.entities.some(e => e.pos.matches(pos));
    }
    
    entity_at(pos) {
        if (this.is_occupied(pos)) {
            return this.entities.filter(e => e.pos.matches(pos))[0];
        }
        
        return null;
    }
    
    find_spaces(pos, test) {
        if (!test) {
            test = (pos) => {
                return !this.is_occupied(pos);
            };
        }
        
        // search: immediately above, immediately below, immediately left, and immediately right
        var positions = [
            pos.plus(new Vector(0, -1)), pos.plus(new Vector(0, 1)), pos.plus(new Vector(-1, 0)), pos.plus(new Vector(1, 0)),
        ];
        
        return positions.filter(p => {
            /*  position is valid if:
                -[x] it is inside the simulation
                -[x] it passes the test
            */
            
            return (
                pos.x >= 0 && pos.x < this.size.x && pos.y >= 0 && pos.y < this.size.y &&
                test(pos)
            );
        });
    }
    
    print() {
        var lines = [];
        for (var y = 0; y < this.size.y; y++) {
            var gridline = "";
            for (var x = 0; x < this.size.x; x++) {
                var entity = this.entity_at(new Vector(x, y));
                if (entity) {
                    switch (entity.constructor) {
                        case Plant:
                            gridline += "#";
                            break;
                        case Herbivore:
                            gridline += "@";
                            break;
                    }
                } else {
                    gridline += ".";
                }
            }
            lines.push(gridline);
        }
        return lines;
    }
}

class Plant {
    constructor(pos, simulation) {
        this.pos        = pos;
        this.simulation = simulation;
        this.energy     = 2;
        this.alive      = true;
    }
    
    update() {
        /*
            -[ ] reproduce if:
                -[ ] there is an empty adjacent space
                -[ ] the plant has at least 6 energy
            -[ ] otherwise, there is a chance of gaining energy (use this.simulation.gain_chance)
        */
    }
    
    reproduce() {
        /*
        -[ ] search for an adjacent blank space
        -[ ] new plant gets 1 energy
        -[ ] this plant keeps 75% energy, rounded down
        */
    }
}

class Herbivore {
    constructor(pos, simulation) {
        this.pos        = pos;
        this.simulation = simulation;
        this.energy     = 8;
        this.alive      = true;
    }
    
    update() {
        
    }
}
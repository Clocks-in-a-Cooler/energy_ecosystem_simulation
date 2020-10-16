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
        
        if (this.steps > 1000) {
            this.output("sustainable");
        }
        
        if (
            this.entities.some(e => e instanceof Plant) &&
            this.entities.some(e => e instanceof Herbivore) &&
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
        if (test == undefined) {
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
                p.x >= 0 && p.x < this.size.x && p.y >= 0 && p.y < this.size.y &&
                test(p)
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
        
        var empty_spaces = this.simulation.find_spaces(this.pos);
        if (empty_spaces.length > 0 && this.energy >= 6) {
            var new_plant    = new Plant(random_element(empty_spaces), this.simulation);
            new_plant.energy = 1
            this.energy      = Math.floor(this.energy * 0.75);
            this.simulation.entities.push(new_plant);
            return;
        }
        
        if (Math.random() < this.simulation.gain_chance) {
            this.energy++;
        }
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
        /*
            on each update, do one of these, in this order:
            -[ ] find a plant to eat
                -[ ] if one exists, gain 20% of its energy, rounded down. if there is less than 5 energy, gain 1
            -[ ] if there is at least 16 energy and an empty space, reproduce
                -[ ] child gets 25% of the energy, parent keeps 50%
            -[ ] if energy is zero, die
            -[ ] move to an adjacent empty space and use 1 energy
        */
        var plant_pos = this.simulation.find_spaces(this.pos, (pos) => {
            if (this.simulation.is_occupied(pos)) {
                return this.simulation.entity_at(pos).constructor == Plant;
            } else {
                return false;
            }
        });
        
        if (plant_pos.length > 0) {
            var plant    = this.simulation.entity_at(random_element(plant_pos));
            plant.alive  = false;
            this.energy += Math.max(Math.floor(plant.energy / 5), 1);
            console.log("eating...");
            return;
        }
        
        var empty_spaces = this.simulation.find_spaces(this.pos);
        if (this.energy >= 16 && this.empty_spaces.length > 0) {
            var new_herbivore    = new Herbivore(random_element(empty_spaces), this.simulation);
            new_herbivore.energy = Math.floor(this.energy / 4);
            this.energy          = Math.floor(this.energy / 2);
            this.simulation.push(new_herbivore); // welcome to the simulation!
            return;
        }
        
        if (this.energy <= 0) {
            this.alive = false;
            return;
        }
        
        this.pos = random_element(empty_spaces);
        this.energy--;
    }
}
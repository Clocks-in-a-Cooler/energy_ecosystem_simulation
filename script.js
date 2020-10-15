
// for testing
var s = new Simulation(new Vector(40, 40), 90, 10, 0.1, console.log);

// set up a whole bunch of variables
var start_button = document.getElementById("start_sims");
var pause_button = document.getElementById("pause_sims");
var view_button  = document.getElementById("view_sims");
var step_button  = document.getElementById("step_sims");

var status_panel   = document.getElementById("status");
var data_text_area = document.getElementById("data");
var form           = document.querySelector("form");

var remaining_simulations = 0;
var gain_chance           = 0;
var current_simulation    = null;
var simulations_started   = false;

function view(plan) {
    var viewing = document.getElementById("viewing");
    // clear the screen first
    viewing.innerHTML = "";
    // we know it's 40 by 40
    // hopefully the whole thing fits on there
    plan.forEach(line => {
        viewing.innerHTML += line + "<br />"
    });
}

function set_gain_chance(evt) {
   gain_chance = evt.target.value;
}

var radio_buttons = document.getElementsByName("gain_chance");
radio_buttons.forEach(r => r.addEventListener("change", set_gain_chance));

function output(steps) {
    // a simulation just ended
    data_text_area.value += steps + ", ";
    remaining_simulations--;
    current_simulation = new Simulation(new Vector(40, 40), 90, 10, gain_chance, output);
}

function start() {
    remaining_simulations = Number(form.elements[0].value);
    // gain_chance is already set
    current_simulation = new Simulation(new Vector(40, 40), 90, 10, gain_chance, output);
    // disable the form and everything except for the pause button
    var inputs = form.elements;
    for (var c = 0; c < inputs.length; c++) {
        inputs[c].disabled = true;
    }
    start_button.disabled = true;
    view_button.disabled  = true;
    step_button.disabled  = true;
    pause_button.disabled = false;
    simulations_started   = true;
    
    paused = false;
    requestAnimationFrame(step);
}

function pause() {
    paused = true;
    start_button.innerHTML = "resume";
    start_button.disabled = false;
    view_button.disabled  = false;
    step_button.disabled  = false;
    pause_button.disabled = true;
}

function report_status() {
    if (remaining_simulations) {
        status_panel.innerHTML = remaining_simulations + " simulations remaining...";
    }
}

var paused = true;
function step() {
    if (current_simulation != null) {
        current_simulation.update();
    }
    if (paused) {
        return;
    }
    requestAnimationFrame(step);
}

data_text_area.value = "";

start_button.addEventListener("click", function() {
    if (simulations_started) {
        // act as a "resume" button
        start_button.disabled = true;
        view_button.disabled  = true;
        step_button.disabled  = true;
        pause_button.disabled = false;
        simulations_started   = true;
        
        paused = false;
        requestAnimationFrame(step);
    } else {
        start();
        report_status();
    }
});

pause_button.addEventListener("click", pause);

view_button.addEventListener("click", function() {
    if (current_simulation != null) {
        view(current_simulation.print());
    }
});

step_button.addEventListener("click", function() {
    if (current_simulation != null) {
        current_simulation.update();
        view(current_simulation.print());
    }
});
var serial; // variable to hold an instance of the serialport library
var portName = 'COM4'; //rename to the name of your port
var dataarray = []; //some data coming in over serial!
var xPos = 0;
let playing, freq, osc, mod, freq2


function setup() {
  serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial.on('list', printList);       // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing

  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port


  let cnv = createCanvas(screen.width, screen.height); // canvas size is screen size.
  cnv.mousePressed(playOscillator); // when mouse is pressed on screen, it starts the oscillators.
  osc = new p5.Oscillator('sine'); // intialize carrier
  mod = new p5.Oscillator('sine'); // initialize modulator
  background(0);
}


// get the list of ports:
function printList(portList) {
 // portList is an array of serial port names
 for (var i = 0; i < portList.length; i++) {
 // Display the list the console:
   print(i + " " + portList[i]);
 }
}

function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.');
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}

function serialEvent() {
  if (serial.available()) {
    var datastring = serial.readLine(); // readin some serial
    var newarray;
    try {
      newarray = JSON.parse(datastring); // can we parse the serial
      if (typeof newarray == 'object') {
        dataarray = newarray;
      }
      console.log("got back " + datastring);
      } catch(err) {
      // got something that's not a json
    }
  }
}

function graphData(newData) {
  // map the range of the input to the window height:
  var yPos = map(newData, 0, 1023, 0, height);
  // draw the line
  line(xPos, height, xPos, height - yPos);
  // at the edge of the screen, go back to the beginning:
  if (xPos >= width) {
    xPos = 0;
    // clear the screen by resetting the background:
    background(0);
  } else {
    // pass
  }
}

function draw() {
  stroke('rgba(255,255,0,0.8)'); // yellow
  graphData(dataarray[0]);
  stroke('rgba(0,0,255,0.8)'); // blue
  graphData(dataarray[1]);
  xPos++;


  freq = map(dataarray[0], 100, 1100, 1, 8); // maps frequency from 1-8 as I need 8 notes in the scale.
  freq2 = map(dataarray[1], 100, 1100, 5, 20); // maps frequency from 5-20 hz for the modulator wave.
  freq = Math.round(freq); // rounds to nearest whole number

  if (playing) {
    mod.amp(1); // sets amplitude to 1, the highest.
    mod.freq(freq2); // sets the frequency of the modulator to equal sensor value mapped from 5-20
    osc.amp(mod); // this is the fun! maps the amp of carrier to the entire modulator wave

    // MIDI frequencies for bFlat Blues: 58, 61, 63, 64, 65, 68, 70
    // MIDI frequencies for bFlat Raga Lalit Scale: 58, 59, 62, 63, 64, 66, 69. 70


    // this switch case matches the 8 notes in the scale to midi numbers corresponding
    // to notes in the scale. midiToFreq() is a helpful function that converts the midi notation to
    // exact frequency of the note.
    switch (freq) {
      case 1:
        osc.freq(midiToFreq(58));
        break;
      case 2:
        osc.freq(midiToFreq(59));
        break;
      case 3:
        osc.freq(midiToFreq(62));
        break;
      case 4:
        osc.freq(midiToFreq(63));
        break;
      case 5:
        osc.freq(midiToFreq(64));
        break;
      case 6:
        osc.freq(midiToFreq(66));
        break;
      case 7:
        osc.freq(midiToFreq(69));
        break;
      case 8:
        osc.freq(midiToFreq(70));
        break;
    }

  }
}

function playOscillator() {
  // starting an oscillator on a user gesture will enable audio
  // in browsers that have a strict autoplay policy like Chrome (my primary browser)
  mod.disconnect(); // turns off the modulator wave so it doesn't make noise.
  osc.start(); // start carrier
  mod.start(); // start modulator
  playing = true; // starts playing!
}

var serial; // variable to hold an instance of the serialport library
var portName = 'COM4'; //rename to the name of your port
var dataarray = []; //some data coming in over serial!
var xPos = 0;
let monoSynth, playing, freq, osc, mod, freq2
var smootharray = [];


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


  let cnv = createCanvas(1200, 800);
  cnv.mousePressed(playOscillator);
  //cnv.mousePressed(playSynth);
  osc = new p5.Oscillator('sine');
  mod = new p5.Oscillator('sine');
  //monoSynth = new p5.MonoSynth();
  background(0x08, 0x16, 0x40);
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
  print('the serial port opened.')
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
    background(0x08, 0x16, 0x40);
  } else {
    // pass
  }
}


function draw() {
  stroke('rgba(255,255,52,0.25)'); // green
  graphData(dataarray[0]);
  stroke('rgba(0,80,255,0.5)'); // blue
  graphData(dataarray[1]);
  xPos++;

  freq = map(dataarray[0], 150, 1400, 60, 72);
  freq2 = map(dataarray[1], 150, 1400, 5, 20);


  if (playing) {
    mod.amp(1);
    mod.freq(freq2);
    osc.amp(mod);
    osc.freq(midiToFreq(freq));

  }
}



function playOscillator() {
  // starting an oscillator on a user gesture will enable audio
  // in browsers that have a strict autoplay policy.
  // See also: userStartAudio();
  mod.disconnect();
  osc.start();
  mod.start();
  playing = true;
}

/*
function mousePressed() {
  userStartAudio();
}
*/
/*
function playSynth() {
//  userStartAudio();
  let note = map(dataarray[0], 200, 2000, 0, 1);
  switch (note) {
    case 0:
      monoSynth.play('Fb4');
      break;
    case 1:
      monoSynth.play('G4');
      break;
    }
}
*/

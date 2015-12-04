var m;      // num magazzini
var n;      // num clienti
var c;      // matrice dei costi
var req;    // matrice delle richieste
var sol;    // matrice soluzione parziale
var solbest;// soluzione migliore
var cap;    // array delle capacità
var zub = Number.MAX_VALUE;  // costo miglior soluzione del run
var zubBest;   // miglior costo in assoluto
var bestAlg;   // algoritmo che ha trovato il miglior valore
var EPS = 0.00001;
var startTime, endTime, timeDiff;

var jInstance; // istanza letta
var inputData;
var istanza;
var dataGA;
var jsonGA = null;

function readGeneralAssignment()
{
    //var file = document.getElementById("jsonRemoteFile").value;
    var req = new XMLHttpRequest();
	var loc2 = 'http://astarte.csr.unibo.it/gapdata/fapgap.json';
    var loc = 'http://astarte.csr.unibo.it/gapdata/cesenaGAP.json';
    if ('withCredentials' in req)
    {
        req.open('GET', loc , true);
        req.onreadystatechange = function()
        {
            if (req.readyState === 4)
            {
                if (req.status >= 200 && req.status < 400){
                    //var parse = JSON.parse(req.responseText);
                    dataGA = req.responseText;
                    jsonGA = JSON.parse(dataGA);
                    assignData();
                    //alert("DATA= " + dataGA);
                }
                else{
                    alert("Errore nella lettura del JSON!");
                }
            }
        };
        req.send();
        alert("Data readed from location:\n" + loc);
    }
}

function assignData()
{
    var nome = jsonGA.nome;
    m = jsonGA.magazzini;//numero dei magazzini
    n = jsonGA.clienti;//numero dei clienti
    cap = jsonGA.cap;//vettore delle capacità dei magazzini
    c = new Array(m);
    var i = 0;
    var j = 0;

    for(i = 0; i < m; i++)
    {
        c[i] = jsonGA.costi[i];//costi per ogni magazzino(righe) e clienti(colonne)
        
    }
    req = new Array(m);
    for(i = 0; i < m; i++)
    {
        req[i] = jsonGA.req[i];// matrice delle richieste
    }
}

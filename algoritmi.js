function doGAPCostruttiva(){
	alert(" ..:: Eurista Costruttiva ::.. ");
    var i = 0;
    var j = 0;
    var ii = 0;

    var capLeft = cap.slice(); // array delle capacità residue
    var z = 0; // costo della soluzione

    sol = new Array(n);

    var dist = new Array(m);
    for(i = 0; i < m; i++)
        dist[i] = new Array(2);

    //do it!!
    for(j = 0; j < n; j++)
    {
        for(i = 0; i < m; i++)
        {
            dist[i][0] = req[i][j];
            dist[i][1] = i;
        }
        dist.sort(compareKey);

        ii = 0;
        while(ii < m)
        {
            i = dist[ii][1];
            if(capLeft[i] >= req[i][j])
            {
                sol[j] = i;
                capLeft[i] -= req[i][j];
                z += c[i][j];
				break;
            }
            ii++;
        }
    }
	
	zub = z;
    alert("Costo: " + z + " sol: " + sol + " checkSol:" + checkSol(sol));
}

function doOpt10(cost){
	//alert(" ..:: Opt-10 ::.. ");
	var i, j,isol, z=0;
	var isImproved;
	var capLeft = cap.slice();
	for(j=0;j<n; j++ )
	{
		//capacità residue
		capLeft[sol[j]] -= req[sol[j]][j];
		z += cost[sol[j]][j];
	}
	do
	{
		
	
		isImproved = false;
		for(j=0; j<n; j++)
		{
			isol = sol[j];
			for(i=0; i<m; i++)
			{
				if(i===isol) continue;
				
				if( cost[isol][j] >cost[i][j] && capLeft[i] >= req[i][j])
				{
					sol[j] = i;
					capLeft[i] -= req[i][j];
					capLeft[isol] += req[isol][j];
					z -= cost[isol][j] - cost[i][j];
					isImproved = true;
					break;
				}
			}
			if(isImproved) break;
		}
	}while(isImproved);
	//alert("z: " + z);
	return z;
	/*var checkVal = checkSol(sol);
	if(checkVal - z <= EPS)
		alert("Costo: " + z + " Soluzione: " + sol );
	else
		alert("soluzione errata!") */
}

function doAnn(){
	alert(" ..:: Simulated Anneling ::..");
	 if(zub > 0.99*Number.MAX_VALUE)
    {
        alert("Non hai fatto la costruttiva!! La faccio io per te!!");
        doGAPCostruttiva();
    }
    var i, isol, j;
    var z = 0;
    var T, p, rnd;
    var iter;
    var k = 1;
    var alpha = 0.95;
    var capLeft = cap.slice();
    for(j = 0; j < n; j++)
    {
        capLeft[sol[j]] -= req[sol[j]][j];
        z += c[sol[j]][j];
    }

    T = 1000;
    iter = 0;
    do
    {
        iter++;
        
        j = Math.floor(Math.random()*n);
        isol = sol[j];
        i = Math.floor(Math.random()*m);
        if(i == isol) i = (i+1)%m;

        if(c[isol][j] > c[i][j] && capLeft[i] >= req[i][j])
        {
            sol[j] = i;
            capLeft[i] -= req[i][j];
            capLeft[isol] += req[isol][j];
            z -= c[isol][j] - c[i][j];
            if(z < zub)
            {
                zub = z;
                solbest = sol.slice();
            }
            console.log("iter: "  + iter + " z = " + z);
        }
        else
        {
            if(capLeft[i] >= req[i][j])
            {
                p = Math.exp(-(c[i][j]-c[isol][j])/(k*T));
                rnd = Math.random();
                if(rnd < p)
                {
                    sol[j] = i;
                    capLeft[i] -= req[i][j];
                    capLeft[isol] += req[isol][j];
                    z -= c[isol][j] - c[i][j];
                    console.log("iter: "  + iter + " z = " + z + " Peggiorativo!!!");
                }
            }
        }
        if(iter%1000 == 0)
            T = alpha*T;

    } while(iter < 50000);
    var checkVal = Math.abs(checkSol(sol) - z);
    if(checkVal <= EPS )
        alert("Costo: " + z + " sol: " + sol);
    else
        alert("Errore!!");
	
}

function doTabuSearch(){

    //-----variabili
    var i, isol, j, iter;
    var z = 0;
    var deltaMax, tTenure, maxIter;
    var delta;
	var imax , jmax;
    var capLeft = cap.slice();

    //-----parametri
    tTenure = 2*n*m;
    maxIter = 1000;

	//Inizializziamo l'array tabu list
    var TL = new Array(m);
	//Creiamo la matrice
    for(i = 0; i < m; i++)
    {
        TL[i] = new Array(n);
    }
	
    for(j = 0; j < n; j++)
    {
        capLeft[sol[j]] -= req[sol[j]][j];
        z += c[sol[j]][j];
		//inizializzo al valore minimo tutta la matrice
        for(i = 0; i < m; i++)
            TL[i][j] = Number.MIN_VALUE;
    }

    iter = 0;
	imax = jmax = 0;
    do
    {
		
        delta = deltaMax = 0;
        for (j = 0; j < n; j++) 
        {
			
            isol = sol[j];
            for(i = 0; i < m; i++)
            {
                if(i == isol) continue;

                if(c[isol][j] > c[i][j] && capLeft[i] >= req[i][j])
                {
					delta = c[isol][j] - c[i][j];
                    if(delta > deltaMax && (TL[i][j] + tTenure) <= iter ){
						imax = i;
						jmax = j;
						deltaMax = c[isol][j] - c[i][j];
					}
                }
            } 
        }

        //-----migliore dell'intorno non tabù
        isol = sol[jmax];
		deltaMax = c[isol][jmax] - c[imax][jmax];
		sol[jmax] = imax;
		
        capLeft[imax] -= req[imax][jmax];
        capLeft[isol] += req[isol][jmax];
		
		TL[imax][jmax] = iter;
        z -= deltaMax;
		if(z < zub){
			zub = z;
			solbest = sol.slice();
			console.log("zub: " + zub);
			if(Math.abs(z -checkSol(sol) > EPS))
			console.log("TS, z= "+ z + " j: " + j + " da " + isol + " a " + i);
		}
			

        iter++;
    } while(iter < maxIter);

    var checkVal = Math.abs(checkSol(solbest) - z);
    if(checkVal <= EPS )
        alert("Costo: " + z + " sol: " + solbest);
    else
        alert("Errore!!");
}

function doILS(){
	
	var t0, t1, tt = 0;
	var i,j,k,z,iter;
	var maxiter, maxt;
	 if(zub> 0.99*Number.MAX_VALUE){
		 alert("Manca la costruttiva");
		 return;
	 }
	alert("..:: ILS ::..");
	t0 = new Date();
	
	iter = 0;
	maxiter = 10000;
	maxt = 2000; //millisecondi
	
	
	while(iter < maxiter && tt < maxt){
		z = doOpt10(c);
		if(z < zub){ zub = z;}
		
		dataPerturbation();
		iter++;
		
	}
		t1 = new Date();
		tt = t1 - t0; //time in ms
	alert("Sono passati" + tt + "millisecondi " + "zub= " + zub);
}
function dataPerturbation(){
	var i, j;
    var cprimo = new Array(m);

    for(i=0; i<m; i++){
        cprimo[i] = new Array(n);
    }

    for(i=0; i<m; i++){
        for(j=0; j<n; j++){
            //Genera un costo che differisce da quello iniziale del 0.25
            cprimo[i][j] = (c[i][j] * 0.75) + Math.random()*0.5*c[i][j];
        }
    }

    //Viene modificata la soluzione deltro l'optimizeSolution10 per cui quando torno all'interno del ciclo while lavoro sui nuovi dati.
    doOpt10(cprimo);
	
	
}


function doVNS(){
	
	var z = doOpt11(c);
	console.log("z: " + z);
		
}

function doOpt11(costi){
	
	var i, isol, j=0, j1=0, sj, sj1, temp = 0;
    var z = 0;
    var isImproved;
    var capLeft = cap.slice();
    var delta = 0;
    var a=0,b=0;

    for(j = 0; j < n; j++){
        capLeft[sol[j]] -= req[sol[j]][j];
        z += costi[sol[j]][j];
    }
    do
    {
        isImproved = false;
        for (j = 0; j < n-1; j++) 
        {
            for(j1 = (j+1) ; j1 < n; j1++)
            {
                sj = sol[j];
                sj1 = sol[j1];
                delta = 0;
                delta = (costi[sj][j] + costi[sj1][j1]) - (costi[sj][j1] + costi[sj1][j]);

                if(delta > 0)
                {
                    a = capLeft[sj] + req[sj][j];
                    b = capLeft[sj1] + req[sj1][j1];
                    if(a >= req[sj1][j1] && b >= req[sj][j])
                    {
                        sol[j] = sj1;
                        sol[j1] = sj;
                        sj = sol[j];
                        sj1 = sol[j1];
                        capLeft[sj] -= req[sj][j];
                        capLeft[sj] += req[sj][j1];
                        capLeft[sj1] -= req[sj1][j1];
                        capLeft[sj1] += req[sj1][j];
                        z = z - delta;
                        isImproved = true;
                        break;
                    }
                }
            }
            if(isImproved)
                break;     
        }     
    } while(isImproved);

    var checkVal = Math.abs(checkSol(sol) - z);
    if(checkVal <= EPS )
        return z;  
    else
        alert("Errore!!");

}


function GRASP(maxiter,k){
	var iter = 0;
	var z;
	var maxt = 2000; //millisecondi
	var tt = 0;
	var t0,t1;
	
	t0 = new Date();

	
	while(iter<maxiter && tt < maxt){
		z = doGRASP(k);
		if(z<zub) zub = z;
		z = doOpt10(c);
		if(z<zub) zub = z;
		z = doOpt11(c);
		if(z<zub) zub = z;
		console.log("[GRASP iter]: " + iter +" z: " + z + " zub: " + zub);
		iter++;
		t1 = new Date();
		tt = t1 - t0; //time in ms
	}
		
}


function doGRASP(k){
	alert("..:: GRASP ::..");
    var i = 0;
    var j = 0;
    var ii = 0;
	var icand;

    var capLeft = cap.slice(); // array delle capacità residue
    var z = 0; // costo della soluzione

    sol = new Array(n);

    var dist = new Array(m);
    for(i = 0; i < m; i++)
        dist[i] = new Array(2);

    for(j = 0; j < n; j++)
    {
        for(i = 0; i < m; i++)
        {
            dist[i][0] = req[i][j];
            dist[i][1] = i;
        }
        dist.sort(compareKey);
		
		icand = Math.floor(Math.random()*k+0,5);
        ii = 0;
        while(ii < m)
        {
            i = dist[(ii+icand)%m][1];
            if(capLeft[i] >= req[i][j])
            {
                sol[j] = i;
                capLeft[i] -= req[i][j];
                z += c[i][j];
				break;
            }
            ii++;
        }
    }
	if(z<zub)
	zub = z;
   // alert("Costo: " + z + " sol: " + sol + " checkSol:" + checkSol(sol));
   return z;
}

function compareKey(a,b){
    if(a[0] == b[0])
        return 0;
    else
        return (a[0] < b[0] ? -1 : 1);
}


// controllo ammissibilità della soluzione
function checkSol(sol){
   var z = 0,j;
   var capused = new Array(m);
	for(var x =0; x<capused.length; x++){
			capused[x] = 0;
			console.log("capused: " + capused[x] + "\n");
	}
   // controllo assegnamenti
   for (j = 0; j < n; j++)
      if (sol[j] < 0 || sol[j] >= m || sol[j]===undefined) 
      { //Se entra qua signafica che è un errore
		z = Number.MAX_VALUE;
         return z;
      } 
      else
         z += c[sol[j]][j];

   // controllo capacità
   for (j = 0; j < n; j++) 
   {  capused[sol[j]] += req[sol[j]][j];
      if (capused[sol[j]] > cap[sol[j]]) 
      { 
		//Se sfora le capacità
		z = Number.MAX_VALUE;
         return z;
      }
   }
   return z;
}

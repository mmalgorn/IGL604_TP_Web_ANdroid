/*

 @Author Sebastien livain

 */
 var express = require('express');
 var url = require('url');
 var fs = require("fs");
 var app = express();
 var bodyParser = require('body-parser');
 var http = require('http');
 var cors = require('cors');

 app.use(cors());
 app.use(bodyParser.json()); // support json encoded bodies
 app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodiesvar bodyParser = require('body-parser');
 app.use(bodyParser.json()); // support json encoded bodies
 app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

  // Chargement du fichier index.html affiché au client
  var serverIo = http.createServer(function(req, res) {
    res.writeHead(200, {
  'Access-Control-Allow-Origin' : '*'
  });
  });

  // Chargement de socket.io
  var io = require('socket.io').listen(serverIo);


 app.get('/ListeMatchs', function (req, res) {
   res.writeHead(200, {'Access-Control-Allow-Origin' : '*'});
   res.end(JSON.stringify(getListeJSON(TabMatch)));
 })

 app.post('/PriseParis', function (req, res) {
    // On recupere les parametres du paris du client
    var match_id = parseInt(req.body.match);
    var somme_pariee = parseInt(req.body.somme);
    var issue = parseInt(req.body.issue);
    var paris_id;
    var id = req.body.id;
    console.log('id_client_parieur recue: ' + id);



  if(TabMatch[match_id -1].Point[1][0]==0 && TabMatch[match_id -1].Point[1][1]==0){


    // On teste si le paris est valide
    if(match_id>=0 && match_id<=9){
      if(somme_pariee>0){
        if(issue == 0 || issue ==1 || issue ==2){

          //On lit le fichier de paris et recupere son contenu
          fs.readFile('Paris.json',function(err,content){
            if(err){
              console.log('fichier Paris inexistant, je le cree');
              fs.writeFile('Paris.json',{"Paris":[]});
              throw err;
            }
            //on stocke le contenu dans une variable temporaire JSON pour pouvoir ajouter le paris a la suite
            var parseJson = JSON.parse(content);

            console.log(parseJson.Paris.length);

            paris_id = parseJson.Paris.length+1;
            //On cree le paris et on l'ajoute a la variable JSON puis on reecrit cette variable dans notre fichier de Paris
            var nouveau_paris = {"somme" : somme_pariee, "match": match_id , "issue" : issue, "id" : id, "paris_id" : paris_id};
            parseJson.Paris.push(nouveau_paris);
            fs.writeFile('Paris.json',JSON.stringify(parseJson),function(err){
            if(err) throw err;
            })
          });
          // Tout s'est bien deroule, on envoie au client la confirmation de prise de paris
          var titre = TabMatch[match_id-1].Nom_Joueur_1+' - '+TabMatch[match_id-1].Nom_Joueur_2;
          var stringIssue;
          if(issue==0){stringIssue = TabMatch[match_id-1].Nom_Joueur_1;}
          else if(issue==1){stringIssue = TabMatch[match_id-1].Nom_Joueur_2;}
          else{stringIssue = 'egalite'}
          res.status(200).send('Votre paris de '+somme_pariee+' euros en faveur du joueur '+stringIssue+' du match '+ titre +' a bien ete enregistre.');
        }
        else {
          res.status(500).send("Erreur, vous essayez de parier sur une issue impossible");}
      }
      else {
        res.status(500).send("Erreur, vous essayez de parier une somme negative");}
    }
    else {
      res.status(500).send("Erreur, le match sur lequel vous voulez parier n'existe pas...");}

  }
  else{
    res.status(500).send("Erreur, le match a passé la premiere manche");}
 });


var gestionGains = require('./GestionGains.js');
var emiteur = require('events').EventEmitter;
var monEmitter = new emiteur.EventEmitter();

var myListener = function(match, gagnant){
  console.log('Le match '+match+' vient de se terminer: '+gagnant);
  var titre = TabMatch[match-1].Nom_Joueur_1+' - '+TabMatch[match-1].Nom_Joueur_2;
  console.log(titre);
  gestionGains.calculerGains(match,gagnant);
  var data = {titre: titre, contenu: "Le match vient de se terminer:"+gagnant};
  io.of('match'+match).emit('match',data);

  fs.readFile('Gains.json',function(err,content){
    if(err){
      console.log('erruer avec le fichier Gains');
      throw err;
    }
    var parseJson = JSON.parse(content);
    console.log(parseJson.Gains.length);
    var taille = parseJson.Gains.length;
    var id_client;
    for(var i=0; i<taille; i++){
      id_client = parseJson.Gains[i].id;
      var gain = parseJson.Gains[i].gains;
      var data = {titre: "GAGNE!", contenu: 'Felicitations! Vous avez gagne un total de '+gain+' euros'};
      console.log("FIN DE MATCH: "+data+' '+gain+' '+id_client);
      io.emit(id_client, data);
    }
  })
};

var myListenerChangement = function(match, changement){
  var titre = TabMatch[match-1].Nom_Joueur_1+' - '+TabMatch[match-1].Nom_Joueur_2;
  console.log('Il y a du changement dans le match '+titre+': '+changement);

  var data = {titre: titre, contenu: changement};
  io.of('match'+match).emit('match',data);
};

monEmitter.addListener('MatchFini', myListener);
monEmitter.addListener('notification', myListenerChangement);





app.post('/GainRecu', function (req, res) {
   var id = req.body.id;

   fs.readFile('Gains.json',function(err,content){
     if(err){
       console.log('fichier Gains inexistant, je le cree');
       fs.writeFile('Gains.json',{"Gains":[]});
       throw err;
     }
     //on stocke le contenu dans une variable temporaire JSON pour pouvoir ajouter le paris a la suite
     var parseJson = JSON.parse(content);
     var newJson = {"Gains":[]};
     console.log(parseJson);

     var taille = parseJson.Gains.length;
     console.log(taille);
     for(var i=0; i<taille; i++){
       if(parseJson.Gains[i]!=null){
         if(parseJson.Gains[i].id==id){
           delete parseJson.Gains[i];
         }
         else{
           newJson.Gains.push(parseJson.Gains[i]);
         }
       }
     }
     fs.writeFile('Gains.json',JSON.stringify(newJson),function(err){
     if(err) throw err;
     })
   })
   res.status(200).send("Confirmation de reception de confirmation de reception de votre gain");
});

app.post('/Connexion', function(req, res){
  var id = req.body.id;
  fs.readFile('Gains.json',function(err,content){
    if(err){
      console.log('fichier Gains inexistant, je le cree');
      fs.writeFile('Gains.json',{"Gains":[]});
      throw err;
    }
    //on stocke le contenu dans une variable temporaire JSON pour pouvoir ajouter le paris a la suite
    var parseJson = JSON.parse(content);
    var taille = parseJson.Gains.length;
    var somme = 0;

    for(var i=0; i<taille; i++){
      if(parseJson.Gains[i]!=null){
        if(parseJson.Gains[i].id==id){
          somme += parseJson.Gains[i].gains;
        }
      }
    }
    console.log(somme);
      res.status(200).end(''+somme);
  })
})


var server = app.listen(3000, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at http://%s:%s", host, port);
 });


io.set('origins', '*:*');

 // Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
});



 serverIo.listen(8080);




//CODE DE NICO
var match=require("./Match");
//var chrono = require('./Chrono');

console.log("On lance le serveur");


  /*Initialisation des matchs*/
  var Match1=Object.create(match.Match);
  var Point1=[[0,0],[0,0],[0,0]];
  var Score1=['0','0'];
  var Cont1=[3,3];
  Match1.init("Nadal","Raphael","Federer","Roger", Point1, Score1,Cont1, 1);
  Match1.Temp_init=Date.now();


  var Match2=Object.create(match.Match);
  var Point2=[[0,0],[0,0],[0,0]];
  var Score2=['0','0'];
  var Cont2=[3,3];
  Match2.init("Djokovic","Novak","Murray","Andy",Point2, Score2,Cont2,2);
  Match2.Temp_init=Date.now();

  var Match3=Object.create(match.Match);
  var Point3=[[0,0],[0,0],[0,0]];
  var Score3=['0','0'];
  var Cont3=[3,3];
  Match3.init("Agassi","Andre","Sampras","Pete",Point3, Score3,Cont3,3);
  Match3.Temp_init=Date.now();

  var Match4=Object.create(match.Match);
  var Point4=[[0,0],[0,0],[0,0]];
  var Score4=['0','0'];
  var Cont4=[3,3];
  Match4.init("Lendl","Ivan","Connor","Jimmy",Point4, Score4,Cont4,4);
  Match4.Temp_init=Date.now();

  var Match5=Object.create(match.Match);
  var Point5=[[0,0],[0,0],[0,0]];
  var Score5=['0','0'];
  var Cont5=[3,3];
  Match5.init("McEnroe","John","borg","Bjorn",Point5, Score5,Cont5,5);
  Match5.Temp_init=Date.now();

  var Match6=Object.create(match.Match);
  var Point6=[[0,0],[0,0],[0,0]];
  var Score6=['0','0'];
  var Cont6=[3,3];
  Match6.init("Noah","Yannick","Becker","Boris",Point6, Score6,Cont6,6);
  Match6.Temp_init=Date.now();

  var Match7=Object.create(match.Match);
  var Point7=[[0,0],[0,0],[0,0]];
  var Score7=['0','0'];
  var Cont7=[3,3];
  Match7.init("Wawrinka","Stanislas","Laver","Rod",Point7, Score7,Cont7,7);
  Match7.Temp_init=Date.now();

  var Match8=Object.create(match.Match);
  var Point8=[[0,0],[0,0],[0,0]];
  var Score8=['0','0'];
  var Cont8=[3,3];
  Match8.init("Kuerten","Gustavo","Berdych","Tomas",Point8, Score8,Cont8,8);
  Match8.Temp_init=Date.now();

  var Match9=Object.create(match.Match);
  var Point9=[[0,0],[0,0],[0,0]];
  var Score9=['0','0'];
  var Cont9=[3,3];
  Match9.init("Edberg","Stefan","Lacoste","René",Point9, Score9,Cont9,9);
  Match9.Temp_init=Date.now();

  var Match10=Object.create(match.Match);
  var Point10=[[0,0],[0,0],[0,0]];
  var Score10=['0','0'];
  var Cont10=[3,3];
  Match10.init("Roddick","Andy","Sharapova","Maria",Point10, Score10,Cont10,10);
  Match10.Temp_init=Date.now();



  //On met les matchs dans un tableau
  var TabMatch=[Match1,Match2,Match3,Match4,Match5,Match6,Match7,Match8,Match9,Match10];



  setInterval(function(){incrementer_chrono(TabMatch)},1000);
  setInterval(function(){Scenario(TabMatch)},500);
  //setInterval(function(){affichageTableau(TabMatch)},2000);


function affichageTableau(TabMatch){
    //Affichage de l'etat des matchs
    for(j=0;j<10;j++){
      console.log(TabMatch[j].Point +'\t' +   TabMatch[j].Score  +  '\t' +TabMatch[j].Gagnant + '\t'+TabMatch[j].Chrono + '\t' + TabMatch[j].Premiere_manche_notifie + '\t' + TabMatch[j].Fin_notifie);
    }
    console.log("\n\n");


  //console.log(getListeJSON(TabMatch));
}

function Scenario(TabMatch){

    var aleat1=getRandomIntInclusive(0,1);
    var aleat2=getRandomIntInclusive(0,9);

    var i,j;

    //ajout de 10 point aleatoire
    for(i=0;i<20;i++){
      aleat1=getRandomIntInclusive(0,1);
      aleat2=getRandomIntInclusive(0,9);


      TabMatch[aleat2].ajout_point(aleat1);


      //si une manche vient d'être gagné
        //premiere manche
      if( TabMatch[aleat2].Premiere_manche_notifie==false &&   ( (TabMatch[aleat2].Point[1][0]==1&&TabMatch[aleat2].Point[1][1]==0) ||  (TabMatch[aleat2].Point[1][0]==0&&TabMatch[aleat2].Point[1][1]==1)   )  ){
          if(TabMatch[aleat2].Point[0][0]==7 || (TabMatch[aleat2].Point[0][0]==6 && TabMatch[aleat2].Point[0][1]<5)  ){monEmitter.emit("notification",TabMatch[aleat2].identifiant_match,"Le joueur "+TabMatch[aleat2].Nom_Joueur_1+" gagne la manche 1");}//si joueur 1 gagne la manche 1
          else if(TabMatch[aleat2].Point[0][1]==7  || (TabMatch[aleat2].Point[0][0]==6 && TabMatch[aleat2].Point[0][1]<5)  ){monEmitter.emit("notification",TabMatch[aleat2].identifiant_match,"Le joueur "+TabMatch[aleat2].Nom_Joueur_2+" gagne la manche 1");}//si joueur 2 gagne la manche 1
          else {monEmitter.emit("notification",TabMatch[aleat2].identifiant_match,"La 1ere manche s'est terminee sur un egalite");}//s'il y a égalité

          TabMatch[aleat2].Premiere_manche_notifie=true;
      }
        //deuxieme manche
      if( TabMatch[aleat2].Deuxieme_manche_notifie==false &&   ( (TabMatch[aleat2].Point[2][0]==1&&TabMatch[aleat2].Point[2][1]==0) ||  (TabMatch[aleat2].Point[2][0]==0&&TabMatch[aleat2].Point[2][1]==1)    )    ){
          if(TabMatch[aleat2].Point[1][0]==7 || (TabMatch[aleat2].Point[1][0]==6 && TabMatch[aleat2].Point[1][1]<5)  ){monEmitter.emit("notification",TabMatch[aleat2].identifiant_match,"Le joueur "+TabMatch[aleat2].Nom_Joueur_1+" gagne la manche 2");}//si joueur 1 gagne la manche 1
          else if(TabMatch[aleat2].Point[1][1]==7   || (TabMatch[aleat2].Point[1][0]==6 && TabMatch[aleat2].Point[1][1]<5)  ){monEmitter.emit("notification",TabMatch[aleat2].identifiant_match,"Le joueur "+TabMatch[aleat2].Nom_Joueur_2+" gagne la manche 2");}//si joueur 2 gagne la manche 1
          else {monEmitter.emit("notification",TabMatch[aleat2].identifiant_match,"La 2e manche s'est terminee sur un egalite");}//s'il y a égalité
          TabMatch[aleat2].Deuxieme_manche_notifie=true;
      }

      //Emission d'un signal si le match se termine et que rien n'a été notifié
      if(TabMatch[aleat2].Gagnant != 3  &&  TabMatch[aleat2].Fin_notifie==false){
        if(TabMatch[aleat2].Gagnant==0){
          monEmitter.emit('MatchFini',TabMatch[aleat2].identifiant_match,TabMatch[aleat2].Nom_Joueur_1 +' gagne face à '+ TabMatch[aleat2].Nom_Joueur_2);
        }
        else{
          monEmitter.emit('MatchFini',TabMatch[aleat2].identifiant_match,TabMatch[aleat2].Nom_Joueur_2 +' gagne face à '+ TabMatch[aleat2].Nom_Joueur_1);
        }
        TabMatch[aleat2].Fin_notifie=true;
      }


    }

    //ajout d'un contestation aleatoire
    aleat1=getRandomIntInclusive(0,1);
    aleat2=getRandomIntInclusive(0,9);

    //on emet un signal a chaque contestation emise
    if(TabMatch[aleat2].Gagnant==3  &&  TabMatch[aleat2].Cont[aleat1]>0){
      if(aleat1==1){
        monEmitter.emit("notification",TabMatch[aleat2].identifiant_match,"Le joueur "+ TabMatch[aleat2].Nom_Joueur_1 +" a conteste");
      }
      else if(aleat1==0){
        monEmitter.emit("notification",TabMatch[aleat2].identifiant_match,"Le joueur "+ TabMatch[aleat2].Nom_Joueur_2 +" a conteste");
      }
    }

    TabMatch[aleat2].ajout_contestation(aleat1);


};


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
};

function getListeJSON(TabMatch){

  var ListeMatch =  [{
         id : 1,
         joueur1:{
           Nom:TabMatch[0].Nom_Joueur_1,
           Prenom:TabMatch[0].Prenom_Joueur_1,
         },
         joueur2:{
           Nom:TabMatch[0].Nom_Joueur_2,
           Prenom: TabMatch[0].Prenom_Joueur_2,
         },
         manche : [[TabMatch[0].Point[0][0],TabMatch[0].Point[1][0],TabMatch[0].Point[2][0]],[TabMatch[0].Point[0][1],TabMatch[0].Point[1][1],TabMatch[0].Point[2][1]]],
         score : TabMatch[0].Score,
         contestation : TabMatch[0].Cont,
         service : (TabMatch[0].JoueurAuService==1? true:false) ,
         chrono : parseInt(TabMatch[0].Chrono)
       },
       {
         id : 2,
         joueur1:{
           Nom:TabMatch[1].Nom_Joueur_1,
           Prenom:TabMatch[1].Prenom_Joueur_1,
         },
         joueur2:{
           Nom:TabMatch[1].Nom_Joueur_2,
           Prenom: TabMatch[1].Prenom_Joueur_2,
         },
         manche : [[TabMatch[1].Point[0][0],TabMatch[1].Point[1][0],TabMatch[1].Point[2][0]],[TabMatch[1].Point[0][1],TabMatch[1].Point[1][1],TabMatch[1].Point[2][1]]],
         score : TabMatch[1].Score,
         contestation : TabMatch[1].Cont,
         service : (TabMatch[1].JoueurAuService==1? true:false) ,
         chrono : parseInt(TabMatch[1].Chrono)
       }
  ];

       for(var p=2;p<10;p++){
          var temp={
           id : p+1,
           joueur1:{
             Nom:TabMatch[p].Nom_Joueur_1,
             Prenom:TabMatch[p].Prenom_Joueur_1,
           },
           joueur2:{
             Nom:TabMatch[p].Nom_Joueur_2,
             Prenom: TabMatch[p].Prenom_Joueur_2,
           },
           manche : [[TabMatch[p].Point[0][0],TabMatch[p].Point[1][0],TabMatch[p].Point[2][0]],[TabMatch[p].Point[0][1],TabMatch[p].Point[1][1],TabMatch[p].Point[2][1]]],
           score : TabMatch[p].Score,
           contestation : TabMatch[p].Cont,
           service : (TabMatch[p].JoueurAuService==1? true:false) ,
           chrono : parseInt(TabMatch[p].Chrono)
         };
         ListeMatch.push(temp);
      }

      return ListeMatch;
}


incrementer_chrono = function (TabMatch){

  for(var a=0;a<10;a++){

      if(TabMatch[a].Gagnant==3){TabMatch[a].Chrono=(Date.now() - TabMatch[a].Temp_init)/1000;}
  }

};

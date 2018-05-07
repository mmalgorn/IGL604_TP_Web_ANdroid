var fs = require("fs");
exports.calculerGains = function (match,gagnant){
  fs.readFile('Paris.json',function(err,content){
    if(err) throw err;
    //on stocke le contenu dans une variable temporaire JSON pour pouvoir ajouter le paris a la suite
    var parseJson = JSON.parse(content);
    var parieurs=new Array();
    var somme_paris=0;

    var taille=parseJson.Paris.length;
    //On calcule le total de la somme des paris sur ce match et stocke les id des parieurs gagnants dans un tableau
    for(var i=0; i<taille; i++){
      if((parseJson.Paris[i].match)==match){
        if(parseJson.Paris[i].issue=gagnant){parieurs.push(parseJson.Paris[i].id);}
        somme_paris+=parseJson.Paris[i].somme;
      }
    }

    var taille2=parieurs.length;
    console.log('nombre de parieurs sur ce match: '+taille2);
    for(var j=0; j<taille2; j++){
      console.log('parieur['+j+'] : '+parieurs[j]);
      for(var k=0; k<taille; k++){
        if(parseJson.Paris[k].match==match && parseJson.Paris[k].id==parieurs[j]){
          var gain =(parseJson.Paris[k].somme/somme_paris)*(somme_paris*0.75);
          var nouveau_gagnant = {"paris_id": parseJson.Paris[k].paris_id, "id" : parieurs[j], "gains" : gain};

          fs.readFile('Gains.json',function(err,content){
            if(err){
              console.log('fichier Gains inexistant, je le cree');
              fs.writeFile('Gains.json',{"Gains":[]});
              throw err;
            }
            var parseGains = JSON.parse(content);
            parseGains.Gains.push(nouveau_gagnant);
            fs.writeFile('Gains.json',JSON.stringify(parseGains),function(err){
            if(err) throw err;
            })
        })
      }
    }
  }
})

}

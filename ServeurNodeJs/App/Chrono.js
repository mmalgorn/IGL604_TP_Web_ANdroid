

exports.lancer_chrono = function(Match) {
  const temps_zero = Date.now();
  console.log(match + ': chrono lance');
    setInterval(function(){incrementer_chrono(temps_zero, match);},1000);
};


incrementer_chrono = function (temps, Match){
  Match.Chrono=(Date.now() - temps)/1000;
  console.log(Match.Chrono + 's');
};

chrono.lancer_chrono('match1');
setTimeout(function(){chrono.lancer_chrono('match2');}, 3000);

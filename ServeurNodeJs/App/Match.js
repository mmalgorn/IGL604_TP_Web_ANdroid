var Match={

    //Match
    identifiant_match:1,

    //Joueurs
    Prenom_Joueur_1:"A",
    Prenom_Joueur_2:"A",
    Nom_Joueur_1:"A",
    Nom_Joueur_2:"A",

    //Chronometre
    Chrono:0,
    Temp_init:0,

    //Joueur au service
    JoueurAuService:0,

    //Pointage
    Point:[[0,0],[0,0],[0,0]],
    Score:['0','0'],

    //gagnant
    Gagnant:3,
    Fin_notifie:false,
    Premiere_manche_notifie:false,
    Deuxieme_manche_notifie:false,
    //Contestations
    Cont:[3,3],


    init: function(Nom_joueur1,Prenom_joueur1,Nom_joueur2,Prenom_joueur2,Point, Score,Cont,ident_match){
        this.Prenom_Joueur_1=Prenom_joueur1,
        this.Prenom_Joueur_2=Prenom_joueur2,
        this.Nom_Joueur_1=Nom_joueur1;
        this.Nom_Joueur_2=Nom_joueur2;
        this.identifiant_match=ident_match;
        this.Point=Point;
        this.Score=Score;
        this.Cont=Cont;
        this.Gagnant=3;
        this.Premiere_manche_notifie=false;
        this.Deuxieme_manche_notifie=false;




    },

    ajout_point: function(joueur){
        if(this.Gagnant == 3){
            var retour=3;
            var autre; if(joueur==0){autre=1;}else{autre=0;}

            exemple=['0','15','30','40','40A'];

            //On chercher l'index du score du joueur
            var index=0;
            while(this.Score[joueur] != exemple[index]){index++;}

            //On change le joueur au service
            if(this.JoueurAuService==0){this.JoueurAuService=1;}
            else {this.JoueurAuService=0;}

            //Ajout du set gagné
            //si le joueur qui gagne le point a 40A => gain du score
            if(this.Score[joueur]==exemple[4]){
                this.Score[joueur]=exemple[0];
                this.Score[autre]=exemple[0]; 
                this.ajout_score(joueur);
            }

            //s'il a 40 et l'autre 40A
            else if(this.Score[joueur]==exemple[3]&&this.Score[autre]==exemple[4]){
                this.Score[joueur]=exemple[4];
                this.Score[autre]=exemple[3];
            }

            //sinon on incrémente
            else{
                this.Score[joueur]=exemple[index+1];
            }
        }
    },

    ajout_score:function(joueur){   // j1 gagne:0    j2 gagne:1    egalite:2   jeu en cours:3
        var i=0;
        if((this.Point[i][0]==6 && this.Point[i][1]==6) || (this.Point[i][0]==7 || this.Point[i][1]==7)  || (this.Point[i][0]==6 && this.Point[i][1]<5)  || (this.Point[i][1]==6 && this.Point[i][0]<5) ){i++;}  //si les lignes sont pleines (6-6 ou un des scores a 7)
        if((this.Point[i][0]==6 && this.Point[i][1]==6) || (this.Point[i][0]==7 || this.Point[i][1]==7)   || (this.Point[i][0]==6 && this.Point[i][1]<5)  || (this.Point[i][1]==6 && this.Point[i][0]<5) ){i++;}

        if(this.Gagnant==3){this.Point[i][joueur]++;}

        //si égalité
        if(this.Point[2][0]==6 && this.Point[2][1]==6){this.Gagnant=2;}
        //si le premier joueur gagne
        else if(this.Point[2][0]==7 || (this.Point[2][0]==6 && this.Point[2][1]<5)  ){this.Gagnant=0;}
        //si le deuxieme gagne
        else if(this.Point[2][1]==7  ||  (this.Point[2][1]==6 && this.Point[2][0]<5)  ){this.Gagnant=1;}
    },

    ajout_contestation: function(joueur){
        if(this.Cont[joueur]>0){this.Cont[joueur]--;}
    },


};

exports.Match=Match;
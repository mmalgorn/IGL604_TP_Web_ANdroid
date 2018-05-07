package Serveur;

import Common.*;

public class RequestHandler extends MessageHandler implements Runnable {
	
	public RequestHandler(Message requete, TennisTournamentServer tennisTournamentServer) {
		super(requete, tennisTournamentServer);
	}

	@Override
	public void run() {
		// TODO Auto-generated method stub
		
	}

}

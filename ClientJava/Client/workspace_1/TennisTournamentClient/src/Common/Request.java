package Common;

import java.net.DatagramPacket;
import java.net.InetAddress;

public class Request extends Message {

	public static Request unmarshall(byte[] request) {
		// TODO Auto-generated method stub
		return (Request) Marshallizer.unmarshall(request);
	}

	public static Request unmarshall(DatagramPacket request) {
		return (Request) Marshallizer.unmarshall(request.getData());
	}

	// type de message h�rit� de message
	// numero de la requ�te originelle h�rit� de message
	
	// emetteur, h�rit� de message
	// port, h�rit� de message
	
	// r�ponse h�rit� de message

	public String  originalSender; 	// �metteur de la requ�te originelle, celui � qui il faut r�pondre
	public int originalPort;				// port de l'�metteur de la requ�te originelle, celui qu'il faut utiliser pour r�pondre

	public  String method;  				// nom de la m�thode � invoquer, il n'y a qu'une seule valeur possible getIPFor

	public String getOriginalSender() {
		return originalSender;
	}

	public void setOriginalSender(String originalSender) {
		this.originalSender = originalSender;
	}

	public int getOriginalPort() {
		return originalPort;
	}

	public void setOriginalPort(int originalPort) {
		this.originalPort = originalPort;
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}

}
